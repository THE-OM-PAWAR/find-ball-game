import os
import sys
import struct
import json
import subprocess
import shutil

TINY_PNG = bytes([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
    0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
])

def optimize_animation_glb(src_path, dst_path):
    """
    Creates an ultra-lightweight animation-only GLB (< 50KB):
    Retains the exact skeletal node hierarchy and animation channels,
    while removing 100% of duplicate meshes, skins, materials, and textures.
    """
    with open(src_path, 'rb') as f:
        magic, ver, length = struct.unpack('<4sII', f.read(12))
        chunk_len, chunk_type = struct.unpack('<I4s', f.read(8))
        json_bytes = f.read(chunk_len)
        data = json.loads(json_bytes.decode('utf-8'))
        bin_len, bin_type = struct.unpack('<I4s', f.read(8))
        bin_data = f.read(bin_len)

    animations = data.get('animations', [])
    if not animations:
        print(f"[SKIP] No animations in {src_path}")
        return

    # Find all accessors referenced by animations
    used_acc_indices = set()
    for anim in animations:
        for s in anim.get('samplers', []):
            used_acc_indices.add(s['input'])
            used_acc_indices.add(s['output'])

    old_accessors = data.get('accessors', [])
    old_bvs = data.get('bufferViews', [])

    new_bin = bytearray()
    new_bvs = []
    new_accessors = []
    acc_remap = {}

    # Build new minimal buffer
    for old_acc_idx in sorted(used_acc_indices):
        old_acc = old_accessors[old_acc_idx]
        old_bv_idx = old_acc['bufferView']
        old_bv = old_bvs[old_bv_idx]

        bv_offset = old_bv.get('byteOffset', 0)
        bv_len = old_bv['byteLength']

        # Accessor byte offset within bufferView
        acc_byte_offset = old_acc.get('byteOffset', 0)

        # Extract data
        chunk = bin_data[bv_offset:bv_offset + bv_len]

        while len(new_bin) % 4 != 0:
            new_bin.append(0)

        new_bv_offset = len(new_bin)
        new_bin.extend(chunk)

        new_bv_idx = len(new_bvs)
        new_bvs.append({
            'buffer': 0,
            'byteOffset': new_bv_offset,
            'byteLength': bv_len
        })

        new_acc_idx = len(new_accessors)
        new_acc = dict(old_acc)
        new_acc['bufferView'] = new_bv_idx
        new_accessors.append(new_acc)

        acc_remap[old_acc_idx] = new_acc_idx

    # Remap animation samplers
    for anim in animations:
        for s in anim.get('samplers', []):
            s['input'] = acc_remap[s['input']]
            s['output'] = acc_remap[s['output']]

    # Clean nodes (keep hierarchy and names, strip mesh/skin references)
    for node in data.get('nodes', []):
        node.pop('mesh', None)
        node.pop('skin', None)

    # Reconstruct clean GLTF structure
    clean_data = {
        'asset': data.get('asset', {'version': '2.0', 'generator': 'GullyAssetOptimizer'}),
        'scene': data.get('scene', 0),
        'scenes': data.get('scenes', [{'nodes': [0]}]),
        'nodes': data.get('nodes', []),
        'animations': animations,
        'accessors': new_accessors,
        'bufferViews': new_bvs,
        'buffers': [{'byteLength': len(new_bin)}]
    }

    new_json_bytes = json.dumps(clean_data, separators=(',', ':')).encode('utf-8')
    while len(new_json_bytes) % 4 != 0:
        new_json_bytes += b' '

    total_len = 12 + 8 + len(new_json_bytes) + 8 + len(new_bin)

    with open(dst_path, 'wb') as f:
        f.write(struct.pack('<4sII', magic, ver, total_len))
        f.write(struct.pack('<I4s', len(new_json_bytes), b'JSON'))
        f.write(new_json_bytes)
        f.write(struct.pack('<I4s', len(new_bin), b'BIN\0'))
        f.write(new_bin)

    orig_sz = length / (1024 * 1024)
    new_sz = os.path.getsize(dst_path) / 1024
    print(f"[ANIM] {os.path.basename(src_path)}: {orig_sz:.2f} MB -> {new_sz:.1f} KB")



def optimize_model_glb(src_path, dst_path, max_dim=1024, quality=80):
    """
    Compresses heavy embedded textures using sips to reasonable resolution & high-quality JPEG/PNG.
    """
    temp_dir = os.path.join(os.path.dirname(__file__), '.temp_opt')
    os.makedirs(temp_dir, exist_ok=True)

    with open(src_path, 'rb') as f:
        magic, ver, length = struct.unpack('<4sII', f.read(12))
        chunk_len, chunk_type = struct.unpack('<I4s', f.read(8))
        json_bytes = f.read(chunk_len)
        data = json.loads(json_bytes.decode('utf-8'))
        bin_len, bin_type = struct.unpack('<I4s', f.read(8))
        bin_data = f.read(bin_len)

    bvs = data.get('bufferViews', [])
    images = data.get('images', [])
    
    # Map from bufferView index to compressed image bytes
    compressed_img_bytes = {}
    
    for i, img in enumerate(images):
        if 'bufferView' not in img:
            continue
        bv_idx = img['bufferView']
        bv = bvs[bv_idx]
        offset = bv.get('byteOffset', 0)
        byte_len = bv['byteLength']
        
        orig_mime = img.get('mimeType', 'image/png')
        ext = 'jpg' if 'jpeg' in orig_mime else 'png'
        
        raw_img = bin_data[offset:offset+byte_len]
        in_file = os.path.join(temp_dir, f'in_{i}.{ext}')
        out_file = os.path.join(temp_dir, f'out_{i}.{ext}')
        
        with open(in_file, 'wb') as f_img:
            f_img.write(raw_img)
            
        # Optimize with sips (macOS hardware-accelerated image tool)
        cmd = ['sips', '-Z', str(max_dim), in_file, '--out', out_file]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        if os.path.exists(out_file) and os.path.getsize(out_file) < len(raw_img):
            with open(out_file, 'rb') as f_out:
                compressed_img_bytes[bv_idx] = f_out.read()
        else:
            compressed_img_bytes[bv_idx] = raw_img

    # Rebuild binary buffer
    new_bin = bytearray()
    for i, bv in enumerate(bvs):
        offset = bv.get('byteOffset', 0)
        byte_len = bv['byteLength']
        
        while len(new_bin) % 4 != 0:
            new_bin.append(0)
            
        new_offset = len(new_bin)
        
        if i in compressed_img_bytes:
            c_data = compressed_img_bytes[i]
            new_bin.extend(c_data)
            bv['byteOffset'] = new_offset
            bv['byteLength'] = len(c_data)
        else:
            chunk = bin_data[offset:offset+byte_len]
            new_bin.extend(chunk)
            bv['byteOffset'] = new_offset
            bv['byteLength'] = len(chunk)

    while len(new_bin) % 4 != 0:
        new_bin.append(0)

    if 'buffers' in data and len(data['buffers']) > 0:
        data['buffers'][0]['byteLength'] = len(new_bin)

    new_json_bytes = json.dumps(data, separators=(',', ':')).encode('utf-8')
    while len(new_json_bytes) % 4 != 0:
        new_json_bytes += b' '

    total_len = 12 + 8 + len(new_json_bytes) + 8 + len(new_bin)

    with open(dst_path, 'wb') as f:
        f.write(struct.pack('<4sII', magic, ver, total_len))
        f.write(struct.pack('<I4s', len(new_json_bytes), b'JSON'))
        f.write(new_json_bytes)
        f.write(struct.pack('<I4s', len(new_bin), b'BIN\0'))
        f.write(new_bin)

    orig_sz = os.path.getsize(src_path) / (1024 * 1024)
    new_sz = os.path.getsize(dst_path) / (1024 * 1024)
    print(f"[MODEL] {os.path.basename(src_path)}: {orig_sz:.2f} MB -> {new_sz:.2f} MB")

    # Cleanup temp
    shutil.rmtree(temp_dir, ignore_errors=True)

if __name__ == '__main__':
    public_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public')
    
    # 1. Animation files to optimize (strip duplicate mesh textures)
    anim_files = [
        'Walking.fbx.glb',
        'Jump.fbx.glb',
        'Standing To Crouched.fbx.glb',
        'Crouching Idle.fbx.glb',
        'Crouch Walk.fbx.glb',
        'Crouched To Standing.fbx.glb',
        'Climbing Up Wall.fbx.glb',
        'Climbing Ladder.fbx.glb'
    ]
    
    print("--- OPTIMIZING ANIMATION GLBS ---")
    for fname in anim_files:
        p = os.path.join(public_dir, fname)
        if os.path.exists(p):
            optimize_animation_glb(p, p)
            
    print("\n--- OPTIMIZING 3D MODELS ---")
    model_configs = [
        ('Ch38_nonPBR.fbx.glb', 1024),
        ('tree_elm.glb', 1024),
        ('tree_3d_model_linden_tree.glb', 1024),
        ('dog/dog.glb', 1024),
    ]
    
    for fname, dim in model_configs:
        p = os.path.join(public_dir, fname)
        if os.path.exists(p):
            optimize_model_glb(p, p, max_dim=dim)
