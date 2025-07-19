import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNjBlNmVhNS0wMGI3LTRiYmItODc3Yi1hZDMzMDEwNGRjMzYiLCJpYXQiOjE3NTI5NTQwMDV9.bjSrjlyCN2wl2CmgePbPMamOJ5KI1Es11JWngeHECn0`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);

    return {
        socket,
        loading
    }

}