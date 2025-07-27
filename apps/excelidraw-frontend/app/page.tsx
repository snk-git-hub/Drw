"use client"
import Link from 'next/link'
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function CollaborativeDrawingLanding() {

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] opacity-30"></div>
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        ></div>
      </div>

  
      <div 
        className="fixed w-96 h-96 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(147, 197, 253, 0.15) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: 'all 0.1s ease-out'
        }}
      ></div>

   
      <nav className="relative z-50 flex justify-between items-center p-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm"></div>
          </div>
          <span className="text-white font-light text-lg tracking-wide">DRW</span>
        </div>
        
        <div className="hidden md:flex space-x-8">
        </div>

        <button 
        
            className="px-6 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-100 transition-all duration-200 uppercase tracking-wide">
          <Link 
          href="/signin"
          className="... inline-block"
          >Sign In</Link>
        </button>
      </nav>

     
      <main className="relative z-10 px-8 py-20">
        <div className="max-w-6xl mx-auto text-center">
     
          <div className="mb-16">
            <h1 className="text-6xl md:text-8xl font-extralight text-white mb-8 tracking-tight leading-none">
              Draw
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Together
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 font-light max-w-3xl mx-auto leading-relaxed">
              Real-time collaborative drawing that brings teams together. 
              Create, ideate, and innovate with infinite possibilities.
            </p>
          </div>

       
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button className="px-12 py-4 bg-white text-black font-medium rounded-lg hover:bg-zinc-100 transform hover:scale-105 transition-all duration-200 text-sm uppercase tracking-wide shadow-2xl">
              Start Drawing
            </button>
           
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-zinc-800/50 p-1 shadow-2xl">
              <div className="bg-zinc-800/50 rounded-t-2xl px-4 py-3 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1 text-center">
                  <div className="text-zinc-400 text-xs font-light">DRW.app/canvas/team-brainstorm</div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-b-2xl h-96 relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
                  <path
                    d="M100,200 Q200,100 300,200 T500,200"
                    stroke="rgba(147, 197, 253, 0.6)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  
                  <circle cx="150" cy="180" r="4" fill="#3b82f6" className="animate-pulse">
                    <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="350" cy="220" r="4" fill="#8b5cf6" className="animate-pulse">
                    <animate attributeName="r" values="4;6;4" dur="2s" begin="0.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="450" cy="180" r="4" fill="#ec4899" className="animate-pulse">
                    <animate attributeName="r" values="4;6;4" dur="2s" begin="1s" repeatCount="indefinite"/>
                  </circle>
                  
                 <g transform="translate(200, 150)">
                    <path d="M0,0 L0,16 L4,12 L8,12 Z" fill="white" stroke="black" strokeWidth="0.5"/>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="200,150; 250,160; 300,140; 200,150"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </g>
                  
                  <g transform="translate(400, 250)">
                    <path d="M0,0 L0,16 L4,12 L8,12 Z" fill="white" stroke="black" strokeWidth="0.5"/>
                    <animateTransform
                      attributeName="transform" 
                      type="translate"
                      values="400,250; 350,240; 380,220; 400,250"
                      dur="6s"
                      repeatCount="indefinite"
                    />
                  </g>
                </svg>
                
                <div className="absolute top-4 right-4 flex space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-medium">A</div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-medium">B</div>
                  <div className="w-8 h-8 bg-pink-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-medium">C</div>
                  <div className="w-8 h-8 bg-zinc-700 rounded-full border-2 border-white flex items-center justify-center text-xs text-white">
                    +2
                  </div>
                </div>
                
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-zinc-800/80 backdrop-blur-sm rounded-xl p-2 space-y-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-black rounded-sm"></div>
                  </div>
                  <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-0.5 bg-white"></div>
                  </div>
                  <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 border border-white rounded-full"></div>
                  </div>
                  <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center text-white text-xs">T</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="relative z-10 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-white text-center mb-16 tracking-wide">
            Built for Modern Teams
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
           
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-8 hover:bg-zinc-900/70 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                <div className="w-6 h-6 border-2 border-blue-400 rounded-full"></div>
              </div>
              <h3 className="text-xl font-light text-white mb-4">Real-time Sync</h3>
              <p className="text-zinc-400 font-light leading-relaxed">
                See every stroke as it happens. Collaborate seamlessly with instant synchronization across all devices.
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-8 hover:bg-zinc-900/70 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
                  <div className="w-2 h-2 bg-purple-400 rounded-sm"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-sm"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-sm"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-sm"></div>
                </div>
              </div>
              <h3 className="text-xl font-light text-white mb-4">Infinite Canvas</h3>
              <p className="text-zinc-400 font-light leading-relaxed">
                No boundaries to your creativity. Zoom, pan, and explore ideas on an unlimited workspace.
              </p>
            </div>

           
            <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-8 hover:bg-zinc-900/70 transition-all duration-300">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6">
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-4 h-0.5 bg-pink-400 transform rotate-45"></div>
                  <div className="w-4 h-0.5 bg-pink-400 transform -rotate-45 -ml-4"></div>
                </div>
              </div>
              <h3 className="text-xl font-light text-white mb-4">Smart Tools</h3>
              <p className="text-zinc-400 font-light leading-relaxed">
                Advanced drawing tools with AI assistance for shapes, text recognition, and collaborative features.
              </p>
            </div>
          </div>
        </div>
      </section>

   
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-zinc-800/50 p-12">
            <h2 className="text-4xl font-light text-white mb-6 tracking-wide">
              Ready to Start Creating?
            </h2>
            <p className="text-xl text-zinc-400 font-light mb-8">
              Join thousands of teams already collaborating on DRW
            </p>
            <button className="px-12 py-4 bg-white text-black font-medium rounded-lg hover:bg-zinc-100 transform hover:scale-105 transition-all duration-200 text-sm uppercase tracking-wide shadow-2xl">
              Get Started Free
            </button>
          </div>
        </div>
      </section>

   
      <footer className="relative z-10 px-8 py-12 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-sm"></div>
            </div>
            <span className="text-zinc-400 font-light">DRW</span>
          </div>
          
          <div className="text-zinc-500 text-sm font-light">
            © 2025 DRW. Built for creators.
          </div>
        </div>
      </footer>
    </div>
  );
}