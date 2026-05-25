import { NavLink } from 'react-router-dom';
import {
  Home,
  Sparkles,
  ImagePlus,
  Wand2,
  Palette,
  PenTool,
  FolderOpen,
  Settings,
  Crown,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  {
    label: 'Home',
    icon: Home,
    path: '/',
  },
  {
    label: 'Create',
    icon: Sparkles,
    path: '/create',
    children: [
      { label: 'Image Generator', path: '/create/image-generator' },
      { label: 'Illustration', path: '/create/illustration' },
      { label: 'Character Maker', path: '/create/character' },
      { label: 'Logo Generator', path: '/create/logo' },
      { label: 'Background', path: '/create/background' },
    ],
  },
  {
    label: 'Edit',
    icon: ImagePlus,
    path: '/edit',
    children: [
      { label: 'Background Remover', path: '/edit/bg-remover' },
      { label: 'Background Replacer', path: '/edit/bg-replacer' },
      { label: 'Object Remover', path: '/edit/object-remover' },
      { label: 'Generative Fill', path: '/edit/generative-fill' },
      { label: 'Image Upscaler', path: '/edit/upscaler' },
      { label: 'Image Expander', path: '/edit/expander' },
      { label: 'Color Restoration', path: '/edit/color-restore' },
    ],
  },
  {
    label: 'Enhance',
    icon: Wand2,
    path: '/enhance',
    children: [
      { label: 'Auto Enhance', path: '/enhance/auto' },
      { label: 'Face Enhancement', path: '/enhance/face' },
      { label: 'Smart Filters', path: '/enhance/filters' },
      { label: 'Style Transfer', path: '/enhance/style-transfer' },
      { label: 'Noise Reduction', path: '/enhance/denoise' },
    ],
  },
  {
    label: 'Canvas',
    icon: PenTool,
    path: '/canvas',
  },
  {
    label: 'My Projects',
    icon: FolderOpen,
    path: '/projects',
  },
  {
    label: 'Settings',
    icon: Settings,
    path: '/settings',
  },
];

function MenuItem({ item }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = item.icon;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-primary-light rounded-lg transition-colors"
        >
          <Icon size={20} />
          <span className="flex-1 text-left">{item.label}</span>
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {expanded && (
          <div className="ml-9 mt-1 space-y-0.5">
            {item.children.map((child) => (
              <NavLink
                key={child.path}
                to={child.path}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary bg-primary-light font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                  }`
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
          isActive
            ? 'text-primary bg-primary-light font-medium'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
        }`
      }
    >
      <Icon size={20} />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-text-primary">AIPIK Studio</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <MenuItem key={item.path} item={item} />
        ))}
      </nav>

      {/* Upgrade CTA */}
      <div className="p-4 border-t border-border">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Crown size={18} />
            <span className="font-semibold text-sm">Upgrade to Pro</span>
          </div>
          <p className="text-xs opacity-90 mb-3">Unlimited AI generations & no watermark</p>
          <button className="w-full bg-white text-primary font-medium text-sm py-2 rounded-lg hover:bg-opacity-90 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
