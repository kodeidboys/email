import {
  Sparkles,
  ImagePlus,
  Wand2,
  PenTool,
  ArrowRight,
  Clock,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const quickActions = [
  {
    title: 'AI Image Generator',
    description: 'Create images from text prompts',
    icon: Sparkles,
    path: '/create/image-generator',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    title: 'Background Remover',
    description: 'Remove background in one click',
    icon: ImagePlus,
    path: '/edit/bg-remover',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Image Upscaler',
    description: 'Enhance resolution up to 4x',
    icon: Wand2,
    path: '/edit/upscaler',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Canvas Editor',
    description: 'Design with layers & templates',
    icon: PenTool,
    path: '/canvas',
    gradient: 'from-orange-500 to-pink-500',
  },
];

const recentProjects = [
  { id: 1, name: 'Product Banner', type: 'Canvas', date: '2 hours ago', thumbnail: null },
  { id: 2, name: 'AI Generated Landscape', type: 'Image Gen', date: '5 hours ago', thumbnail: null },
  { id: 3, name: 'Logo Concept v2', type: 'Logo Gen', date: '1 day ago', thumbnail: null },
  { id: 4, name: 'Profile Photo Edit', type: 'BG Remove', date: '2 days ago', thumbnail: null },
];

const templates = [
  { id: 1, name: 'Instagram Post', size: '1080x1080', category: 'Social Media' },
  { id: 2, name: 'YouTube Thumbnail', size: '1280x720', category: 'Video' },
  { id: 3, name: 'Facebook Cover', size: '820x312', category: 'Social Media' },
  { id: 4, name: 'Story Template', size: '1080x1920', category: 'Social Media' },
  { id: 5, name: 'Poster A4', size: '2480x3508', category: 'Print' },
  { id: 6, name: 'Business Card', size: '1050x600', category: 'Print' },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative">
          <h1 className="text-2xl font-bold mb-2">Welcome to AIPIK Studio ✨</h1>
          <p className="text-white/80 mb-4 max-w-lg">
            Create stunning visuals with AI-powered tools. Generate images, edit photos, and design
            graphics — all in one place.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5 text-sm">
              <Zap size={14} />
              <span>3/5 free generations today</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5 text-sm">
              <TrendingUp size={14} />
              <span>12 projects this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.path}
                to={action.path}
                className="group bg-surface border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-text-secondary">{action.description}</p>
                <div className="mt-3 flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Open</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Projects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Recent Projects</h2>
          <Link to="/projects" className="text-sm text-primary hover:text-primary-hover font-medium">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="bg-surface border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="h-32 bg-gradient-to-br from-surface-secondary to-border flex items-center justify-center">
                <ImagePlus size={32} className="text-text-muted" />
              </div>
              <div className="p-4">
                <h4 className="font-medium text-text-primary text-sm truncate">{project.name}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full">
                    {project.type}
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Clock size={12} />
                    {project.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Start from Template</h2>
          <button className="text-sm text-primary hover:text-primary-hover font-medium">
            Browse All
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-surface border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer text-center"
            >
              <div className="w-12 h-12 bg-surface-secondary rounded-lg mx-auto mb-3 flex items-center justify-center">
                <PenTool size={20} className="text-text-muted" />
              </div>
              <h4 className="text-sm font-medium text-text-primary">{template.name}</h4>
              <p className="text-xs text-text-muted mt-1">{template.size}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
