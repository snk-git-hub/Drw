"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import SplashScreen from "./SplashScreen"; 

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const shouldReload = sessionStorage.getItem("reload-once");
    if (shouldReload === "true") {
      sessionStorage.removeItem("reload-once");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No token found in localStorage");
      setError("No authentication token found");
      setIsConnecting(false);
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setSocket(ws);
      setIsConnecting(false);

      const joinPayload = JSON.stringify({
        type: "join_room",
        roomId,
      });

      ws.send(joinPayload);
    };

    ws.onerror = (e) => {
      console.error("WebSocket error:", e);
      setError("Failed to connect to server. Please check your connection.");
      setIsConnecting(false);
    };

    ws.onclose = () => {
      console.log("WebSocket closed.");
      setSocket(null);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [roomId]);

  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center text-red-400 bg-black">
        Error: {error}
      </div>
    );
  }

  if (isConnecting || !socket) {
    return <SplashScreen />;
  }

  return (
    <div className="w-full h-full">
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}
