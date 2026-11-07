// Particle physics engine for authentic Diwali cracker visual effects

export type CrackerType = 'sparkler' | 'anar' | 'chakri' | 'rocket' | 'bomb' | 'ladi';

export interface CrackerParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
  gravity: number;
  friction: number;
  sparkle?: boolean;
}

export class CrackerRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: CrackerParticle[] = [];
  private animId: number | null = null;
  private activeEmitters: (() => boolean)[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.loop = this.loop.bind(this);
    this.start();
  }

  public resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  public start() {
    if (!this.animId) {
      this.animId = requestAnimationFrame(this.loop);
    }
  }

  public stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  private loop() {
    const hasContent = this.particles.length > 0 || this.activeEmitters.length > 0;

    if (hasContent) {
      // Semi-transparent fill for particle trail/afterglow effect
      this.ctx.fillStyle = 'rgba(17, 16, 15, 0.22)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      // No particles — fully clear the canvas so it's transparent
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Update ongoing continuous emitters
    this.activeEmitters = this.activeEmitters.filter((emitter) => emitter());

    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = p.sparkle ? 10 : 4;
      this.ctx.shadowColor = p.color;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    this.animId = requestAnimationFrame(this.loop);
  }

  // 1. Phooljhadi (Sparkler)
  public igniteSparkler(originX?: number, originY?: number) {
    const cx = originX || this.canvas.width / 2;
    const cy = originY || this.canvas.height / 2;
    let frames = 0;
    const maxFrames = 140; // ~2.3 seconds

    this.activeEmitters.push(() => {
      frames++;
      if (frames > maxFrames) return false;

      // Emit continuous sparks
      for (let i = 0; i < 9; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1.5;
        const colors = ['#FFF4CC', '#E9BD62', '#FFFFFF', '#E97832', '#FFE58F'];
        this.particles.push({
          x: cx + (Math.random() - 0.5) * 8,
          y: cy + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.4,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2.5 + 1,
          alpha: 1,
          decay: Math.random() * 0.04 + 0.02,
          gravity: 0.12,
          friction: 0.96,
          sparkle: true,
        });
      }
      return true;
    });
  }

  // 2. Anar (Flower Pot) - Towering fountain of fire!
  public igniteAnar(originX?: number, originY?: number) {
    const cx = originX || this.canvas.width / 2;
    const cy = originY || this.canvas.height * 0.85;
    let frames = 0;
    const maxFrames = 180; // ~3 seconds

    this.activeEmitters.push(() => {
      frames++;
      if (frames > maxFrames) return false;

      // Intensity peaks around frame 60-120
      const intensity = frames < 50 ? frames / 50 : frames > 140 ? (180 - frames) / 40 : 1.2;
      const spawnCount = Math.floor(14 * intensity);

      for (let i = 0; i < spawnCount; i++) {
        const spreadAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.55;
        const speed = (Math.random() * 12 + 10) * intensity;
        const colors = ['#FFF6D6', '#E9BD62', '#E97832', '#D4A64C', '#FFFFFF', '#FF4D4F'];

        this.particles.push({
          x: cx + (Math.random() - 0.5) * 12,
          y: cy,
          vx: Math.cos(spreadAngle) * speed,
          vy: Math.sin(spreadAngle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3 + 1.5,
          alpha: 1,
          decay: Math.random() * 0.025 + 0.015,
          gravity: 0.38,
          friction: 0.98,
          sparkle: true,
        });
      }
      return true;
    });
  }

  // 3. Chakri (Ground Spinner) - High velocity spinning vortex
  public igniteChakri(originX?: number, originY?: number) {
    const cx = originX || this.canvas.width / 2;
    const cy = originY || this.canvas.height * 0.72;
    let frames = 0;
    let currentAngle = 0;
    const maxFrames = 160;

    this.activeEmitters.push(() => {
      frames++;
      if (frames > maxFrames) return false;

      currentAngle += 0.35; // Spin speed

      // 4 arms of spiral sparks
      for (let arm = 0; arm < 4; arm++) {
        const armAngle = currentAngle + (arm * Math.PI) / 2;
        const speed = Math.random() * 7 + 4;
        const colors = ['#E9BD62', '#E97832', '#FFF4CC', '#52C41A', '#FF7A45'];

        this.particles.push({
          x: cx + Math.cos(armAngle) * 16,
          y: cy + Math.sin(armAngle) * 8, // slight perspective tilt
          vx: Math.cos(armAngle) * speed + (Math.random() - 0.5) * 1.5,
          vy: Math.sin(armAngle) * (speed * 0.5) + (Math.random() - 0.5) * 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2.8 + 1.2,
          alpha: 1,
          decay: Math.random() * 0.03 + 0.02,
          gravity: 0.08,
          friction: 0.94,
          sparkle: true,
        });
      }
      return true;
    });
  }

  // 4. Sky Shot (Rocket) - Soars upward then bursts!
  public igniteRocket(targetX?: number, targetY?: number) {
    const startX = targetX || this.canvas.width * (0.3 + Math.random() * 0.4);
    const startY = this.canvas.height;
    const apexY = targetY || this.canvas.height * (0.2 + Math.random() * 0.2);

    let currentY = startY;
    let vy = -16;
    let frames = 0;

    this.activeEmitters.push(() => {
      frames++;
      currentY += vy;
      vy *= 0.985;

      // Tail sparks
      for (let i = 0; i < 5; i++) {
        this.particles.push({
          x: startX + (Math.random() - 0.5) * 4,
          y: currentY,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 3 + 2,
          color: '#E97832',
          size: 2,
          alpha: 0.9,
          decay: 0.06,
          gravity: 0.05,
          friction: 0.95,
        });
      }

      // Detonation reached apex
      if (currentY <= apexY || frames > 55) {
        this.createAerialBurst(startX, currentY);
        return false;
      }
      return true;
    });
  }

  // Spectacular aerial burst for Sky Shot
  private createAerialBurst(x: number, y: number) {
    const particleCount = 140;
    const paletteSets = [
      ['#FFD700', '#FF4500', '#FF1493', '#FFFFFF', '#00FFFF'], // Festive multi
      ['#E9BD62', '#D4A64C', '#FFF4CC', '#E97832'],             // Royal Gold
      ['#00E5FF', '#1DE9B6', '#76FF03', '#FFFFFF'],             // Emerald Spark
    ];
    const palette = paletteSets[Math.floor(Math.random() * paletteSets.length)];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 11 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: palette[Math.floor(Math.random() * palette.length)],
        size: Math.random() * 3.5 + 1.5,
        alpha: 1,
        decay: Math.random() * 0.018 + 0.012,
        gravity: 0.14,
        friction: 0.97,
        sparkle: Math.random() > 0.4,
      });
    }
  }

  // 5. Sutli Bomb - Enormous shockwave explosion!
  public igniteBomb(originX?: number, originY?: number) {
    const cx = originX || this.canvas.width / 2;
    const cy = originY || this.canvas.height * 0.65;

    // 0.4s fuse sizzle
    let fuseFrames = 0;
    this.activeEmitters.push(() => {
      fuseFrames++;
      if (fuseFrames < 24) {
        for (let i = 0; i < 4; i++) {
          this.particles.push({
            x: cx + (Math.random() - 0.5) * 6,
            y: cy - 20,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 3,
            color: '#FF7A45',
            size: 2,
            alpha: 1,
            decay: 0.08,
            gravity: 0.05,
            friction: 0.95,
          });
        }
        return true;
      }

      // Detonate: Massive burst!
      const blastParticles = 180;
      for (let i = 0; i < blastParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 16 + 3;
        const colors = ['#FF4D4F', '#FFA940', '#FFEC3D', '#FFFFFF', '#73D13D', '#52C41A'];

        this.particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4.5 + 2,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.01,
          gravity: 0.22,
          friction: 0.95,
          sparkle: true,
        });
      }

      return false;
    });
  }

  // 6. Ladi (Crackers String) - Dancing chain of explosions
  public igniteLadi(originX?: number, originY?: number) {
    const cx = originX || this.canvas.width / 2;
    const cy = originY || this.canvas.height * 0.8;
    let count = 0;
    const totalPops = 24;

    const interval = setInterval(() => {
      count++;
      if (count > totalPops) {
        clearInterval(interval);
        return;
      }

      const popX = cx + (Math.random() - 0.5) * 90;
      const popY = cy + (Math.random() - 0.5) * 50;

      // Mini burst of sparks & red paper fragments
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 1.5;
        const isPaper = Math.random() > 0.6;
        this.particles.push({
          x: popX,
          y: popY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          color: isPaper ? '#FF4D4F' : '#FFF4CC',
          size: isPaper ? 3.5 : 2,
          alpha: 1,
          decay: isPaper ? 0.02 : 0.05,
          gravity: 0.2,
          friction: 0.94,
          sparkle: !isPaper,
        });
      }
    }, 90);
  }
}
