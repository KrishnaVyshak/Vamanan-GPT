import React, { useEffect, useRef, useState } from 'react';
import { usePageTransition } from '../App';

import layer0 from '../assets/layers/0.png';
import layer1 from '../assets/layers/1.png';
import layer2 from '../assets/layers/2.png';
import layer3 from '../assets/layers/3.png';
import layer4 from '../assets/layers/4.png';
import characterNoEyeImg from '../assets/images/character-no-eye.png';
import characterImg from '../assets/images/character.png';
import poleImg from '../assets/images/pole.png';
import boardImg from '../assets/images/board.png';
import eyeImg from '../assets/images/eye.png';
import storyImg from '../assets/images/story.png';
import chatImg from '../assets/images/chat.png';
import cloud2Img from '../assets/images/cloud2.png';
import patternImg from '../assets/images/pattern.png';
import { HeroLoader } from './HeroLoader';

const HERO_IMAGES = [
  layer0,
  layer1,
  layer2,
  layer3,
  layer4,
  characterNoEyeImg,
  characterImg,
  poleImg,
  boardImg,
  eyeImg,
  storyImg,
  chatImg,
  cloud2Img,
  patternImg,
];

interface LayerConfig {
  id: number | string;
  src: string;
  alt: string;
  label?: string;
  factorX: number;
  factorY: number;
  scale: string;
  zIndex: number;
  baseOffsetXPercent?: number;
  baseOffsetY?: number;
  objectPos?: string;
  imgFit?: string;
  containerAlign?: string;
  transformOrigin?: string;
  filterClass?: string;
}

const LAYERS: LayerConfig[] = [
  {
    id: 0,
    src: layer0,
    alt: 'Layer 0 (Sky)',
    factorX: 2,
    factorY: 1.5,
    scale: 'scale-[1.01]',
    zIndex: 1,
  },
  {
    id: 4,
    src: layer4,
    alt: 'Layer 4 (Last Layer)',
    factorX: 6,
    factorY: 4,
    scale: 'scale-[1.03]',
    zIndex: 2,
  },
  {
    id: 3,
    src: layer3,
    alt: 'Layer 3',
    factorX: 14,
    factorY: 9,
    scale: 'scale-[1.05]',
    zIndex: 3,
  },
  {
    id: 2,
    src: layer2,
    alt: 'Layer 2',
    factorX: 20 ,
    factorY: 13,
    scale: 'scale-[1.07]',
    zIndex: 4,
  },
  {
    id: 'board',
    src: poleImg,
    alt: 'Board',
    label: 'Board',
    factorX: 6,
    factorY: 6,
    scale: 'scale-[0.45]',
    zIndex: 5,
    baseOffsetXPercent: -38,

    baseOffsetY: 0,
    objectPos: 'object-bottom',
    imgFit: 'object-contain',
    containerAlign: 'items-end justify-center',
    transformOrigin: 'origin-bottom',
  },
  {
    id: 'character',
    src: characterNoEyeImg,
    alt: 'Character',
    label: 'Character',
    factorX: 6,
    factorY: 6,
    scale: 'scale-[0.94]',
    zIndex: 5,
    baseOffsetXPercent: 26,
    baseOffsetY: 40,
    objectPos: 'object-bottom',
    imgFit: 'object-contain',
    containerAlign: 'items-end justify-center',
  },
  {
    id: 1,
    src: layer1,
    alt: 'Layer 1 (Foremost Layer)',
    factorX: 30,
    factorY: 10,
    scale: 'scale-[1.12]',
    zIndex: 6,
    baseOffsetY: 20,
    objectPos: 'object-bottom',
    filterClass: 'blur-[1px]',
  },
];

const EYE_LEFT_PERCENT  = { x: 25.28, y: 31.4 };
const EYE_RIGHT_PERCENT = { x: 38.6, y: 30.3 };

export const Hero: React.FC = () => {
  const { navigateWithTransition, isExiting } = usePageTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const charNaturalSize = useRef<{ w: number; h: number } | null>(null);

  const targetMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [, setTick] = useState(0);
  const [storyHovered, setStoryHovered] = useState(false);
  const [chatHovered, setChatHovered] = useState(false);

  const [loadedImageCount, setLoadedImageCount] = useState(0);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let count = 0;
    const total = HERO_IMAGES.length;

    const fallbackTimer = setTimeout(() => {
      if (isMounted) {
        setLoadedImageCount(total);
        setIsImagesLoaded(true);
      }
    }, 6000);

    HERO_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;

      const handleLoad = () => {
        if (!isMounted) return;
        count++;
        setLoadedImageCount(count);

        if (src === characterNoEyeImg && img.naturalWidth && img.naturalHeight) {
          charNaturalSize.current = { w: img.naturalWidth, h: img.naturalHeight };
        }

        if (count >= total) {
          clearTimeout(fallbackTimer);
          setTimeout(() => {
            if (isMounted) setIsImagesLoaded(true);
          }, 200);
        }
      };

      if (img.complete) {
        handleLoad();
      } else {
        img.onload = handleLoad;
        img.onerror = handleLoad;
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;

      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);

      targetMouse.current = {
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      };
    };

    const handleMouseLeave = () => { };

    const animate = () => {
      const lerpFactor = 0.08;

      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * lerpFactor;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * lerpFactor;

      setTick((t) => (t + 1) % 1000);
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const mouseX = currentMouse.current.x;
  const mouseY = currentMouse.current.y;

  return (
    <div
      ref={containerRef}
      className="relative w-screen overflow-hidden bg-slate-950 select-none"
      style={{
        height: isMobile ? '100dvh' : '100vh',
        animation: isExiting ? 'heroZoomBlurOut 0.6s cubic-bezier(0.4, 0, 1, 1) forwards' : undefined,
      }}
    >
      <HeroLoader
        progress={(loadedImageCount / HERO_IMAGES.length) * 100}
        isDone={isImagesLoaded}
      />

      {LAYERS.map((layer) => {
        if (isMobile && layer.id === 'board') return null;

        const basePxX = layer.baseOffsetXPercent ? (window.innerWidth * (layer.baseOffsetXPercent / 100)) : 0;
        const translateX = mouseX * layer.factorX + basePxX;
        const translateY = mouseY * layer.factorY + (layer.baseOffsetY || 0);

        const src = (isMobile && layer.id === 'character') ? characterImg : layer.src;

        const isBackgroundLayer = typeof layer.id === 'number';

        const scaleClass = (isMobile && isBackgroundLayer) ? 'scale-[2.2]' : layer.scale;
        const objectPosClass = (isMobile && isBackgroundLayer) ? 'object-top' : (layer.objectPos || 'object-center');

        const isCharacterLayer = layer.id === 'character';

        return (
          <div
            key={layer.id}
            className={`absolute inset-0 w-full h-full flex pointer-events-none ${layer.containerAlign || 'items-center justify-center'} ${layer.transformOrigin || 'origin-center'} ${scaleClass}`}
            style={{
              zIndex: layer.zIndex,
              transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
              willChange: 'transform',
            }}
          >
            <img
              src={src}
              alt={layer.alt}
              onLoad={isCharacterLayer && !isMobile ? (e) => {
                const img = e.currentTarget;
                charNaturalSize.current = { w: img.naturalWidth, h: img.naturalHeight };
              } : undefined}
              className={`w-full h-full pointer-events-none ${layer.imgFit || 'object-cover'} ${objectPosClass} ${layer.filterClass || ''}`}
            />
          </div>
        );
      })}

      {!isMobile && charNaturalSize.current && (() => {
        const { w: naturalW, h: naturalH } = charNaturalSize.current!;
        const W = window.innerWidth;
        const H = window.innerHeight;

        const CHAR_FACTOR_X   = 6;
        const CHAR_FACTOR_Y   = 6;
        const CHAR_BASE_X_PCT = 26;
        const CHAR_BASE_Y     = 40;

        const containScale = Math.min(W / naturalW, H / naturalH);
        const renderedW    = naturalW * containScale;
        const renderedH    = naturalH * containScale;

        const offsetX = (W - renderedW) / 2;
        const offsetY = H - renderedH;

        const baseImgLeft = W * (CHAR_BASE_X_PCT / 100) + offsetX;
        const baseImgTop  = CHAR_BASE_Y + offsetY;

        const maxShift = renderedW * 0.0089;
        const totalShiftX = mouseX * CHAR_FACTOR_X + mouseX * maxShift;
        const totalShiftY = mouseY * CHAR_FACTOR_Y + mouseY * maxShift;

        const eyeScale = containScale;

        return [EYE_LEFT_PERCENT, EYE_RIGHT_PERCENT].map((eyePct, idx) => {
          const staticLeft = baseImgLeft + renderedW * (eyePct.x / 100);
          const staticTop  = baseImgTop  + renderedH * (eyePct.y / 100);

          return (
            <div
              key={idx}
              className="absolute pointer-events-none"
              style={{
                left: `${staticLeft}px`,
                top:  `${staticTop}px`,
                zIndex: 10,
                transform: `translate(calc(-50% + ${totalShiftX}px), calc(-50% + ${totalShiftY}px)) scale(${eyeScale})`,
                transformOrigin: 'center center',
                willChange: 'transform',
              }}
            >
              <img
                src={eyeImg}
                alt="Eye"
                className="w-auto h-auto pointer-events-none select-none"
                draggable={false}
              />
            </div>
          );
        });
      })()}

      {!isMobile && (
        <div
          className="absolute"
          style={{
            left: '25.6vw',
            top: '71vh',
            zIndex: 8,
            transform: `translate(calc(-50% + ${mouseX * 3}px), calc(-50% + ${mouseY * 3}px)) scale(${storyHovered ? 0.96 : 0.80})`,
            transformOrigin: 'right center',
            transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            willChange: 'transform',
            cursor: 'pointer',
          }}
          onMouseEnter={() => setStoryHovered(true)}
          onMouseLeave={() => setStoryHovered(false)}
          onClick={() => navigateWithTransition('/story')}
        >
          <img
            src={storyImg}
            alt="Story"
            className="select-none"
            style={{ width: '13.3vw', height: 'auto' }}
            draggable={false}
          />
        </div>
      )}

      {!isMobile && (
        <div
          className="absolute"
          style={{
            left: '40.9vw',
            top: '71vh',
            zIndex: 8,
            transform: `translate(calc(-50% + ${mouseX * 3}px), calc(-50% + ${mouseY * 3}px)) scale(${chatHovered ? 0.96 : 0.80})`,
            transformOrigin: 'left center',
            transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            willChange: 'transform',
            cursor: 'pointer',
          }}
          onMouseEnter={() => setChatHovered(true)}
          onMouseLeave={() => setChatHovered(false)}
          onClick={() => navigateWithTransition('/chat')}
        >
          <img
            src={chatImg}
            alt="Chat"
            className="select-none"
            style={{ width: '13.3vw', height: 'auto' }}
            draggable={false}
          />
        </div>
      )}

      {isMobile && (
        <div
          className="absolute"
          style={{
            bottom: '0',
            left: '42%',
            transform: 'translateX(-50%)',
            zIndex: 9,
            width: '110%',
            maxWidth: '420px',
            pointerEvents: 'none',
          }}
        >
          <img
            src={boardImg}
            alt="Board"
            className="w-full h-auto select-none"
            draggable={false}
          />

          <div
            style={{
              position: 'absolute',
              top: '5%',
              left: '0%',
              width: '46%',
              height: '45%',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
            onClick={() => navigateWithTransition('/story')}
            aria-label="Go to Story"
            role="button"
          />

          <div
            style={{
              position: 'absolute',
              top: '5%',
              right: '0%',
              width: '46%',
              height: '45%',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
            onClick={() => navigateWithTransition('/chat')}
            aria-label="Go to Chat"
            role="button"
          />
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '26%',
          transform: 'translate(-50%, -50%)',
          zIndex: 7,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <h1
          className='tracking-tighter'
          style={{
            fontFamily: "'AwesomeSerif', serif",
            fontSize: isMobile ? 'clamp(2rem, 6vw, 6rem)' : 'clamp(1.4rem, 4vw, 4rem)',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            pointerEvents: 'none',
            margin: 0,
            lineHeight: 1,
            letterSpacing: '0.02em',
          }}
        >
          VamananGPT
        </h1>

        <img
          src={cloud2Img}
          alt="Cloud"
          draggable={false}
          style={{
            position: 'absolute',
            right: '-18px',
            bottom: '-12px',
            width: 'clamp(60px, 7vw, 96px)',
            height: 'auto',
            zIndex: 8,
            pointerEvents: 'none',
            animation: 'cloud2Float 6s ease-in-out infinite',
            willChange: 'transform',
            scale: 1.4
          }}
        />
      </div>

      <style>{`
        @keyframes cloud2Float {
          0%   { transform: translate(0px,  0px); }
          25%  { transform: translate(2px,  -4px); }
          50%  { transform: translate(4px,  -6px); }
          75%  { transform: translate(2px,  -4px); }
          100% { transform: translate(0px,  0px); }
        }
        @keyframes heroZoomBlurOut {
          0%   { opacity: 1; transform: scale(1);    filter: blur(0px); }
          100% { opacity: 0; transform: scale(1.08); filter: blur(18px); }
        }
      `}</style>

      <img
        src={patternImg}
        alt="Pattern"
        draggable={false}
        className="absolute top-0 left-0 pointer-events-none select-none"
        style={{
          zIndex: 20,
          mixBlendMode: 'overlay',
          width: '190px',
          height: 'auto',
          opacity: 0.4,
        }}
      />
    </div>
  );
};

export default Hero;
