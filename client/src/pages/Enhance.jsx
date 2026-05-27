import { useState } from 'react';
import {
  Wand2,
  Upload,
  Download,
  Loader2,
  Image as ImageIcon,
  Sun,
  Contrast,
  Droplets,
  Thermometer,
  Sparkles,
} from 'lucide-react';

const filters = [
  { id: 'auto', name: 'Auto Enhance', icon: Wand2 },
  { id: 'vivid', name: 'Vivid', icon: Sparkles },
  { id: 'warm', name: 'Warm', icon: Thermometer },
  { id: 'cool', name: 'Cool', icon: Droplets },
  { id: 'dramatic', name: 'Dramatic', icon: Contrast },
  { id: 'bright', name: 'Bright', icon: Sun },
];

const adjustments = [
  { id: 'brightness', label: 'Brightness', value: 50, icon: Sun },
  { id: 'contrast', label: 'Contrast', value: 50, icon: Contrast },
  { id: 'saturation', label: 'Saturation', value: 50, icon: Droplets },
  { id: 'temperature', label: 'Temperature', value: 50, icon: Thermometer },
  { id: 'sharpness', label: 'Sharpness', value: 30, icon: Sparkles },
];

export default function Enhance() {
  const [uploaded, setUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const handleUpload = () => {
    setUploaded(true);
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <Wand2 size={22} className="text-primary" />
          AI Enhancement
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Enhance your photos with AI-powered filters and adjustments
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Area */}
        <div className="flex-1">
          <div className="bg-surface border border-border rounded-xl p-6 min-h-[500px] flex items-center justify-center">
            {!uploaded ? (
              <div
                onClick={handleUpload}
                className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary-light/30 transition-all max-w-md w-full"
              >
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload size={28} className="text-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Upload image to enhance</h3>
                <p className="text-sm text-text-secondary">Drag & drop or click to browse</p>
              </div>
            ) : isProcessing ? (
              <div className="text-center">
                <Loader2 size={40} className="text-primary animate-spin mx-auto mb-4" />
                <h3 className="font-semibold text-text-primary">Analyzing image...</h3>
              </div>
            ) : (
              <div className="w-full">
                <div className="flex justify-end mb-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover">
                    <Download size={16} />
                    Download
                  </button>
                </div>
                <div className="aspect-[16/10] bg-gradient-to-br from-surface-secondary to-border rounded-xl border border-border flex items-center justify-center">
                  <ImageIcon size={48} className="text-text-muted" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        {uploaded && !isProcessing && (
          <div className="lg:w-80 space-y-4">
            {/* AI Filters */}
            <div className="bg-surface border border-border rounded-xl p-4">
              <h3 className="font-medium text-text-primary mb-3">AI Filters</h3>
              <div className="grid grid-cols-3 gap-2">
                {filters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                        selectedFilter === filter.id
                          ? 'bg-primary text-white'
                          : 'bg-surface-secondary text-text-secondary hover:bg-primary-light hover:text-primary border border-border'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-xs font-medium">{filter.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual Adjustments */}
            <div className="bg-surface border border-border rounded-xl p-4">
              <h3 className="font-medium text-text-primary mb-3">Adjustments</h3>
              <div className="space-y-4">
                {adjustments.map((adj) => (
                  <div key={adj.id}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-text-secondary">{adj.label}</label>
                      <span className="text-xs text-text-muted">{adj.value}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue={adj.value}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <button className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Wand2 size={18} />
              Apply Enhancement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
