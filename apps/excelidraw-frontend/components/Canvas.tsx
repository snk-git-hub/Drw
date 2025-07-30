import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, Square, Eraser, MousePointer } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "pencil" | "eraser" | "select";

function IconButton({ 
    onClick, 
    activated, 
    icon 
}: { 
    onClick: () => void; 
    activated: boolean; 
    icon: React.ReactNode; 
}) {
    return (
        <button
            onClick={onClick}
            className={`p-2 rounded border-2 transition-colors ${
                activated 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
        >
            {icon}
        </button>
    );
}

class HandwrittenTextRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private animationId: number | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        
        this.loadHandwritingFont();
    }

    private loadHandwritingFont() {
        if (!document.querySelector('link[href*="Caveat"]')) {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = 'https://fonts.googleapis.com';
            document.head.appendChild(link);
            
            const link2 = document.createElement('link');
            link2.rel = 'preconnect';
            link2.href = 'https://fonts.gstatic.com';
            link2.crossOrigin = 'anonymous';
            document.head.appendChild(link2);
            
            const fontLink = document.createElement('link');
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap';
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);
        }
    }

    private processLatexText(text: string): string {
        return text
            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
            .replace(/\^(\w+)/g, '^$1')
            .replace(/_(\w+)/g, '_$1')
            .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
            .replace(/\\int/g, '∫')
            .replace(/\\sum/g, '∑')
            .replace(/\\alpha/g, 'α')
            .replace(/\\beta/g, 'β')
            .replace(/\\gamma/g, 'γ')
            .replace(/\\delta/g, 'δ')
            .replace(/\\pi/g, 'π')
            .replace(/\\theta/g, 'θ')
            .replace(/\\lambda/g, 'λ')
            .replace(/\\mu/g, 'μ')
            .replace(/\\sigma/g, 'σ')
            .replace(/\\infty/g, '∞')
            .replace(/\\leq/g, '≤')
            .replace(/\\geq/g, '≥')
            .replace(/\\neq/g, '≠')
            .replace(/\\times/g, '×')
            .replace(/\\div/g, '÷');
    }

    async animateText(text: string, x: number = 50, y: number = 100) {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.ctx.font = "28px 'Caveat', cursive";
        this.ctx.fillStyle = "#ffffff";
        this.ctx.strokeStyle = "#ffffff";
        this.ctx.lineWidth = 1.5;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        
        const processedText = this.processLatexText(text);
        const words = processedText.split(' ');
        
        let currentX = x;
        let currentY = y;
        const lineHeight = 40;
        const maxWidth = this.canvas.width - 100;
        
        let wordIndex = 0;
        let charIndex = 0;
        let currentWord = words[wordIndex] || '';

        const animate = () => {
            if (wordIndex >= words.length) return;

            const wobble = (Math.sin(Date.now() * 0.008) * 1.5);
            const currentChar = currentWord[charIndex];
            
            if (currentChar) {
                const charWidth = this.ctx.measureText(currentChar).width;
                
                if (currentX + charWidth > maxWidth) {
                    currentX = x;
                    currentY += lineHeight;
                }

                this.ctx.save();
                
                const rotation = (Math.random() - 0.5) * 0.08; 
                const scaleVariation = 0.95 + Math.random() * 0.1; 
                const xWobble = (Math.random() - 0.5) * 3;
                const yWobble = wobble + (Math.random() - 0.5) * 2;
                
                this.ctx.translate(currentX + xWobble, currentY + yWobble);
                this.ctx.rotate(rotation);
                this.ctx.scale(scaleVariation, scaleVariation);
                
                this.ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                this.ctx.shadowOffsetX = 1;
                this.ctx.shadowOffsetY = 1;
                this.ctx.shadowBlur = 2;
                
                this.ctx.fillText(currentChar, 0, 0);
                this.ctx.restore();

                currentX += charWidth + (Math.random() * 4 - 2);
                charIndex++;
            } else {
                wordIndex++;
                charIndex = 0;
                currentWord = words[wordIndex] || '';
                currentX += this.ctx.measureText(' ').width + (Math.random() * 3);
            }

            const delay = 60 + Math.random() * 120;
            setTimeout(() => {
                this.animationId = requestAnimationFrame(animate);
            }, delay);
        };

        animate();
    }

    clearText() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    destroy() {
        this.clearText();
    }
}

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textRendererRef = useRef<HandwrittenTextRenderer | null>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle");
    const [isLoading, setIsLoading] = useState(false);
    const [flaskResponse, setFlaskResponse] = useState<string>("");

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            textRendererRef.current = new HandwrittenTextRenderer(canvasRef.current);
            
            if (g.setSelectCompleteCallback) {
                g.setSelectCompleteCallback(handleSelectAreaComplete);
            }
            
            setGame(g);

            return () => {
                g.destroy();
                textRendererRef.current?.destroy();
            }
        }
    }, [canvasRef]);

    useEffect(() => {
        if (flaskResponse && textRendererRef.current) {
            textRendererRef.current.clearText();
            
            setTimeout(() => {
                textRendererRef.current?.animateText(flaskResponse, 50, 100);
            }, 500);
        }
    }, [flaskResponse]);

    const handleSelectAreaComplete = async (imageData: string) => {
        setIsLoading(true);
        setFlaskResponse(""); 
        
        try {
            const response = await fetch("http://localhost:5000/process-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageData: imageData,
                    prompt: `You are an expert in vision, math, science, handwriting, code, and analysis. Carefully examine the visual content provided and respond based on what it shows:

- If it contains written text: summarize or interpret it.
- If it includes a math problem: provide only the final answer. If something is unclear, ask a precise question.
- If it's a chart or graph: explain the key trends or data insights.
- If it shows a diagram: describe the components and what they represent.
- If it contains handwriting: transcribe it clearly.
- If it's code: explain what it does or debug it.
- If it's a visual scene: describe it clearly.

Be concise and accurate. Provide direct results where possible. Ask for clarification only if absolutely necessary.`
                })
            });
            
            const data = await response.json();
            const responseText = data.response || data.error || "No response received";
            
            console.log("Flask response:", responseText);
            setFlaskResponse(responseText);
            
        } catch (error) {
            console.error("Error sending to Flask:", error);
            setFlaskResponse("Error: Could not process image");
        } finally {
            setIsLoading(false);
        }
    };

    const clearResponse = () => {
        setFlaskResponse("");
        textRendererRef.current?.clearText();
    };

    return (
        <div style={{
            height: "100vh",
            overflow: "hidden",
            position: "relative"
        }}>
            {isLoading && (
                <div style={{
                    position: "fixed",
                    top: "10px",
                    right: "10px",
                    zIndex: 1000
                }}>
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            
            {flaskResponse && (
                <button
                    onClick={clearResponse}
                    style={{
                        position: "fixed",
                        top: "10px",
                        right: "60px",
                        zIndex: 1000,
                        padding: "8px 16px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Clear Response
                </button>
            )}
            
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
            <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
        </div>
    );
}

function Topbar({ selectedTool, setSelectedTool }: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return (
        <div style={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 100
        }}>  
            <div className="flex gap-1">
                <IconButton
                    onClick={() => {
                        setSelectedTool("pencil")
                    }}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil />}
                />
                <IconButton 
                    onClick={() => {
                        setSelectedTool("rect")
                    }} 
                    activated={selectedTool === "rect"} 
                    icon={<Square />}
                />
                <IconButton 
                    onClick={() => {
                        setSelectedTool("circle")
                    }} 
                    activated={selectedTool === "circle"} 
                    icon={<Circle />}
                />
                <IconButton 
                    onClick={() => {
                        setSelectedTool("eraser")
                    }} 
                    activated={selectedTool === "eraser"} 
                    icon={<Eraser />}
                />
                <IconButton 
                    onClick={() => {
                        setSelectedTool("select")
                    }} 
                    activated={selectedTool === "select"} 
                    icon={<MousePointer />}
                />
            </div>
        </div>
    );
}