import React from 'react';
import './DocsSidebar.css';
import { DOCS_NAVIGATION } from '@/data/docs';

interface DocsSidebarProps {
  currentSlug: string;
  onSelect: (slug: string) => void;
}

const DocsSidebar: React.FC<DocsSidebarProps> = ({ currentSlug, onSelect }) => {
  return (
    <aside className="docs-sidebar">
      {DOCS_NAVIGATION.map((section, idx) => (
        <div key={idx} className="docs-nav-section">
          <h4 className="docs-nav-title">{section.title}</h4>
          <ul className="docs-nav-list">
            {section.items.map(item => (
              <li 
                key={item.slug} 
                className={`docs-nav-item ${currentSlug === item.slug ? 'active' : ''}`}
                onClick={() => onSelect(item.slug)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
};

export default DocsSidebar;
