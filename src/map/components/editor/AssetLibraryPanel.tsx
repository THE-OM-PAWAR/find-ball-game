import React, { useState } from 'react';
import { HOUSE_ASSETS, PROP_ASSETS, LANDMARK_ASSETS } from '../../../editor/AssetRegistry';
import type { AssetDefinition, AssetId } from '../../../editor/EditorTypes';

interface AssetLibraryPanelProps {
  onPlaceAsset: (assetId: AssetId) => void;
}

const TABS = [
  { id: 'house', label: '🏠 Houses', assets: HOUSE_ASSETS },
  { id: 'prop', label: '📦 Props', assets: PROP_ASSETS },
  { id: 'landmark', label: '📍 Landmarks', assets: LANDMARK_ASSETS },
];

const s: Record<string, React.CSSProperties> = {
  panel: {
    width: '220px',
    flexShrink: 0,
    background: 'rgba(10, 16, 28, 0.96)',
    borderRight: '1px solid #1e2d3d',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    fontFamily: 'Inter, sans-serif',
    overflow: 'hidden',
  },
  header: {
    padding: '12px 14px 8px',
    borderBottom: '1px solid #1e2d3d',
  },
  headerTitle: {
    fontSize: '11px',
    fontWeight: 800,
    color: '#38bdf8',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  headerSub: {
    fontSize: '10px',
    color: '#475569',
    marginTop: '2px',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #1e2d3d',
  },
  tab: {
    flex: 1,
    padding: '7px 4px',
    fontSize: '10px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s',
    textAlign: 'center',
  },
  assetList: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  assetCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.03)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    userSelect: 'none',
  },
  assetIcon: {
    fontSize: '20px',
    flexShrink: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    background: 'rgba(56, 189, 248, 0.08)',
  },
  assetMeta: {
    flex: 1,
    minWidth: 0,
  },
  assetName: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#e2e8f0',
    lineHeight: 1.3,
  },
  assetSub: {
    fontSize: '10px',
    color: '#475569',
    marginTop: '1px',
  },
  addBtn: {
    width: '22px',
    height: '22px',
    borderRadius: '5px',
    border: '1px solid #334155',
    background: 'rgba(56, 189, 248, 0.1)',
    color: '#38bdf8',
    fontSize: '16px',
    lineHeight: '1',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontWeight: 700,
  },
  hint: {
    padding: '10px 14px',
    borderTop: '1px solid #1e2d3d',
    fontSize: '10px',
    color: '#334155',
    lineHeight: 1.5,
  },
};

export const AssetLibraryPanel: React.FC<AssetLibraryPanelProps> = ({ onPlaceAsset }) => {
  const [activeTab, setActiveTab] = useState<string>('house');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  const getFootprintText = (def: AssetDefinition): string => {
    if (def.footprintSize) return `${def.footprintSize[0]}m × ${def.footprintSize[1]}m`;
    return def.category;
  };

  return (
    <div style={s.panel}>
      <div style={s.header}>
        <div style={s.headerTitle}>📂 Asset Library</div>
        <div style={s.headerSub}>Click + to place at origin</div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            style={{
              ...s.tab,
              background: activeTab === tab.id ? 'rgba(56,189,248,0.12)' : 'transparent',
              color: activeTab === tab.id ? '#38bdf8' : '#64748b',
              borderBottom: activeTab === tab.id ? '2px solid #38bdf8' : '2px solid transparent',
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Asset list */}
      <div style={s.assetList}>
        {currentTab.assets.map((def) => (
          <div
            key={def.id}
            style={{
              ...s.assetCard,
              background:
                hoveredId === def.id
                  ? 'rgba(56, 189, 248, 0.08)'
                  : 'rgba(255,255,255,0.03)',
              borderColor:
                hoveredId === def.id ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255,255,255,0.06)',
            }}
            onMouseEnter={() => setHoveredId(def.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onPlaceAsset(def.id)}
          >
            <div style={s.assetIcon}>{def.icon}</div>
            <div style={s.assetMeta}>
              <div style={s.assetName}>{def.displayName}</div>
              <div style={s.assetSub}>{getFootprintText(def)}</div>
            </div>
            <button
              style={s.addBtn}
              title={`Add ${def.displayName}`}
              onClick={(e) => { e.stopPropagation(); onPlaceAsset(def.id); }}
            >
              +
            </button>
          </div>
        ))}
      </div>

      <div style={s.hint}>
        Click any asset to place at origin.<br />
        Then drag it to position.
      </div>
    </div>
  );
};
