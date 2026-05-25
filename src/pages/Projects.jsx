import {
  FolderOpen,
  Grid3X3,
  List,
  Search,
  Filter,
  MoreVertical,
  Heart,
  Clock,
  Image as ImageIcon,
  Trash2,
  Star,
} from 'lucide-react';
import { useState } from 'react';

const projects = [
  { id: 1, name: 'Summer Campaign Banner', type: 'Canvas', date: '2 hours ago', favorite: true },
  { id: 2, name: 'AI Landscape Collection', type: 'Image Gen', date: '5 hours ago', favorite: false },
  { id: 3, name: 'Brand Logo v3', type: 'Logo Gen', date: '1 day ago', favorite: true },
  { id: 4, name: 'Product Photo - Shoes', type: 'BG Remove', date: '2 days ago', favorite: false },
  { id: 5, name: 'Instagram Story Set', type: 'Canvas', date: '3 days ago', favorite: false },
  { id: 6, name: 'Team Avatar Pack', type: 'Character', date: '4 days ago', favorite: true },
  { id: 7, name: 'Website Hero Image', type: 'Image Gen', date: '5 days ago', favorite: false },
  { id: 8, name: 'Podcast Cover Art', type: 'Illustration', date: '1 week ago', favorite: false },
];

const tabs = [
  { id: 'all', label: 'All Projects', count: 8 },
  { id: 'favorites', label: 'Favorites', count: 3 },
  { id: 'shared', label: 'Shared', count: 0 },
  { id: 'trash', label: 'Trash', count: 1 },
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <FolderOpen size={22} className="text-primary" />
            My Projects
          </h1>
          <p className="text-sm text-text-secondary mt-1">Manage all your creations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'text-primary border-primary'
                : 'text-text-secondary border-transparent hover:text-text-primary'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs bg-surface-secondary px-1.5 py-0.5 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-9 pr-4 py-2 w-64 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-secondary hover:border-primary/30">
            <Filter size={16} />
            Filter
          </button>
          <div className="flex bg-surface border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface-secondary'}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface-secondary'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'} gap-4`}>
        {projects.map((project) => (
          <div
            key={project.id}
            className={`bg-surface border border-border rounded-xl overflow-hidden hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group ${
              viewMode === 'list' ? 'flex items-center' : ''
            }`}
          >
            <div className={`${viewMode === 'list' ? 'w-20 h-16' : 'h-36'} bg-gradient-to-br from-surface-secondary to-border flex items-center justify-center relative`}>
              <ImageIcon size={viewMode === 'list' ? 20 : 28} className="text-text-muted" />
              {project.favorite && (
                <Star size={14} className="absolute top-2 right-2 text-warning fill-warning" />
              )}
            </div>
            <div className={`p-3 ${viewMode === 'list' ? 'flex-1 flex items-center justify-between' : ''}`}>
              <div>
                <h4 className="font-medium text-text-primary text-sm truncate">{project.name}</h4>
                <div className={`flex items-center gap-2 mt-1.5 ${viewMode === 'list' ? 'hidden sm:flex' : ''}`}>
                  <span className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full">
                    {project.type}
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Clock size={10} />
                    {project.date}
                  </span>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-surface-secondary rounded-lg text-text-muted">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
