"use client"
import { useRouter } from "next/navigation";
export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const handleNavigate = () => {
    if (isSignin) {
      router.push("/signup");
    } else {
      router.push("/signin");
    }
  };

  const canvas=()=>{
    router.push("/canvas");
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] opacity-30"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="relative p-10 m-4 bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-800/50 w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="w-12 h-12 bg-white rounded-lg mx-auto mb-6 flex items-center justify-center">
            <div className="w-6 h-6 bg-black rounded-sm"></div>
          </div>
          <h1 className="text-2xl font-light text-white mb-2 tracking-wide">
            {isSignin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-zinc-400 text-sm font-light">
            {isSignin ? "Please sign in to continue" : "Join our exclusive platform"}
          </p>
        </div>

        <div className="space-y-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Email address"
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-all duration-300 text-sm font-light"
            />
          </div>

          <div className="relative">
            <input
              placeholder="Password"
              type="password"
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-all duration-300 text-sm font-light"
            />
          </div>

           {isSignin?    
           null:<div className="relative">
            <input
              placeholder="Name"
              type="Name"
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-all duration-300 text-sm font-light"
            />
          </div>}



          <button
            onClick={canvas}
            className="w-full mt-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-zinc-100 transition-all duration-200 text-sm tracking-wide uppercase"
          >
            {isSignin ? "Sign In" : "Sign Up"}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-xs font-light">
            {isSignin ? "New here?" : "Already a member?"}
            <span
              className="text-white hover:text-zinc-300 cursor-pointer ml-2 font-normal"
              onClick={handleNavigate}
            >
              {isSignin ? "Create account" : "Sign in"}
            </span>
          </p>
        </div>

        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-60"></div>
      </div>
    </div>
  );
}