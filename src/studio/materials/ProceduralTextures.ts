import * as THREE from 'three';

interface PBRTextureSet {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
}

const textureCache = new Map<string, PBRTextureSet>();

/**
 * Creates clean, photorealistic architectural wall PBR textures
 * Smooth subtle lime wash gradient, delicate micro-grain, NO harsh blotches
 */
export function createPeelingWallPBR(
  baseColor = '#8fa3b3',
  undercoatColor = '#a1b4c4',
  flakingPlasterColor = '#d5e3ed'
): PBRTextureSet {
  const key = `wall_clean_pbr_${baseColor}_${undercoatColor}_${flakingPlasterColor}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const w = 1024;
  const h = 1024;

  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = w;
  albedoCanvas.height = h;
  const ctxA = albedoCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = w;
  bumpCanvas.height = h;
  const ctxB = bumpCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = w;
  roughCanvas.height = h;
  const ctxR = roughCanvas.getContext('2d')!;

  // 1. Albedo Base
  ctxA.fillStyle = baseColor;
  ctxA.fillRect(0, 0, w, h);

  // Soft architectural vertical light gradient
  const grad = ctxA.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(255,255,255,0.08)');
  grad.addColorStop(0.5, 'rgba(0,0,0,0.01)');
  grad.addColorStop(1, 'rgba(0,0,0,0.06)');
  ctxA.fillStyle = grad;
  ctxA.fillRect(0, 0, w, h);

  // 2. Bump Base (Smooth uniform plaster relief)
  ctxB.fillStyle = '#808080';
  ctxB.fillRect(0, 0, w, h);

  // 3. Roughness Base (Smooth matte plaster = 0.85)
  ctxR.fillStyle = '#d6d6d6';
  ctxR.fillRect(0, 0, w, h);

  // 4. Subtle micro surface texture (plaster grain)
  ctxA.fillStyle = 'rgba(255,255,255,0.025)';
  for (let i = 0; i < 4000; i++) {
    ctxA.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
  }

  const map = new THREE.CanvasTexture(albedoCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;

  const pbr = { map, bumpMap, roughnessMap };
  textureCache.set(key, pbr);
  return pbr;
}

/**
 * Creates authentic warm sun-faded Hexagonal Terracotta Tile floor PBR textures
 */
export function createHexTerraceTilePBR(
  tileColor = '#df8f85',
  groutColor = '#eeddd7'
): PBRTextureSet {
  const key = `tile_clean_pbr_${tileColor}_${groutColor}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const w = 1024;
  const h = 1024;

  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = w;
  albedoCanvas.height = h;
  const ctxA = albedoCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = w;
  bumpCanvas.height = h;
  const ctxB = bumpCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = w;
  roughCanvas.height = h;
  const ctxR = roughCanvas.getContext('2d')!;

  ctxA.fillStyle = groutColor;
  ctxA.fillRect(0, 0, w, h);

  ctxB.fillStyle = '#404040';
  ctxB.fillRect(0, 0, w, h);

  ctxR.fillStyle = '#f0f0f0';
  ctxR.fillRect(0, 0, w, h);

  const hexRadius = 34;
  const hexWidth = Math.sqrt(3) * hexRadius;
  const hexHeight = 2 * hexRadius;
  const rowSpacing = hexHeight * 0.75;

  const drawHexTile = (cx: number, cy: number, colorShift: number) => {
    ctxA.save();
    ctxA.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i + 30);
      const x = cx + (hexRadius - 2) * Math.cos(angle);
      const y = cy + (hexRadius - 2) * Math.sin(angle);
      if (i === 0) ctxA.moveTo(x, y);
      else ctxA.lineTo(x, y);
    }
    ctxA.closePath();

    ctxA.fillStyle = tileColor;
    ctxA.globalAlpha = 0.9 + colorShift * 0.15;
    ctxA.fill();
    ctxA.restore();

    ctxB.save();
    ctxB.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i + 30);
      const x = cx + (hexRadius - 2.5) * Math.cos(angle);
      const y = cy + (hexRadius - 2.5) * Math.sin(angle);
      if (i === 0) ctxB.moveTo(x, y);
      else ctxB.lineTo(x, y);
    }
    ctxB.closePath();
    ctxB.fillStyle = '#b0b0b0';
    ctxB.fill();
    ctxB.restore();

    ctxR.save();
    ctxR.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i + 30);
      const x = cx + (hexRadius - 2) * Math.cos(angle);
      const y = cy + (hexRadius - 2) * Math.sin(angle);
      if (i === 0) ctxR.moveTo(x, y);
      else ctxR.lineTo(x, y);
    }
    ctxR.closePath();
    ctxR.fillStyle = '#a8a8a8';
    ctxR.fill();
    ctxR.restore();
  };

  let rowIndex = 0;
  for (let y = -hexRadius; y < h + hexRadius * 2; y += rowSpacing) {
    const xOffset = rowIndex % 2 === 0 ? 0 : hexWidth / 2;
    for (let x = -hexWidth; x < w + hexWidth * 2; x += hexWidth) {
      const shift = (Math.sin(x * 0.04) + Math.cos(y * 0.04)) * 0.5;
      drawHexTile(x + xOffset, y, shift);
    }
    rowIndex++;
  }

  const map = new THREE.CanvasTexture(albedoCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(6, 6);

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(6, 6);

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(6, 6);

  const pbr = { map, bumpMap, roughnessMap };
  textureCache.set(key, pbr);
  return pbr;
}

/**
 * Creates rustic weathered wood PBR textures
 */
export function createWeatheredWoodPBR(
  woodColor = '#80a8bf',
  baseWood = '#6a4a35'
): PBRTextureSet {
  const key = `wood_pbr_${woodColor}_${baseWood}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const w = 512;
  const h = 1024;

  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = w;
  albedoCanvas.height = h;
  const ctxA = albedoCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = w;
  bumpCanvas.height = h;
  const ctxB = bumpCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = w;
  roughCanvas.height = h;
  const ctxR = roughCanvas.getContext('2d')!;

  ctxA.fillStyle = baseWood;
  ctxA.fillRect(0, 0, w, h);

  ctxB.fillStyle = '#808080';
  ctxB.fillRect(0, 0, w, h);

  ctxR.fillStyle = '#c0c0c0';
  ctxR.fillRect(0, 0, w, h);

  ctxA.fillStyle = 'rgba(0,0,0,0.1)';
  for (let x = 0; x < w; x += 4) {
    if (Math.random() > 0.4) {
      ctxA.fillRect(x, 0, 1.5 + Math.random() * 2, h);
    }
  }

  ctxA.fillStyle = woodColor;
  ctxA.globalAlpha = 0.85;
  for (let y = 0; y < h; y += 6) {
    for (let x = 0; x < w; x += 6) {
      if (Math.random() > 0.3) {
        ctxA.fillRect(x, y, 5 + Math.random() * 4, 5 + Math.random() * 4);
      }
    }
  }
  ctxA.globalAlpha = 1.0;

  ctxA.strokeStyle = '#292524';
  ctxA.lineWidth = 3;
  ctxB.strokeStyle = '#101010';
  ctxB.lineWidth = 4;

  for (let y = 180; y < h; y += 180) {
    ctxA.beginPath();
    ctxA.moveTo(0, y);
    ctxA.lineTo(w, y);
    ctxA.stroke();

    ctxB.beginPath();
    ctxB.moveTo(0, y);
    ctxB.lineTo(w, y);
    ctxB.stroke();
  }

  const map = new THREE.CanvasTexture(albedoCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;

  const pbr = { map, bumpMap, roughnessMap };
  textureCache.set(key, pbr);
  return pbr;
}

/**
 * Creates Tarpaulin / Tirpal wrinkled cloth texture
 */
export function createTarpaulinTexture(color = '#384252'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 512; i += 6) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, 0);
    ctx.bezierCurveTo(Math.random() * 512, 180, Math.random() * 512, 340, Math.random() * 512, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export const createPeelingWallTexture = (baseColor?: string, undercoat?: string, flaking?: string) =>
  createPeelingWallPBR(baseColor, undercoat, flaking).map;
export const createHexTerraceTileTexture = (tileColor?: string, grout?: string) =>
  createHexTerraceTilePBR(tileColor, grout).map;
export const createWeatheredWoodTexture = (woodColor?: string, baseWood?: string) =>
  createWeatheredWoodPBR(woodColor, baseWood).map;
