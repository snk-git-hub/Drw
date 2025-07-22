"use client"

import { useRef, useEffect, useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Tool = 'pen' | 'eraser';

interface CanvasProps {}

const Canvas: React.FC<CanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [brushSize, setBrushSize] = useState<number>(2);
  const [color, setColor] = useState<string>('#000000');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

 const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.post(
      'http://localhost:3001/verify-token',
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.valid;
  } catch (error: any) {
    console.error('Token verification failed:', error.response?.data || error.message);
    return false;
  }
};
  
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('accessToken') || 
                   localStorage.getItem('authToken') || 
                   sessionStorage.getItem('token') ||
                   sessionStorage.getItem('accessToken') ||
                   sessionStorage.getItem('authToken');

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        router.push('/signin');
        return;
      }

      const isValid = await verifyToken(token);
      
      if (isValid) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('authToken');
        
        setIsAuthenticated(false);
        router.push('/signin');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 800;
    canvas.height = 600;
    
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
    
    if (tool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2; 
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

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out? Your current drawing will be cleared.');
    if (confirmLogout) {
      clearCanvas();
      setTool('pen');
      setBrushSize(2);
      setColor('#000000');
      
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userData');
      
      
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userData');
      
      router.push('/signin');
    }
  };

  const presetColors: string[] = [
    '#000000', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#ff00ff', '#00ffff'
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying Access</h2>
          <p className="text-gray-600">Please wait while we authenticate you...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need to sign in to access the canvas.</p>
          <button
            onClick={() => router.push('/signin')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Canvas Drawing App</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
        >
          🚪 Log Out
        </button>
      </div>
      
      <div className="mb-6 flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-md">
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
            Pen
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`px-3 py-1 rounded ${
              tool === 'eraser' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
          >
            Eraser
          </button>
        </div>

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