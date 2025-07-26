import { ReactNode } from "react";

export function IconButton({
    icon, 
    onClick, 
    activated 
}: {
    icon: ReactNode,
    onClick: () => void,
    activated: boolean
}) {
    return (
        <div 
            className={`
                m-2 cursor-pointer rounded-xl border-2 p-3 
                transition-all duration-200 ease-in-out
                bg-gray-900/80 backdrop-blur-sm
                border-gray-700 hover:border-gray-500
                hover:bg-gray-800/90 hover:scale-105
                active:scale-95 active:bg-gray-700
                shadow-lg hover:shadow-xl
                ${activated 
                    ? "text-cyan-400 border-cyan-400/50 bg-cyan-400/10 shadow-cyan-400/20" 
                    : "text-gray-300 hover:text-white"
                }
            `} 
            onClick={onClick}
        >
            <div className="flex items-center justify-center w-5 h-5">
                {icon}
            </div>
        </div>
    );
}