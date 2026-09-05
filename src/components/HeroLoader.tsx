import React, { useEffect, useState } from 'react';

interface HeroLoaderProps {
  progress: number;
  isDone: boolean;
}

export const HeroLoader: React.FC<HeroLoaderProps> = ({ progress, isDone }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    setDisplayProgress((prev) => {
      if (progress > prev) return progress;
      return prev;
    });
  }, [progress]);

  useEffect(() => {
    if (isDone) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [isDone]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white select-none transition-all duration-700 ease-out ${
        isDone ? 'opacity-0 scale-[1.04] pointer-events-none blur-xs' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background glow effect */}
      <div className="absolute w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none animate-pulse" />

      {/* Main Loader Content */}
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Animated Brand Title */}
        <h1
          style={{
            fontFamily: "'AwesomeSerif', serif",
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          }}
          className="tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-400 drop-shadow-[0_0_25px_rgba(245,158,11,0.35)] mb-6 text-center"
        >
          VamananGPT
        </h1>

        {/* Progress Bar Container */}
        <div className="w-56 sm:w-72 h-2 bg-slate-900/90 rounded-full p-0.5 border border-slate-800/80 shadow-inner relative overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(245,158,11,0.6)]"
            style={{ width: `${Math.min(100, Math.max(0, displayProgress))}%` }}
          />
        </div>

        {/* Status & Percentage */}
        <div className="flex items-center justify-between w-56 sm:w-72 mt-3 text-xs tracking-wider">
          <span className="text-slate-400 font-medium uppercase text-[11px] tracking-widest animate-pulse">
            {isDone ? 'Entering World...' : 'Loading Experience...'}
          </span>
          <span className="font-mono text-amber-400/90 font-bold text-xs">
            {Math.round(displayProgress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroLoader;
