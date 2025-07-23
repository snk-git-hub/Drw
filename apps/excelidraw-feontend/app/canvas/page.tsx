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
      let clicked=false;
      let StartX=0;
      let StartY=0;
      
      const getMousePos = (e) => {
        const rect = canvas.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      };
      
      canvas.addEventListener("mousedown",(e)=>{
        clicked=true;
        const pos = getMousePos(e);
        StartX=pos.x;
        StartY=pos.y;
      })
         
      canvas.addEventListener("mouseup",(e)=>{
        clicked=false;
        const pos = getMousePos(e);
        StartX=pos.x;
        StartY=pos.y;
      })
      
      canvas.addEventListener("mousemove",(e)=>{
        if(clicked){
          const pos = getMousePos(e);
          const width = pos.x - StartX;
          const height = pos.y - StartY;
          ctx.clearRect(0,0,canvas.width,canvas.height);
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeRect(StartX,StartY,width,height);
           
          console.log(pos.x)
          console.log(pos.y)
        }
      })
           
    }
  }, [canvasRef]);
     
  return (
    <div>
      <canvas ref={canvasRef} width={1900} height={950}></canvas>
    </div>
  )
}