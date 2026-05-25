import { useState } from 'react';
import { Upload, Download, ZoomIn, Loader2, Image as ImageIcon, ArrowRight } from 'lucide-react';

const scaleOptions = [
  { id: '2x', label: '2x', description: 'Double resolution' },
  { id: '4x', label: '4x', description: 'Quadruple resolution' },
];

export default function ImageUpscaler() {
  const [uploaded, setUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [scale, setScale] = useState('2x');

  const handleUpload = () => {
    setUploaded(true);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsProcessed(true);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <ZoomIn size={22} className="text-primary" />
          Image Upscaler
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Enhance resolution up to 4x without losing quality
        </p>
      </div>

      {/* Scale Options */}
      <div className="flex gap-3 mb-6">
        {scaleOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setScale(opt.id)}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              scale === opt.id
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-surface border border-border text-text-secondary hover:border-primary/30'
            }`}
          >
            <span className="text-lg font-bold">{opt.label}</span>
            <span className="block text-xs opacity-80 mt-0.5">{opt.description}</span>
          </button>
        ))}
      </div>

      {/* Main Area */}
      <div className="bg-surface border border-border rounded-xl p-6 min-h-[500px]">
        {!uploaded ? (
          <div
            onClick={handleUpload}
            className="h-full min-h-[400px] flex items-center justify-center"
          >
            <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary-light/30 transition-all max-w-md w-full">
              <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload size={28} className="text-primary" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Upload image to upscale</h3>
              <p className="text-sm text-text-secondary mb-4">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-text-muted">Supports JPG, PNG, WebP • Max 10MB</p>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="h-full min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Loader2 size={40} className="text-primary animate-spin mx-auto mb-4" />
              <h3 className="font-semibold text-text-primary mb-1">Upscaling your image...</h3>
              <p className="text-sm text-text-secondary">Enhancing details with AI ({scale})</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-text-secondary">
                  Original: <strong>640×480</strong>
                </span>
                <ArrowRight size={16} className="text-text-muted" />
                <span className="text-sm text-success font-medium">
                  Upscaled: <strong>{scale === '2x' ? '1280×960' : '2560×1920'}</strong>
                </span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover">
                <Download size={16} />
                Download HD
              </button>
            </div>
            {/* Before/After */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/3] bg-surface-secondary rounded-xl border border-border flex items-center justify-center relative">
                <ImageIcon size={40} className="text-text-muted" />
                <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  Original
                </span>
              </div>
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-primary/20 flex items-center justify-center relative">
                <ImageIcon size={40} className="text-primary" />
                <span className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded">
                  Upscaled {scale}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
