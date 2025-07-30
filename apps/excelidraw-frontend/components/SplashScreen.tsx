export default function SplashScreen() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-black text-white">
      <div className="animate-pulse text-2xl font-light tracking-wider mb-4">
        Connecting...
      </div>
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
