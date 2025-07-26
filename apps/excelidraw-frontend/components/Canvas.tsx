import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon, Eraser } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "pencil" | "eraser";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);

            return () => {
                g.destroy();
            }
        }
    }, [canvasRef]);

    return <div style={{
        height: "100vh",
        overflow: "hidden"
    }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
    </div>
}

function Topbar({ selectedTool, setSelectedTool }: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return <div style={{
        position: "fixed",
        top: 10,
        left: 10
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
                icon={<RectangleHorizontalIcon />}
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
        </div>
    </div>
}