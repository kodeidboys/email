import {
  Type,
  Square,
  Circle,
  Image as ImageIcon,
  Layers,
  Download,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Move,
  MousePointer2,
  Pen,
  Trash2,
  Copy,
  AlignCenter,
  Palette,
} from 'lucide-react';
import { useState } from 'react';

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select' },
  { id: 'move', icon: Move, label: 'Move' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'rect', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'pen', icon: Pen, label: 'Draw' },
  { id: 'image', icon: ImageIcon, label: 'Image' },
];

const layers = [
  { id: 1, name: 'Background', type: 'rect', visible: true },
  { id: 2, name: 'Heading Text', type: 'text', visible: true },
  { id: 3, name: 'Product Image', type: 'image', visible: true },
  { id: 4, name: 'Logo', type: 'image', visible: true },
  { id: 5, name: 'CTA Button', type: 'rect', visible: true },
];

export default function CanvasEditor() {
  const [activeTool, setActiveTool] = useState('select');
  const [zoom, setZoom] = useState(100);

  return (
    <div className="max-w-full mx-auto -m-6">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-surface-secondary rounded-lg text-text-secondary">
            <Undo2 size={18} />
          </button>
          <button className="p-2 hover:bg-surface-secondary rounded-lg text-text-secondary">
            <Redo2 size={18} />
          </button>
          <div className="w-px h-6 bg-border mx-1"></div>
          <button className="p-2 hover:bg-surface-secondary rounded-lg text-text-secondary">
            <Copy size={18} />
          </button>
          <button className="p-2 hover:bg-surface-secondary rounded-lg text-text-secondary">
            <Trash2 size={18} />
          </button>
          <button className="p-2 hover:bg-surface-secondary rounded-lg text-text-secondary">
            <AlignCenter size={18} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-secondary rounded-lg px-3 py-1.5">
            <button onClick={() => setZoom(Math.max(25, zoom - 25))}>
              <ZoomOut size={16} className="text-text-secondary" />
            </button>
            <span className="text-sm font-medium text-text-primary w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 25))}>
              <ZoomIn size={16} className="text-text-secondary" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-8rem)]">
        {/* Left Tool Panel */}
        <div className="w-14 bg-surface border-r border-border flex flex-col items-center py-3 gap-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                  activeTool === tool.id
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-surface-secondary'
                }`}
                title={tool.label}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-surface-secondary dark:bg-dark-tertiary flex items-center justify-center overflow-auto p-8">
          <div
            className="bg-white shadow-2xl"
            style={{
              width: `${(1080 * zoom) / 100 / 2}px`,
              height: `${(1080 * zoom) / 100 / 2}px`,
            }}
          >
            {/* Canvas placeholder content - always white bg for design canvas */}
            <div className="w-full h-full relative border border-gray-300">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100"></div>
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Your Design Here</h2>
                <p className="text-sm text-gray-500 mt-2">Click elements to edit</p>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="px-6 py-2 bg-primary text-white text-sm rounded-full">
                  Sample Button
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Layers & Properties */}
        <div className="w-64 bg-surface border-l border-border flex flex-col">
          {/* Properties */}
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Palette size={14} />
              Properties
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-text-muted">Width</label>
                  <input
                    type="number"
                    defaultValue="1080"
                    className="w-full px-2 py-1.5 bg-surface-secondary border border-border rounded text-xs text-text-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted">Height</label>
                  <input
                    type="number"
                    defaultValue="1080"
                    className="w-full px-2 py-1.5 bg-surface-secondary border border-border rounded text-xs text-text-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-text-muted">X</label>
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1.5 bg-surface-secondary border border-border rounded text-xs text-text-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted">Y</label>
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-2 py-1.5 bg-surface-secondary border border-border rounded text-xs text-text-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted">Opacity</label>
                <input type="range" min="0" max="100" defaultValue="100" className="w-full" />
              </div>
            </div>
          </div>

          {/* Layers */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Layers size={14} />
              Layers
            </h3>
            <div className="space-y-1">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-secondary cursor-pointer group"
                >
                  <div className="w-6 h-6 bg-surface-secondary rounded border border-border flex items-center justify-center">
                    {layer.type === 'text' && <Type size={12} className="text-text-muted" />}
                    {layer.type === 'rect' && <Square size={12} className="text-text-muted" />}
                    {layer.type === 'image' && <ImageIcon size={12} className="text-text-muted" />}
                  </div>
                  <span className="text-xs text-text-primary flex-1 truncate">{layer.name}</span>
                  <button className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-error">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
