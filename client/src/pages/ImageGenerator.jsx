import { useState } from 'react';
import {
  Sparkles,
  Download,
  RefreshCw,
  Settings2,
  Copy,
  Heart,
  Maximize2,
  ChevronDown,
  Loader2,
  ImagePlus,
} from 'lucide-react';

const stylePresets = [
  { id: 'realistic', name: 'Realistic', emoji: '📷' },
  { id: 'anime', name: 'Anime', emoji: '🎌' },
  { id: '3d', name: '3D Render', emoji: '🧊' },
  { id: 'illustration', name: 'Illustration', emoji: '🎨' },
  { id: 'watercolor', name: 'Watercolor', emoji: '💧' },
  { id: 'oil-painting', name: 'Oil Painting', emoji: '🖼️' },
  { id: 'pixel-art', name: 'Pixel Art', emoji: '👾' },
  { id: 'flat', name: 'Flat Design', emoji: '📐' },
  { id: 'cinematic', name: 'Cinematic', emoji: '🎬' },
  { id: 'fantasy', name: 'Fantasy', emoji: '🐉' },
  { id: 'minimalist', name: 'Minimalist', emoji: '⚪' },
  { id: 'pop-art', name: 'Pop Art', emoji: '🎪' },
];

const aspectRatios = [
  { id: '1:1', label: '1:1', width: 'w-8', height: 'h-8' },
  { id: '4:3', label: '4:3', width: 'w-9', height: 'h-7' },
  { id: '16:9', label: '16:9', width: 'w-10', height: 'h-6' },
  { id: '9:16', label: '9:16', width: 'w-6', height: 'h-10' },
  { id: '3:4', label: '3:4', width: 'w-7', height: 'h-9' },
];

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [numVariations, setNumVariations] = useState(4);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setGeneratedImages([1, 2, 3, 4]);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel - Controls */}
        <div className="lg:w-96 space-y-5">
          {/* Header */}
          <div>
            <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Sparkles size={22} className="text-primary" />
              AI Image Generator
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Transform your words into stunning images
            </p>
          </div>

          {/* Prompt Input */}
          <div className="bg-surface border border-border rounded-xl p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Describe your image
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A serene mountain landscape at sunset with golden light reflecting on a crystal clear lake..."
                className="w-full h-28 px-4 py-3 bg-surface-secondary border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                maxLength={500}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-text-muted">{prompt.length}/500</span>
              </div>
            </div>

            {/* Style Presets */}
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">Style</label>
              <div className="grid grid-cols-3 gap-2">
                {stylePresets.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedStyle === style.id
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-surface-secondary text-text-secondary hover:bg-primary-light hover:text-primary border border-border'
                    }`}
                  >
                    <span className="mr-1">{style.emoji}</span>
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Aspect Ratio
              </label>
              <div className="flex gap-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedRatio(ratio.id)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg transition-all ${
                      selectedRatio === ratio.id
                        ? 'bg-primary-light border-2 border-primary'
                        : 'bg-surface-secondary border border-border hover:border-primary/30'
                    }`}
                  >
                    <div
                      className={`${ratio.width} ${ratio.height} border-2 rounded-sm ${
                        selectedRatio === ratio.id ? 'border-primary' : 'border-text-muted'
                      }`}
                    ></div>
                    <span className="text-xs font-medium">{ratio.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Variations */}
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Number of Images
              </label>
              <div className="flex gap-2">
                {[1, 2, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setNumVariations(num)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      numVariations === num
                        ? 'bg-primary text-white'
                        : 'bg-surface-secondary text-text-secondary border border-border hover:border-primary/30'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Settings */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
              >
                <Settings2 size={16} />
                <span>Advanced Settings</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                />
              </button>
              {showAdvanced && (
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-text-secondary mb-1 block">
                      Negative Prompt
                    </label>
                    <textarea
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      placeholder="blurry, low quality, distorted..."
                      className="w-full h-16 px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-secondary mb-1 block">
                      Seed (optional)
                    </label>
                    <input
                      type="number"
                      placeholder="Random"
                      className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Image
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="flex-1">
          <div className="bg-surface border border-border rounded-xl p-6 min-h-[600px]">
            {isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <Sparkles size={28} className="text-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Creating your image...</h3>
                <p className="text-sm text-text-secondary">This usually takes 10-30 seconds</p>
                <div className="mt-4 w-48 h-2 bg-surface-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse w-2/3"></div>
                </div>
              </div>
            ) : generatedImages.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text-primary">Generated Results</h3>
                  <button
                    onClick={handleGenerate}
                    className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover font-medium"
                  >
                    <RefreshCw size={14} />
                    Regenerate
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {generatedImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-xl overflow-hidden border border-border"
                    >
                      {/* Placeholder for generated image */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <ImagePlus size={32} className="text-text-muted mx-auto mb-2" />
                          <span className="text-xs text-text-muted">Generated Image {idx + 1}</span>
                        </div>
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <div className="flex gap-2 w-full">
                          <button className="flex-1 flex items-center justify-center gap-1 bg-white text-dark text-xs font-medium py-2 rounded-lg hover:bg-gray-100">
                            <Download size={14} />
                            Download
                          </button>
                          <button className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30">
                            <Heart size={14} />
                          </button>
                          <button className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30">
                            <Maximize2 size={14} />
                          </button>
                          <button className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30">
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 bg-surface-secondary rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles size={36} className="text-text-muted" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Ready to create</h3>
                <p className="text-sm text-text-secondary max-w-sm">
                  Enter a prompt describing the image you want to generate, choose a style, and click Generate.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
