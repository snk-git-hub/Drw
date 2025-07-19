"use client";

import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
    messages,
    id
}: {
    messages: {message: string}[];
    id: string
}) {
    const [chats, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState("");
    const {socket, loading} = useSocket();

    const handleMessage = useCallback((event: MessageEvent) => {
        try {
            const parsedData = JSON.parse(event.data);
            console.log('Received WebSocket message:', parsedData); // Debug log
            
            if (parsedData.type === "chat") {
                setChats(prevChats => [...prevChats, {message: parsedData.message}]);
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }, []);

    useEffect(() => {
        if (socket && !loading) {
        
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }));

            socket.addEventListener('message', handleMessage);

           
            return () => {
                socket.removeEventListener('message', handleMessage);
            };
        }
    }, [socket, loading, id, handleMessage]);

    const sendMessage = () => {
        if (socket && currentMessage.trim()) {
            socket.send(JSON.stringify({
                type: "chat",
                roomId: id,
                message: currentMessage
            }));
            setCurrentMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-96 max-w-md mx-auto border rounded-lg">
          
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {chats.map((m, index) => (
                    <div key={index} className="p-2 bg-gray-100 rounded">
                        {m.message}
                    </div>
                ))}
            </div>

         
            <div className="p-4 border-t flex gap-2">
                <input 
                    type="text" 
                    value={currentMessage} 
                    onChange={e => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                    Send
                </button>
            </div>
        </div>
    );
}