"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateRandomId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }

    if (roomId.length < 1) {
      setError("Room ID must be at least 1 character");
      return;
    }

    setError("");
    setIsLoading(true);

    sessionStorage.setItem("reload-once", "true");

    router.push(`/canvas/${roomId.trim()}`);
  };

  const handleCreateRoom = async () => {
    const newRoomId = generateRandomId();
    setRoomId(newRoomId);
    setError("");
    setIsLoading(true);

    try {
      sessionStorage.setItem("reload-once", "true");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/canvas/${newRoomId}`);
    } catch (err) {
      setError("Failed to create room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    router.push("/signin");
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] opacity-30"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      ></div>

      <button
        onClick={handleSignOut}
        className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors duration-200 text-sm font-light"
      >
        Sign Out
      </button>

      <div className="relative p-10 m-4 bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-800/50 w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="w-12 h-12 bg-white rounded-lg mx-auto mb-6 flex items-center justify-center">
            <div className="w-6 h-6 bg-black rounded-sm"></div>
          </div>
          <h1 className="text-2xl font-light text-white mb-2 tracking-wide">
            Join a Room
          </h1>
          <p className="text-zinc-400 text-sm font-light">
            Enter a room ID or create a new collaborative space
          </p>
        </div>

        <div className="space-y-8">
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={roomId}
                placeholder="Enter Room ID"
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleJoinRoom();
                  }
                }}
                disabled={isLoading}
                className="w-full px-0 py-3 bg-transparent border-0 border-b border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-all duration-300 text-sm font-light disabled:opacity-50 text-center tracking-widest"
                maxLength={10}
                autoComplete="off"
              />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
            </div>

            <div
              onClick={(e) => {
                e.preventDefault();
                handleJoinRoom();
              }}
              className={`w-full py-4 bg-white text-black font-medium rounded-lg hover:bg-zinc-100 transition-all duration-200 text-sm tracking-wide uppercase cursor-pointer text-center ${
                isLoading || !roomId.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? "Joining..." : "Join Room"}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-4 text-zinc-500 font-light tracking-wider">
                or
              </span>
            </div>
          </div>

          <button
            onClick={handleCreateRoom}
            disabled={isLoading}
            className="w-full py-4 bg-transparent border border-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-800/50 hover:border-zinc-600 transition-all duration-200 text-sm tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Create New Room"}
          </button>

          <div className="mt-8 p-4 bg-zinc-800/30 rounded-lg border border-zinc-800">
            <h3 className="text-white text-sm font-medium mb-2">Quick Tips:</h3>
            <ul className="text-zinc-400 text-xs space-y-1 font-light">
              <li>• Room IDs must be at least 1 character</li>
              <li>• Share your room ID with collaborators</li>
              <li>• Created rooms are automatically saved</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-3/4 w-1 h-1 bg-white rounded-full opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </div>
  );
}
