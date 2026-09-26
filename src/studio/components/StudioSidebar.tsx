import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FolderGit2,
  BookOpen,
} from 'lucide-react';
import { STUDIO_CATEGORIES } from '../data/studioPresets';

interface StudioSidebarProps {
  activeCategory: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
  activeCategory,
  searchQuery,
  onSearchChange,
}) => {
  const navigate = useNavigate();

  const filteredCategories = STUDIO_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand" onClick={() => navigate('/studio/houses')} style={{ cursor: 'pointer' }}>
        <div className="brand-logo-badge">GL</div>
        <div className="brand-meta">
          <span className="brand-title">GULLY 3D STUDIO</span>
          <span className="brand-subtitle">Asset Inspector v2.4</span>
        </div>
      </div>

      {/* Category Search Input */}
      <div className="search-box">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search categories..."
          className="search-input"
        />
      </div>

      {/* Primary Category Navigation List */}
      <nav className="nav-group">
        <span className="nav-label">STUDIO ASSETS</span>
        <div className="nav-list">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => navigate(cat.route)}
                className={`nav-item ${isSelected ? 'selected' : ''}`}
              >
                <Icon size={16} className="nav-icon" />
                <span className="nav-text">{cat.name}</span>
                <span className={`nav-pill ${isSelected ? 'nav-pill-active' : 'nav-pill-muted'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* World & Environment Modules */}
      <div className="nav-group" style={{ marginTop: 'auto' }}>
        <span className="nav-label">WORLD INTEGRATION</span>
        <div className="nav-list">
          <div className="nav-item disabled">
            <FolderGit2 size={16} className="nav-icon" />
            <span className="nav-text">Scene Composer</span>
          </div>
          <div className="nav-item disabled">
            <BookOpen size={16} className="nav-icon" />
            <span className="nav-text">Neighborhood Lore</span>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="avatar-chip">CR</div>
        <div className="footer-meta">
          <span className="footer-name">Lead 3D Artist</span>
          <span className="footer-role">Gully Studio Engine</span>
        </div>
      </div>
    </aside>
  );
};
