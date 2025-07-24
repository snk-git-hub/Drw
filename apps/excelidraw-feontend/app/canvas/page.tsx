"use client"
import { useEffect, useRef } from "react"
import {initDraw} from "@/app/draw/index";


export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
     
  useEffect(() => {
    if(canvasRef.current){
      initDraw(canvasRef.current);
    }
    
  }, [canvasRef]);
     
  return (
    <div>
      <canvas ref={canvasRef} width={1900} height={950}></canvas>
    </div>
  )
}