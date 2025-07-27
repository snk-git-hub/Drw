"use client";

import { WS_URL } from "@/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({roomId}: {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            console.error('No token found in localStorage');
            setError('No authentication token found');
            setIsConnecting(false);
            return;
        }

        console.log("hooo");
        console.log(token);

        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        
        ws.onopen = () => {
            setSocket(ws);
            setIsConnecting(false);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            console.log(data);
            ws.send(data);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError('Failed to connect to server  /n press WIN+R');
            setIsConnecting(false);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
            setSocket(null);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    }, [roomId]); 
   
    if (error) {
        return <div>
            Error: {error}
        </div>;
    }

    if (isConnecting || !socket) {
        return <div>
            Connecting to server....
        </div>;
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>;
}