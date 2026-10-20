import { useEffect, useRef } from 'react';
import { gsap } from '../animations/gsapSetup';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  targetAlpha: number;
  vy: number;
  vx: number;
  swaySpeed: number;
  swayOffset: number;
  life: number;
  maxLife: number;
}

interface EmberCanvasProps {
  className?: string;
  density?: number;
}

export default function EmberCanvas({ className = '', density = 45 }: EmberCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(212, 149, 106, ', // copper-light
      'rgba(184, 115, 51, ',  // copper
      'rgba(245, 240, 232, ', // cream
      'rgba(224, 213, 197, ', // cream-dark
      'rgba(235, 120, 60, ',  // warm fire ember
    ];

    const createParticle = (): Particle => {
      const maxLife = 180 + Math.random() * 240;
      return {
        x: Math.random() * width,
        y: height + Math.random() * 80,
        radius: Math.random() * 2.2 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0,
        targetAlpha: 0.25 + Math.random() * 0.55,
        vy: -(0.5 + Math.random() * 1.2),
        vx: (Math.random() - 0.5) * 0.4,
        swaySpeed: 0.015 + Math.random() * 0.03,
        swayOffset: Math.random() * Math.PI * 2,
        life: 0,
        maxLife,
      };
    };

    const particles: Particle[] = Array.from({ length: density }, () => {
      const p = createParticle();
      p.y = Math.random() * height; // distribute initially across screen
      p.life = Math.random() * p.maxLife;
      return p;
    });

    let frame = 0;

    const updateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      frame++;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;

        // Sway motion
        p.x += Math.sin(frame * p.swaySpeed + p.swayOffset) * 0.5 + p.vx;
        p.y += p.vy;

        // Fade in and out
        const halfLife = p.maxLife / 2;
        if (p.life < halfLife) {
          p.alpha = (p.life / halfLife) * p.targetAlpha;
        } else {
          p.alpha = ((p.maxLife - p.life) / halfLife) * p.targetAlpha;
        }

        // Render glowing particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, p.alpha)})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(184, 115, 51, 0.4)';
        ctx.fill();

        // Respawn when dead or off screen
        if (p.life >= p.maxLife || p.y < -20 || p.x < -20 || p.x > width + 20) {
          particles[i] = createParticle();
        }
      }
    };

    // Use GSAP ticker for 60fps frame synchronization
    gsap.ticker.add(updateParticles);

    return () => {
      gsap.ticker.remove(updateParticles);
      window.removeEventListener('resize', handleResize);
    };
  }, [density, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-10 ${className}`}
      aria-hidden="true"
    />
  );
}
