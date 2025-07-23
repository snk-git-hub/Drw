"use client"
import { useEffect, useRef } from "react"

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
     ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = 'black';
      ctx.strokeRect(25, 25, 100, 100);
    }
  }, []);
  
  return (
    <div>
      <canvas ref={canvasRef} width={1900} height={950}></canvas>
    </div>
  )
}