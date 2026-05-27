import { useState } from 'react';
import {
  Upload,
  Download,
  Eraser,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2,
  Image as ImageIcon,
  Palette,
  Layers,
} from 'lucide-react';

const backgroundOptions = [
  { id: 'transparent', label: 'Transparent', color: 'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2220%22%20height%3D%2220%22%3E%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23fff%22/%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23fff%22/%3E%3Crect%20x%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23e5e5e5%22/%3E%3Crect%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23e5e5e5%22/%3E%3C/svg%3E")]' },
  { id: 'white', label: 'White', color: 'bg-white border' },
  { id: 'black', label: 'Black', color: 'bg-black' },
  { id: 'red', label: 'Red', color: 'bg-red-500' },
  { id: 'blue', label: 'Blue', color: 'bg-blue-500' },
  { id: 'green', label: 'Green', color: 'bg-green-500' },
  { id: 'gradient1', label: 'Gradient', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'gradient2', label: 'Gradient', color: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
];

export default function BackgroundRemover() {
  const [uploadedImage, setUploadedImage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [selectedBg, setSelectedBg] = useState('transparent');

  const handleUpload = () => {
    setUploadedImage(true);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsProcessed(true);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <Eraser size={22} className="text-primary" />
          Background Remover
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Remove backgrounds instantly with AI — one click, clean results
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Canvas Area */}
        <div className="flex-1">
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            {/* Toolbar */}
            {uploadedImage && (
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-secondary">
                <button className="p-2 hover:bg-border rounded-lg text-text-secondary" title="Undo">
                  <Undo2 size={18} />
                </button>
                <button className="p-2 hover:bg-border rounded-lg text-text-secondary" title="Redo">
                  <Redo2 size={18} />
                </button>
                <div className="w-px h-6 bg-border mx-1"></div>
                <button className="p-2 hover:bg-border rounded-lg text-text-secondary" title="Zoom In">
                  <ZoomIn size={18} />
                </button>
                <button className="p-2 hover:bg-border rounded-lg text-text-secondary" title="Zoom Out">
                  <ZoomOut size={18} />
                </button>
                <button className="p-2 hover:bg-border rounded-lg text-text-secondary" title="Reset">
                  <RotateCcw size={18} />
                </button>
                <div className="flex-1"></div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover">
                  <Download size={16} />
                  Download PNG
                </button>
              </div>
            )}

            {/* Canvas */}
            <div className="min-h-[500px] flex items-center justify-center p-8">
              {!uploadedImage ? (
                <div
                  onClick={handleUpload}
                  className="w-full max-w-md border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary-light/30 transition-all"
                >
                  <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload size={28} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">Upload your image</h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-xs text-text-muted">
                    Supports JPG, PNG, WebP • Max 10MB
                  </p>
                </div>
              ) : isProcessing ? (
                <div className="text-center">
                  <Loader2 size={40} className="text-primary animate-spin mx-auto mb-4" />
                  <h3 className="font-semibold text-text-primary mb-1">Removing background...</h3>
                  <p className="text-sm text-text-secondary">AI is processing your image</p>
                </div>
              ) : (
                <div className="w-full max-w-lg">
                  {/* Before/After comparison placeholder */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-surface-secondary to-border rounded-xl overflow-hidden border border-border">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon size={48} className="text-text-muted mx-auto mb-2" />
                        <span className="text-sm text-text-muted">Background Removed</span>
                      </div>
                    </div>
                    {/* Comparison slider indicator */}
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      Before
                    </div>
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                      After
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Options */}
        {isProcessed && (
          <div className="lg:w-72 space-y-4">
            {/* Background Options */}
            <div className="bg-surface border border-border rounded-xl p-4">
              <h3 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                <Palette size={16} />
                Replace Background
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {backgroundOptions.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBg(bg.id)}
                    className={`w-full aspect-square rounded-lg ${bg.color} ${
                      selectedBg === bg.id ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    title={bg.label}
                  ></button>
                ))}
              </div>
              <div className="mt-3">
                <button className="w-full py-2 text-sm text-primary border border-primary/30 rounded-lg hover:bg-primary-light transition-colors">
                  + Custom Color
                </button>
              </div>
            </div>

            {/* AI Background */}
            <div className="bg-surface border border-border rounded-xl p-4">
              <h3 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                <Layers size={16} />
                AI Background
              </h3>
              <textarea
                placeholder="Describe the background you want... e.g., 'professional studio with soft lighting'"
                className="w-full h-20 px-3 py-2 bg-surface-secondary border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button className="w-full mt-2 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors">
                Generate Background
              </button>
            </div>

            {/* Fine-tune */}
            <div className="bg-surface border border-border rounded-xl p-4">
              <h3 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                <Eraser size={16} />
                Fine-tune
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Edge Smoothness</label>
                  <input type="range" min="0" max="100" defaultValue="50" className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Feather</label>
                  <input type="range" min="0" max="20" defaultValue="2" className="w-full" />
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 text-xs bg-surface-secondary border border-border rounded-lg hover:border-primary/30">
                    Erase More
                  </button>
                  <button className="flex-1 py-2 text-xs bg-surface-secondary border border-border rounded-lg hover:border-primary/30">
                    Restore
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
