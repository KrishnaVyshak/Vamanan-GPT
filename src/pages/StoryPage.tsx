import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import layer0 from '../assets/layers/0.png';
import layer1 from '../assets/layers/1.png';
import layer2 from '../assets/layers/2.png';
import layer3 from '../assets/layers/3.png';
import layer4 from '../assets/layers/4.png';
import patternImg from '../assets/images/pattern.png';
import idleImg from '../assets/images/idle.png';
import curiousImg from '../assets/images/curious.png';
import interestingImg from '../assets/images/interesting.png';
import surprizedImg from '../assets/images/surprized.png';
import wowImg from '../assets/images/wow.png';

interface LayerConfig {
  id: number | string;
  src: string;
  alt: string;
  factorX: number;
  factorY: number;
  scale: string;
  zIndex: number;
  baseOffsetY?: number;
  objectPos?: string;
  filterClass?: string;
}

const PARALLAX_LAYERS: LayerConfig[] = [
  { id: 0, src: layer0, alt: 'Sky',        factorX: 2,  factorY: 1.5, scale: 'scale-[1.01]', zIndex: 1 },
  { id: 4, src: layer4, alt: 'Layer 4',    factorX: 6,  factorY: 4,   scale: 'scale-[1.03]', zIndex: 2 },
  { id: 3, src: layer3, alt: 'Layer 3',    factorX: 14, factorY: 9,   scale: 'scale-[1.05]', zIndex: 3 },
  { id: 2, src: layer2, alt: 'Layer 2',    factorX: 24, factorY: 15,  scale: 'scale-[1.07]', zIndex: 4 },
  {
    id: 1, src: layer1, alt: 'Foreground', factorX: 30, factorY: 10,  scale: 'scale-[1.12]', zIndex: 6,
    baseOffsetY: 20, objectPos: 'object-bottom', filterClass: 'blur-[1px]',
  },
];

interface Chapter {
  id: number;
  emoji: string;
  title: string;
  body: string;
  funFact: string;
  sprite: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    emoji: '👑',
    title: 'The King Who Was Too Generous',
    body: "Mahabali — demon king, absolute chad, holder of the three worlds — was so generous he'd give you anything. The gods? Jobless. Heaven? Repossessed. Indra? Crying into his thunderbolt. His yajna was basically the cosmos's biggest charity drive, and nobody could stop him.",
    funFact: "🎙️ Indra's complaint to Vishnu was a 3-hour PowerPoint titled \"Mahabali Is Too Generous And Now I Am Broke.\"",
    sprite: 'idle',
  },
  {
    id: 2,
    emoji: '🧙‍♂️',
    title: 'Enter: The World\'s Most Suspicious Dwarf',
    body: "Vishnu — cosmic CEO, master of disguise — decided to cosplay as Vamanan: a tiny Brahmin boy with a tiny umbrella, a small pot, and the vibe of someone who definitely did NOT just wake up from an eon-long nap in Vaikunta. Completely harmless looking. Absolutely not.",
    funFact: "☂️ The tiny umbrella was 100% a fashion statement. Lakshmi saw it and said \"okay king.\"",
    sprite: 'curious',
  },
  {
    id: 3,
    emoji: '🤝',
    title: 'The World\'s Worst Real Estate Deal',
    body: "Vamanan toddled up to Mahabali's grand yajna and, in the squeakiest divine voice possible, asked for \"just three steps of land.\" Mahabali's advisor Shukracharya SCREAMED \"IT'S A TRAP!\" But Mahabali? Already pouring the water. Already committed. Impeccable vibes, terrible consequences.",
    funFact: "🚨 Shukracharya literally turned himself into a plug inside the water pot to stop the deal. Vamanan poked his eye with a blade of grass. That's 3000 BC negotiation tactics for you.",
    sprite: 'interesting',
  },
  {
    id: 4,
    emoji: '🌌',
    title: 'Step One: Earth. Step Two: Heaven. Uh Oh.',
    body: "Vamanan started growing. And growing. AND GROWING. Step one: the entire earth — clouds squished, mountains were basically ankle dust. Step two: all of the heavens. Indra immediately updated his LinkedIn status to \"re-employed.\" The gods watched from the sidelines eating popcorn.",
    funFact: "📏 Scientists estimate Vamanan grew to a height that made the observable universe look like a bonsai. This is not peer-reviewed.",
    sprite: 'surprized',
  },
  {
    id: 5,
    emoji: '😬',
    title: 'Step Three Goes... WHERE Exactly?',
    body: "Cosmic Vamanan looked down at now-microscopic Mahabali with the energy of a divine debt collector and asked where step three goes. Mahabali — the most graceful loser in mythology — bowed and offered his own head. One part surrender, one part absolute class.",
    funFact: "🙏 Mahabali's inner monologue: \"Did I just donate my head? I donated my head. Shukracharya is NEVER going to let me live this down. Wait — I won't be living at all. Anyway.\"",
    sprite: 'wow',
  },
  {
    id: 6,
    emoji: '🌸',
    title: 'The Most Wholesome Ending in Mythology',
    body: "Vishnu, deeply impressed by Mahabali's integrity and frankly unhinged generosity, made him immortal ruler of Patala AND gave him visiting rights to Earth every year. That annual visit? That's Onam. Kerala goes absolutely wild with flower carpets, 26-dish feasts, and boat races to welcome him back.",
    funFact: "🎊 Onam is basically the whole state saying: \"Welcome back, king! We made you a giant pookalam and a sadya. Please leave Vishnu at home this time.\"",
    sprite: 'idle',
  },
];

export const StoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [, setTick] = useState(0);
  const targetMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [activeChapter, setActiveChapter] = useState(0);

  const spriteMap: Record<string, string> = {
    idle: idleImg,
    curious: curiousImg,
    interesting: interestingImg,
    surprized: surprizedImg,
    wow: wowImg,
  };

  useEffect(() => {
    let rafId: number;
    const onResize = () => setIsMobile(window.innerWidth < 768);
    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth: W, innerHeight: H } = window;
      targetMouse.current = {
        x: Math.max(-1, Math.min(1, (e.clientX - W / 2) / (W / 2))),
        y: Math.max(-1, Math.min(1, (e.clientY - H / 2) / (H / 2))),
      };
    };
    const animate = () => {
      const lf = 0.08;
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * lf;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * lf;
      setTick(t => (t + 1) % 1000);
      rafId = requestAnimationFrame(animate);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    rafId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const mx = currentMouse.current.x;
  const my = currentMouse.current.y;

  const currentSprite = spriteMap[CHAPTERS[activeChapter].sprite];

  return (
    <div
      className="relative w-screen overflow-hidden bg-slate-950 select-none"
      style={{ height: '100dvh', animation: 'chatPageZoomIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both' }}
    >
      {PARALLAX_LAYERS.map(layer => {
        const tx = mx * layer.factorX;
        const ty = my * layer.factorY + (layer.baseOffsetY || 0);
        const isNum = typeof layer.id === 'number';
        const scaleClass = isMobile && isNum ? 'scale-[2.2]' : layer.scale;
        const objPos = isMobile && isNum ? 'object-top' : (layer.objectPos || 'object-center');
        return (
          <div
            key={layer.id}
            className={`absolute inset-0 w-full h-full flex pointer-events-none items-center justify-center origin-center ${scaleClass}`}
            style={{ zIndex: layer.zIndex, transform: `translate3d(${tx}px, ${ty}px, 0)`, willChange: 'transform' }}
          >
            <img
              src={layer.src} alt={layer.alt}
              className={`w-full h-full pointer-events-none object-cover ${objPos} ${layer.filterClass || ''}`}
            />
          </div>
        );
      })}

      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{ zIndex: 10, background: 'linear-gradient(to bottom, transparent 0%, #B6ECFF 100%)' }}
      />

      <img
        src={patternImg} alt="Pattern" draggable={false}
        className="absolute top-0 left-0 pointer-events-none select-none"
        style={{ zIndex: 20, mixBlendMode: 'overlay', width: '160px', height: 'auto', opacity: 0.4 }}
      />

      <div className="absolute top-5 left-4 md:top-12 md:left-12 z-30 select-none flex flex-col">
        <button
          onClick={() => navigate('/')}
          className="text-left pointer-events-auto cursor-pointer bg-transparent border-none p-0 m-0"
          aria-label="Go to home"
        >
          <h1 className="font-['AwesomeSerif',serif] text-[clamp(1.2rem,5vw,1.6rem)] md:text-[clamp(1.2rem,3vw,2rem)] whitespace-nowrap m-0 leading-none">
            VamananGPT
          </h1>
          <p className="uppercase mt-1 ml-[6px] font-['Geist',sans-serif] font-medium text-[#A8A8A8] text-[0.7rem] md:text-[0.8rem] tracking-tight m-0">
            BY KRISHNAVYSHAK
          </p>
        </button>
      </div>

      {!isMobile && (
        <div
          className="absolute left-12 z-20 pointer-events-none select-none"
          style={{ bottom: '-20px', width: 'clamp(230px, 34vw, 450px)', position: 'absolute' }}
        >
          <img src={currentSprite} alt="" aria-hidden draggable={false} className="w-full h-auto invisible" />
          {Object.entries(spriteMap).map(([key, src]) => (
            <img
              key={key}
              src={src}
              alt={key}
              draggable={false}
              className="absolute inset-0 w-full h-auto drop-shadow-[3px_4px_22px_rgba(0,0,0,0.25)]"
              style={{
                opacity: CHAPTERS[activeChapter].sprite === key ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
              }}
            />
          ))}
        </div>
      )}

      <div
        className="absolute rounded-[2rem] flex flex-col"
        style={{
          top: isMobile ? '3.5rem' : '4.5rem',
          bottom: isMobile ? '1rem' : '4.5rem',
          right: isMobile ? '0.75rem' : '4.5rem',
          left: isMobile ? '0.75rem' : 'clamp(280px, 32vw, 450px)',
          zIndex: 15,
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          boxShadow: '0px 84px 72px -68px rgba(0, 0, 0, 0.12)',
        }}
      >
        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none"
          style={{
            padding: '1.6px',
            background: 'radial-gradient(circle at top, #EFFAFF 0%, rgba(0, 179, 220, 0.15) 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        <div
          className="flex-1 overflow-hidden rounded-[calc(2rem-10px)] z-10 flex flex-col"
          style={{
            margin: isMobile ? '10px' : '14px',
            backgroundColor: '#f5fbf7',
            border: '1px solid transparent',
            backgroundImage: 'linear-gradient(#f5fbf7, #f5fbf7), linear-gradient(to bottom, #E9E9E9, #E7E7E7)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">

            <div className="text-center pt-2 pb-1">
              <p
                className="font-['Geist',sans-serif] font-medium tracking-widest uppercase text-[0.68rem] mb-2"
                style={{ color: '#A3A8CF' }}
              >
                ✨ The Greatest Story Ever Shrunk
              </p>
              <h2
                className="font-['AwesomeSerif',serif] m-0 leading-tight"
                style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', color: '#1e293b' }}
              >
                Vamanan &amp; Mahabali
              </h2>
              <p
                className="font-['Geist',sans-serif] mt-2 mb-0 mx-auto"
                style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.92rem)', color: '#64748b', maxWidth: '480px', lineHeight: 1.6 }}
              >
                A tale of cosmic real-estate, divine shapeshifting, and a king who should have read the fine print. 📜
              </p>
              <div className="mx-auto mt-4 mb-1" style={{ width: '60px', height: '1.5px', background: 'linear-gradient(90deg, transparent, #00C3FF88, transparent)', borderRadius: '1px' }} />
            </div>

            {CHAPTERS.map((chapter, i) => {
              const isActive = activeChapter === i;
              return (
                <div
                  key={chapter.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveChapter(i)}
                  onKeyDown={e => e.key === 'Enter' && setActiveChapter(i)}
                  className="rounded-2xl cursor-pointer transition-all duration-300"
                  style={{
                    border: isActive ? '1.5px solid rgba(0,195,255,0.5)' : '1px solid #E9E9E9',
                    background: isActive
                      ? 'linear-gradient(135deg, #EEF9FF 0%, #F0FFF8 100%)'
                      : '#FAFCFF',
                    boxShadow: isActive
                      ? '0 4px 20px rgba(0,195,255,0.12), inset 0 1px 3px rgba(0,195,255,0.08)'
                      : '0 1px 4px rgba(0,0,0,0.04)',
                    padding: '18px 20px',
                    transform: isActive ? 'scale(1.01)' : 'scale(1)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="font-['Geist',sans-serif] font-semibold text-[0.65rem] uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                      style={{
                        background: isActive ? 'rgba(0,195,255,0.12)' : '#F0F0F0',
                        color: isActive ? '#008BC4' : '#94a3b8',
                        border: isActive ? '1px solid rgba(0,195,255,0.25)' : '1px solid #E4E4E4',
                      }}
                    >
                      Ch. {chapter.id}
                    </span>
                    <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{chapter.emoji}</span>
                    <h3
                      className="font-['AwesomeSerif',serif] m-0 leading-snug"
                      style={{
                        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                        color: isActive ? '#0f172a' : '#334155',
                      }}
                    >
                      {chapter.title}
                    </h3>
                  </div>

                  <div
                    style={{
                      maxHeight: isActive ? '500px' : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  >
                    <p
                      className="font-['Geist',sans-serif] leading-relaxed mt-3 mb-0"
                      style={{ fontSize: 'clamp(0.85rem, 1.5vw, 0.97rem)', color: '#475569' }}
                    >
                      {chapter.body}
                    </p>

                    <div
                      className="mt-3 rounded-xl px-4 py-3"
                      style={{
                        background: 'rgba(0,195,255,0.06)',
                        border: '1px solid rgba(0,195,255,0.18)',
                        fontSize: 'clamp(0.78rem, 1.3vw, 0.88rem)',
                        color: '#008BC4',
                        fontFamily: "'Geist', sans-serif",
                        lineHeight: 1.65,
                        fontStyle: 'italic',
                      }}
                    >
                      {chapter.funFact}
                    </div>
                  </div>

                  {!isActive && (
                    <p
                      className="font-['Geist',sans-serif] m-0 mt-1"
                      style={{
                        fontSize: 'clamp(0.78rem, 1.3vw, 0.87rem)',
                        color: '#94a3b8',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {chapter.body.slice(0, 80)}…
                    </p>
                  )}
                </div>
              );
            })}

            <div
              className="rounded-2xl text-center py-6 px-5 mt-1 mb-2"
              style={{
                background: 'linear-gradient(135deg, #EEF9FF, #F5FFF8)',
                border: '1px solid rgba(0,195,255,0.2)',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🌺</div>
              <h3
                className="font-['AwesomeSerif',serif] m-0 mb-2"
                style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: '#1e293b' }}
              >
                And they all lived cosmically ever after
              </h3>
              <p
                className="font-['Geist',sans-serif] mx-auto mb-4"
                style={{
                  fontSize: 'clamp(0.8rem, 1.4vw, 0.9rem)',
                  color: '#64748b',
                  lineHeight: 1.65,
                  maxWidth: '420px',
                  margin: '0 auto 16px',
                }}
              >
                Mahabali rules Patala wisely. Vishnu updated his WhatsApp status to "out of office."
                Kerala gets the best harvest festival in the universe.{' '}
                <span style={{ color: '#008BC4' }}>Everyone wins.</span>
              </p>
              <button
                onClick={() => navigate('/')}
                className="font-['Geist',sans-serif] font-semibold text-white rounded-2xl px-6 py-2.5 cursor-pointer border-none transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #00C3FF, #0082C8)',
                  boxShadow: '0px 2px 6px rgba(0,150,220,0.3), inset 0px 1.5px 3px rgba(255,255,255,0.25)',
                  fontSize: 'clamp(0.82rem, 1.4vw, 0.92rem)',
                }}
              >
                ← Return to Vaikunta
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes chatPageZoomIn {
          0%   { opacity: 0; transform: scale(0.96); filter: blur(12px); }
          60%  { filter: blur(0px); }
          100% { opacity: 1; transform: scale(1);    filter: blur(0px); }
        }
      `}</style>
    </div>
  );
};

export default StoryPage;
