import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import {
  Type, Square, Circle, Image as ImageIcon,
  Layers, Download, Undo2, Redo2,
  ZoomIn, ZoomOut, Move,
  MousePointer2, Pen, Trash2, Copy,
  Palette, Sun, Moon
} from 'lucide-react';

const TOOLS = [
  { id: 'select', icon: MousePointer2, label: 'Select' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'rect', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'pen', icon: Pen, label: 'Draw' },
  { id: 'image', icon: ImageIcon, label: 'Image' },
];

const CANVAS_W = 1080;
const CANVAS_H = 1080;
const MAX_HISTORY = 50;

export default function CanvasEditor() {
  const canvasEl = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [activeTool, setActiveTool] = useState('select');
  const [zoom, setZoom] = useState(100);
  const [dark, setDark] = useState(true);
  const [layers, setLayers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [propX, setPropX] = useState(0);
  const [propY, setPropY] = useState(0);
  const [propW, setPropW] = useState(CANVAS_W);
  const [propH, setPropH] = useState(CANVAS_H);
  const [propOpacity, setPropOpacity] = useState(100);
  const [propFill, setPropFill] = useState('#4f46e5');
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Init canvas
  useEffect(() => {
    if (!canvasEl.current || canvasRef.current) return;

    const c = new fabric.Canvas(canvasEl.current, {
      width: CANVAS_W,
      height: CANVAS_H,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    canvasRef.current = c;

    // Selection events
    c.on('selection:created', (e) => { if (e.selected?.[0]) selectObject(e.selected[0]); });
    c.on('selection:updated', (e) => { if (e.selected?.[0]) selectObject(e.selected[0]); });
    c.on('selection:cleared', () => { setSelectedId(null); });
    c.on('object:modified', () => {
      if (canvasRef.current) saveState(canvasRef.current);
      updateLayers();
    });

    // Canvas click for deselection
    c.on('mouse:down', (e) => {
      if (e.e.target === c.upperCanvasEl) {
        c.discardActiveObject();
        c.requestRenderAll();
        setSelectedId(null);
      }
    });

    saveState(c);
    updateLayers();

    return () => { canvasRef.current?.dispose(); canvasRef.current = null; };
  }, []);

  // === HELPERS ===
  const saveState = useCallback((c) => {
    if (!c) return;
    setUndoStack(prev => {
      const next = [...prev, JSON.stringify(c.toJSON(['name']))];
      if (next.length > MAX_HISTORY) next.shift();
      return next;
    });
    setRedoStack([]);
  }, []);

  const updateLayers = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const objs = c.getObjects().map((o, i) => ({
      id: o.id || `obj_${i}`,
      name: o.name || `${o.type}_${i + 1}`,
      type: o.type,
      visible: o.visible !== false,
      index: i,
    }));
    setLayers(objs.reverse());
  }, []);

  const selectObject = useCallback((obj) => {
    if (!obj) return;
    setSelectedId(obj.id);
    setPropX(Math.round(obj.left || 0));
    setPropY(Math.round(obj.top || 0));
    setPropW(Math.round(obj.width * obj.scaleX || CANVAS_W));
    setPropH(Math.round(obj.height * obj.scaleY || CANVAS_H));
    setPropOpacity(Math.round((obj.opacity || 1) * 100));
    setPropFill(obj.fill || '#4f46e5');
  }, []);

  const genId = () => `obj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const addObject = useCallback((obj, name) => {
    const c = canvasRef.current;
    if (!c) return;
    obj.id = genId();
    obj.name = name || `${obj.type}_${c.getObjects().length + 1}`;
    c.add(obj);
    c.setActiveObject(obj);
    c.requestRenderAll();
    selectObject(obj);
    saveState(c);
    updateLayers();
  }, [saveState, selectObject]);

  // === TOOLS ===
  const handleToolChange = useCallback((toolId) => {
    const c = canvasRef.current;
    if (!c) return;
    setActiveTool(toolId);

    if (toolId === 'select') {
      c.isDrawingMode = false;
      c.selection = true;
      c.defaultCursor = 'default';
    } else if (toolId === 'pen') {
      c.isDrawingMode = true;
      c.freeDrawingBrush.width = 3;
      c.freeDrawingBrush.color = dark ? '#ffffff' : '#000000';
      c.selection = false;
    } else {
      c.isDrawingMode = false;
      c.selection = false;
      c.defaultCursor = 'crosshair';
    }
  }, [dark]);

  // Canvas click for shape/text placement
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const handleMouseDown = (e) => {
      if (!e.e) return;
      const pointer = c.getPointer(e.e);
      if (pointer.x < 0 || pointer.y < 0 || pointer.x > CANVAS_W || pointer.y > CANVAS_H) return;

      const target = c.findTarget(e.e, false);
      if (target && (activeTool === 'select' || e.e.button !== 0)) return;

      if (activeTool === 'text') {
        const text = new fabric.IText('Type here', {
          left: pointer.x, top: pointer.y,
          fontSize: 32, fontFamily: 'Inter, sans-serif',
          fill: dark ? '#ffffff' : '#1f2937',
          padding: 8,
        });
        addObject(text, `Text ${c.getObjects().length + 1}`);
        setActiveTool('select');
      } else if (activeTool === 'rect') {
        const rect = new fabric.Rect({
          left: pointer.x - 50, top: pointer.y - 50,
          width: 100, height: 100,
          fill: '#4f46e5', rx: 0, ry: 0,
          stroke: '#3730a3', strokeWidth: 2,
        });
        addObject(rect, `Rectangle ${c.getObjects().length + 1}`);
        setActiveTool('select');
      } else if (activeTool === 'circle') {
        const circle = new fabric.Ellipse({
          left: pointer.x - 50, top: pointer.y - 50,
          rx: 50, ry: 50,
          fill: '#ec4899',
          stroke: '#be185d', strokeWidth: 2,
        });
        addObject(circle, `Circle ${c.getObjects().length + 1}`);
        setActiveTool('select');
      }
    };

    c.off('mouse:down', handleMouseDown);
    c.on('mouse:down', handleMouseDown);
    return () => { c.off('mouse:down', handleMouseDown); };
  }, [activeTool, addObject, dark]);

  // === ACTIONS ===
  const handleUndo = useCallback(() => {
    const c = canvasRef.current;
    if (!c || undoStack.length < 2) return;
    const current = undoStack[undoStack.length - 1];
    const prev = undoStack[undoStack.length - 2];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, current]);
    c.loadFromJSON(JSON.parse(prev), () => {
      c.requestRenderAll();
      updateLayers();
    });
  }, [undoStack]);

  const handleRedo = useCallback(() => {
    const c = canvasRef.current;
    if (!c || redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, next]);
    c.loadFromJSON(JSON.parse(next), () => {
      c.requestRenderAll();
      updateLayers();
    });
  }, [redoStack]);

  const handleDelete = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const active = c.getActiveObject();
    if (active) {
      if (active.type === 'activeSelection') {
        active.forEachObject(o => c.remove(o));
      } else {
        c.remove(active);
      }
      c.discardActiveObject();
      c.requestRenderAll();
      setSelectedId(null);
      saveState(c);
      updateLayers();
    }
  }, [saveState]);

  const handleDuplicate = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const active = c.getActiveObject();
    if (!active) return;
    active.clone((cloned) => {
      cloned.left = (cloned.left || 0) + 20;
      cloned.top = (cloned.top || 0) + 20;
      cloned.id = genId();
      cloned.name = `${cloned.name || cloned.type} copy`;
      c.add(cloned);
      c.setActiveObject(cloned);
      c.requestRenderAll();
      selectObject(cloned);
      saveState(c);
      updateLayers();
    });
  }, [saveState, selectObject]);

  const handleExport = useCallback((fmt = 'png') => {
    const c = canvasRef.current;
    if (!c) return;
    const link = document.createElement('a');
    link.download = `aipik-design.${fmt}`;
    link.href = fmt === 'png' ? c.toDataURL({ format: 'png', multiplier: 2 }) : c.toDataURL({ format: 'jpg', multiplier: 2 });
    link.click();
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      fabric.FabricImage.fromURL(ev.target.result, (img) => {
        const maxDim = 400;
        const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
        img.set({ scaleX: scale, scaleY: scale });
        addObject(img, `Image ${canvasRef.current?.getObjects().length + 1}`);
        setActiveTool('select');
      }, { crossOrigin: 'anonymous' });
    };
    reader.readAsDataURL(file);
  }, [addObject]);

  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); handleDelete(); }
    if (e.key === 'z' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); if (e.shiftKey) handleRedo(); else handleUndo(); }
    if (e.key === 'd' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleDuplicate(); }
  }, [handleDelete, handleUndo, handleRedo, handleDuplicate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // === PROPERTIES PANEL ===
  const updateProperty = useCallback((key, value) => {
    const c = canvasRef.current;
    const active = c?.getActiveObject();
    if (!active) return;

    const numVal = parseFloat(value);
    switch (key) {
      case 'left':
        active.set({ left: isNaN(numVal) ? 0 : numVal });
        break;
      case 'top':
        active.set({ top: isNaN(numVal) ? 0 : numVal });
        break;
      case 'width':
        if (!isNaN(numVal) && numVal > 0) {
          const ratio = numVal / (active.width * active.scaleX);
          active.set({ scaleX: ratio * active.scaleX });
        }
        break;
      case 'height':
        if (!isNaN(numVal) && numVal > 0) {
          const ratio = numVal / (active.height * active.scaleY);
          active.set({ scaleY: ratio * active.scaleY });
        }
        break;
      case 'opacity':
        active.set({ opacity: Math.max(0, Math.min(1, numVal / 100 || 1)) });
        break;
      case 'fill':
        active.set({ fill: value });
        break;
    }
    active.setCoords();
    c.requestRenderAll();
    selectObject(active);
  }, [selectObject]);

  // Layer visibility toggle
  const toggleLayer = useCallback((layerId) => {
    const c = canvasRef.current;
    if (!c) return;
    c.getObjects().forEach(o => {
      if (o.id === layerId) {
        o.visible = !o.visible;
        c.requestRenderAll();
        updateLayers();
      }
    });
  }, []);

  // Layer select
  const selectLayer = useCallback((layerId) => {
    const c = canvasRef.current;
    if (!c) return;
    c.getObjects().forEach(o => {
      if (o.id === layerId) {
        c.setActiveObject(o);
        c.requestRenderAll();
        selectObject(o);
      }
    });
  }, [selectObject]);

  const canvasScale = zoom / 100;

  return (
    <div className="max-w-full mx-auto -m-6 flex flex-col h-screen" 
         style={{ height: '100vh' }}>
      {/* File input hidden */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border shrink-0">
        <div className="flex items-center gap-1.5">
          <button onClick={handleUndo} className="p-2 hover:bg-surface-secondary rounded-lg text-text-secondary" title="Undo (Ctrl+Z)">
            <Undo2 size={18} />
          </button>
          <button onClick={handleRedo} className="p-2 hover:bg-surface-secondary rounded-lg text-text-secondary" title="Redo (Ctrl+Shift+Z)">
            <Redo2 size={18} />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button onClick={handleDuplicate} className="p-2 hover:bg-surface-secondary rounded-lg text-text-secondary" title="Duplicate (Ctrl+D)">
            <Copy size={18} />
          </button>
          <button onClick={handleDelete} className="p-2 hover:bg-surface-secondary rounded-lg text-text-secondary" title="Delete (Del)">
            <Trash2 size={18} />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button onClick={() => setDark(d => !d)} className="p-2 hover:bg-surface-secondary rounded-lg text-text-secondary" title="Toggle theme">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-secondary rounded-lg px-3 py-1.5">
            <button onClick={() => setZoom(z => Math.max(25, z - 25))} className="text-text-secondary hover:text-text-primary">
              <ZoomOut size={16} />
            </button>
            <span className="text-sm font-medium text-text-primary w-12 text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="text-text-secondary hover:text-text-primary">
              <ZoomIn size={16} />
            </button>
            <button onClick={() => setZoom(100)} className="text-xs text-text-muted hover:text-text-primary ml-1">Fit</button>
          </div>
          <div className="flex gap-1">
            <button onClick={() => handleExport('png')} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover">
              <Download size={15} /> PNG
            </button>
            <button onClick={() => handleExport('jpg')} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-secondary text-text-primary text-sm font-medium rounded-lg hover:bg-surface-secondary/60">
              JPG
            </button>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 min-h-0">
        {/* Left Tool Panel */}
        <div className="w-14 bg-surface border-r border-border flex flex-col items-center py-3 gap-1 shrink-0">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  if (tool.id === 'image') { fileInputRef.current?.click(); return; }
                  handleToolChange(tool.id);
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                  activeTool === tool.id ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface-secondary'
                }`}
                title={tool.label}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-surface-secondary dark:bg-dark-tertiary flex items-center justify-center overflow-auto p-4">
          <div
            className="shadow-2xl rounded-lg overflow-hidden transition-all duration-200"
            style={{
              transform: `scale(${canvasScale})`,
              transformOrigin: 'center center',
            }}
          >
            <canvas ref={canvasEl} />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-64 bg-surface border-l border-border flex flex-col shrink-0 overflow-y-auto">
          {/* Properties */}
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Palette size={14} /> Properties
            </h3>
            {selectedId ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-text-muted">X</label>
                    <input type="number" value={propX} onChange={e => updateProperty('left', e.target.value)}
                      className="w-full px-2 py-1.5 bg-surface-secondary border border-border rounded text-xs text-text-primary" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted">Y</label>
                    <input type="number" value={propY} onChange={e => updateProperty('top', e.target.value)}
                      className="w-full px-2 py-1.5 bg-surface-secondary border border-border rounded text-xs text-text-primary" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-text-muted">Width</label>
                    <input type="number" value={propW} onChange={e => updateProperty('width', e.target.value)}
                      className="w-full px-2 py-1.5 bg-surface-secondary border border-border rounded text-xs text-text-primary" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted">Height</label>
                    <input type="number" value={propH} onChange={e => updateProperty('height', e.target.value)}
                      className="w-full px-2 py-1.5 bg-surface-secondary border border-border rounded text-xs text-text-primary" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-text-muted">Opacity: {propOpacity}%</label>
                  <input type="range" min="0" max="100" value={propOpacity} onChange={e => updateProperty('opacity', e.target.value)} className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-text-muted">Fill Color</label>
                  <div className="flex gap-2 items-center mt-1">
                    <input type="color" value={propFill} onChange={e => updateProperty('fill', e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-border" />
                    <span className="text-xs text-text-muted font-mono">{propFill}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-muted italic">Select an object to edit</p>
            )}
          </div>

          {/* Layers */}
          <div className="flex-1 p-4">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Layers size={14} /> Layers ({layers.length})
            </h3>
            {layers.length === 0 ? (
              <p className="text-xs text-text-muted italic">No layers yet</p>
            ) : (
              <div className="space-y-1">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    onClick={() => selectLayer(layer.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group transition-colors ${
                      selectedId === layer.id ? 'bg-primary/10 ring-1 ring-primary/20' : 'hover:bg-surface-secondary'
                    }`}
                  >
                    <button onClick={(e) => { e.stopPropagation(); toggleLayer(layer.id); }}
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        layer.visible ? 'border-primary bg-primary/10 text-primary' : 'border-border'
                      }`}>
                      {layer.visible && <span className="text-[8px]">✓</span>}
                    </button>
                    <span className="text-xs text-text-primary flex-1 truncate">{layer.name}</span>
                    <span className="text-[10px] text-text-muted uppercase">{layer.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
