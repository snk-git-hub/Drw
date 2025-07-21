"use client"

import { useRef, useEffect, useState, MouseEvent } from 'react';

type Tool = 'pen' | 'eraser';

interface CanvasProps {}

const Canvas: React.FC<CanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [brushSize, setBrushSize] = useState<number>(2);
  const [color, setColor] = useState<string>('#000000');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    
    setIsDrawing(true);
    
    // Configure tool settings
    if (tool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2; // Make eraser bigger
    }
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    
    ctx.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'canvas-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const presetColors: string[] = [
    '#000000', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#ff00ff', '#00ffff'
  ];

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800"></h1>
      
      <div className="mb-6 flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-md">
        {/* Tool Selection */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Tool:</label>
          <button
            onClick={() => setTool('pen')}
            className={`px-3 py-1 rounded ${
              tool === 'pen' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
          >
            ✏️ Pen
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`px-3 py-1 rounded ${
              tool === 'eraser' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
          >
            🧹 Eraser
          </button>
        </div>

        {/* Color Selection (only show for pen) */}
        {tool === 'pen' && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Color:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <div className="flex space-x-1">
              {presetColors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded border-2 ${
                    color === c ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Brush Size */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            {tool === 'pen' ? 'Brush Size:' : 'Eraser Size:'}
          </label>
          <input
            type="range"
            min="1"
            max={tool === 'pen' ? "20" : "50"}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-gray-600 min-w-[2rem]">{brushSize}px</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 ml-auto">
          <button
            onClick={clearCanvas}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            🗑️ Clear
          </button>
          <button
            onClick={downloadCanvas}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            💾 Download
          </button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className={`border-2 border-gray-300 rounded-lg shadow-lg bg-white ${
          tool === 'pen' ? 'cursor-crosshair' : 'cursor-grab'
        }`}
        style={{ touchAction: 'none' }}
      />
      
      <p className="mt-4 text-gray-600 text-center">
        {tool === 'pen' 
          ? `Drawing with ${color} pen (${brushSize}px)` 
          : `Erasing with ${brushSize * 2}px eraser`}
        <br />
        Click and drag to {tool === 'pen' ? 'draw' : 'erase'} on the canvas
      </p>
    </div>
  );
};

export default Canvas;