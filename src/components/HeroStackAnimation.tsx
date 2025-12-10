"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface HeroStackAnimationProps {
  images: string[];
}

interface ImageState {
  src: string;
  id: number;
  startX: number;
  startY: number;
  startRotation: number;
  stackX: number;
  stackY: number;
  stackRotation: number;
  explodeX: number;
  explodeY: number;
  explodeRotation: number;
  explodeScale: number;
  delay: number;
}

type AnimationPhase = 'stacking' | 'stacked' | 'exploding' | 'gallery' | 'fading';

export default function HeroStackAnimation({ images }: HeroStackAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageStates, setImageStates] = useState<ImageState[]>([]);
  const [phase, setPhase] = useState<AnimationPhase>('stacking');
  const [landedCount, setLandedCount] = useState(0);
  const [cycle, setCycle] = useState(0);

  // Gallery explosion positions - spread around the hero
  const getExplodePosition = (index: number, total: number) => {
    // Create positions that spread images around without blocking center too much
    const positions = [
      { x: -45, y: -35, rotation: -15, scale: 0.85 },  // top-left
      { x: 45, y: -30, rotation: 12, scale: 0.9 },     // top-right
      { x: -55, y: 25, rotation: -8, scale: 0.88 },    // left
      { x: 55, y: 20, rotation: 10, scale: 0.85 },     // right
      { x: -35, y: 45, rotation: -12, scale: 0.82 },   // bottom-left
      { x: 40, y: 50, rotation: 15, scale: 0.8 },      // bottom-right
      { x: 0, y: -50, rotation: 5, scale: 0.9 },       // top-center
      { x: -65, y: -5, rotation: -18, scale: 0.78 },   // far-left
    ];
    
    return positions[index % positions.length];
  };

  // Initialize animation states
  useEffect(() => {
    if (images.length === 0) return;

    const initializeAnimation = () => {
      // Shuffle images for this cycle
      const shuffled = [...images].sort(() => Math.random() - 0.5);
      const numImages = Math.min(shuffled.length, 8);
      
      const states: ImageState[] = shuffled.slice(0, numImages).map((src, index) => {
        // Random starting position outside viewport
        const side = Math.floor(Math.random() * 4);
        let startX = 0, startY = 0;
        
        switch (side) {
          case 0: // top
            startX = (Math.random() - 0.5) * 150;
            startY = -120 - Math.random() * 80;
            break;
          case 1: // right
            startX = 120 + Math.random() * 80;
            startY = (Math.random() - 0.5) * 150;
            break;
          case 2: // bottom
            startX = (Math.random() - 0.5) * 150;
            startY = 120 + Math.random() * 80;
            break;
          case 3: // left
            startX = -120 - Math.random() * 80;
            startY = (Math.random() - 0.5) * 150;
            break;
        }

        // Starting rotation
        const startRotation = (Math.random() - 0.5) * 45;
        
        // Stack position - offset slightly up and left so logo peeks through
        const stackOffset = index * 4;
        const stackX = (Math.random() - 0.5) * 15 + stackOffset * 0.8;
        const stackY = (Math.random() - 0.5) * 10 - stackOffset * 1.2 - 15; // Offset up
        const stackRotation = (Math.random() - 0.5) * 10;

        // Explode/gallery position
        const explodePos = getExplodePosition(index, numImages);

        return {
          src,
          id: index,
          startX,
          startY,
          startRotation,
          stackX,
          stackY,
          stackRotation,
          explodeX: explodePos.x,
          explodeY: explodePos.y,
          explodeRotation: explodePos.rotation,
          explodeScale: explodePos.scale,
          delay: index * 350, // Stagger delay
        };
      });

      setImageStates(states);
      setPhase('stacking');
      setLandedCount(0);
    };

    initializeAnimation();
  }, [images, cycle]);

  // Handle phase transitions
  useEffect(() => {
    if (imageStates.length === 0) return;

    // Track when each image lands
    imageStates.forEach((state, index) => {
      setTimeout(() => {
        setLandedCount(prev => prev + 1);
      }, state.delay + 700);
    });
  }, [imageStates]);

  // Phase transitions based on landed count
  useEffect(() => {
    if (landedCount === imageStates.length && imageStates.length > 0 && phase === 'stacking') {
      // All images landed, hold briefly then explode
      setTimeout(() => {
        setPhase('stacked');
      }, 300);
    }
  }, [landedCount, imageStates.length, phase]);

  useEffect(() => {
    if (phase === 'stacked') {
      // Brief hold, then explode
      setTimeout(() => {
        setPhase('exploding');
      }, 800);
    } else if (phase === 'exploding') {
      // After explosion animation, enter gallery mode
      setTimeout(() => {
        setPhase('gallery');
      }, 600);
    } else if (phase === 'gallery') {
      // Hold gallery view, then fade and restart
      setTimeout(() => {
        setPhase('fading');
      }, 4000);
    } else if (phase === 'fading') {
      // After fade, start new cycle
      setTimeout(() => {
        setCycle(c => c + 1);
      }, 800);
    }
  }, [phase]);

  return (
    <div ref={containerRef} className="hero-stack-container">
      <div className={`hero-stack-images phase-${phase}`}>
        {imageStates.map((state, index) => (
          <div
            key={`${state.id}-${cycle}`}
            className={`hero-stack-image`}
            style={{
              '--start-x': `${state.startX}%`,
              '--start-y': `${state.startY}%`,
              '--start-rotation': `${state.startRotation}deg`,
              '--stack-x': `${state.stackX}px`,
              '--stack-y': `${state.stackY}px`,
              '--stack-rotation': `${state.stackRotation}deg`,
              '--explode-x': `${state.explodeX}%`,
              '--explode-y': `${state.explodeY}%`,
              '--explode-rotation': `${state.explodeRotation}deg`,
              '--explode-scale': state.explodeScale,
              '--delay': `${state.delay}ms`,
              '--z-index': index + 1, // Later images on TOP
            } as React.CSSProperties}
          >
            <img src={state.src} alt="" loading="eager" />
          </div>
        ))}
      </div>
    </div>
  );
}
