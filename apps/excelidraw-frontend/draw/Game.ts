import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    points: { x: number; y: number }[]; 
} | {
    type: "eraser";
    points: { x: number; y: number }[]; 
}

export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[]
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "circle";
    private currentPencilStroke: { x: number; y: number }[] = []; 
    private currentEraserStroke: { x: number; y: number }[] = []; 

    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }
    
    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    setTool(tool: "circle" | "pencil" | "rect" | "eraser") {
        this.selectedTool = tool;
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        console.log(this.existingShapes);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type == "chat") {
                const parsedShape = JSON.parse(message.message)
                this.existingShapes.push(parsedShape.shape)
                this.clearCanvas();
            }
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.map((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeStyle = "rgba(255, 255, 255)"
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.strokeStyle = "rgba(255, 255, 255)"
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();                
            } else if (shape.type === "pencil") {
                this.drawPencilStroke(shape.points);
            } else if (shape.type === "eraser") {
                this.drawEraserStroke(shape.points);
            }
        })
    }

    drawPencilStroke(points: { x: number; y: number }[]) {
        if (points.length < 2) return;
        
        this.ctx.strokeStyle = "rgba(255, 255, 255)";
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawEraserStroke(points: { x: number; y: number }[]) {
        if (points.length < 2) return;
        
        this.ctx.strokeStyle = "rgba(0, 0, 0)";
        this.ctx.lineWidth = 8; 
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        
        this.ctx.stroke();
        this.ctx.closePath();
    }

    getCanvasCoordinates(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        const coords = this.getCanvasCoordinates(e);
        this.startX = coords.x;
        this.startY = coords.y;
        
        if (this.selectedTool === "pencil") {
            this.currentPencilStroke = [{ x: this.startX, y: this.startY }];
        } else if (this.selectedTool === "eraser") {
            this.currentEraserStroke = [{ x: this.startX, y: this.startY }];
        }
    }

    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false;
        const coords = this.getCanvasCoordinates(e);
        const width = coords.x - this.startX;
        const height = coords.y - this.startY;

        const selectedTool = this.selectedTool;
        let shape: Shape | null = null;
        
        if (selectedTool === "rect") {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width
            }
        } else if (selectedTool === "circle") {
            const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + width / 2,
                centerY: this.startY + height / 2,
            }
        } else if (selectedTool === "pencil") {
            this.currentPencilStroke.push({ x: coords.x, y: coords.y });
            
            if (this.currentPencilStroke.length > 1) {
                shape = {
                    type: "pencil",
                    points: [...this.currentPencilStroke]
                }
            }
            
            this.currentPencilStroke = [];
        } else if (selectedTool === "eraser") {
            this.currentEraserStroke.push({ x: coords.x, y: coords.y });
            
            if (this.currentEraserStroke.length > 1) {
                shape = {
                    type: "eraser",
                    points: [...this.currentEraserStroke]
                }
            }
            
            this.currentEraserStroke = [];
        }

        if (!shape) {
            return;
        }

        this.existingShapes.push(shape);

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: this.roomId
        }))
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            const coords = this.getCanvasCoordinates(e);
            const width = coords.x - this.startX;
            const height = coords.y - this.startY;
            
            this.clearCanvas();
            this.ctx.strokeStyle = "rgba(255, 255, 255)";
            
            const selectedTool = this.selectedTool;
            
            if (selectedTool === "rect") {
                this.ctx.strokeRect(this.startX, this.startY, width, height);   
            } else if (selectedTool === "circle") {
                const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
                const centerX = this.startX + width / 2;
                const centerY = this.startY + height / 2;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();                
            } else if (selectedTool === "pencil") {
                this.currentPencilStroke.push({ x: coords.x, y: coords.y });
                
                this.drawPencilStroke(this.currentPencilStroke);
            } else if (selectedTool === "eraser") {
                this.currentEraserStroke.push({ x: coords.x, y: coords.y });
                
                this.drawEraserStroke(this.currentEraserStroke);
            }
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);    
    }
}