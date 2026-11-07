import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedY: number;
  speedX: number;
  alpha: number;
  maxAlpha: number;
  alphaSpeed: number;
  swaySpeed: number;
  swayOffset: number;
}

interface GoldenParticlesProps {
  density?: 'low' | 'normal' | 'high';
  className?: string;
}

export const GoldenParticles: React.FC<GoldenParticlesProps> = ({
  density = 'normal',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount =
      density === 'low' ? 25 : density === 'high' ? 70 : 45;

    const colors = [
      'rgba(255, 244, 204, ', // Soft Warm Cream
      'rgba(233, 189, 98, ',  // Light Gold
      'rgba(212, 166, 76, ',  // Primary Gold
      'rgba(233, 120, 50, ',  // Warm Saffron
    ];

    const particles: Particle[] = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: -(Math.random() * 0.4 + 0.15),
      speedX: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.5,
      maxAlpha: Math.random() * 0.4 + 0.3,
      alphaSpeed: Math.random() * 0.008 + 0.003,
      swaySpeed: Math.random() * 0.015 + 0.005,
      swayOffset: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Update positions with gentle drifting sway
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time * p.swaySpeed + p.swayOffset) * 0.35;

        // Pulsing glow
        p.alpha += p.alphaSpeed;
        if (p.alpha > p.maxAlpha || p.alpha < 0.05) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        // Wrap around screen
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw particle with gentle aura
        const safeAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${safeAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(233, 189, 98, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 opacity-80 ${className}`}
      aria-hidden="true"
    />
  );
};
