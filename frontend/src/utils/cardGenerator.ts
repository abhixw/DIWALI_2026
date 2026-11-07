import type { CardTemplate, StoryResponse } from '../types/story';

interface GenerateCardOptions {
  template: CardTemplate;
  story: StoryResponse;
  name?: string;
}

// Utility to wrap text cleanly on canvas
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 6
): number {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      lineCount++;
      if (lineCount >= maxLines - 1 && n < words.length - 1) {
        // Add ellipsis if text exceeds lines
        const remaining = words.slice(n).join(' ');
        let truncated = remaining;
        while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
          truncated = truncated.slice(0, -1);
        }
        ctx.fillText(truncated.trim() + '...', x, currentY);
        return currentY + lineHeight;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
}

// Draw stylized Diya onto the canvas
function drawCanvasDiya(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number = 1,
  isDarkTheme: boolean = true
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Outer ambient flame glow
  const glowGrad = ctx.createRadialGradient(0, -40, 10, 0, -40, 90);
  glowGrad.addColorStop(0, 'rgba(233, 189, 98, 0.45)');
  glowGrad.addColorStop(0.5, 'rgba(233, 120, 50, 0.25)');
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(0, -40, 90, 0, Math.PI * 2);
  ctx.fill();

  // Outer Flame
  const flameGrad = ctx.createLinearGradient(0, -90, 0, 0);
  flameGrad.addColorStop(0, '#FFFFFF');
  flameGrad.addColorStop(0.2, '#FFF2B2');
  flameGrad.addColorStop(0.6, '#E9BD62');
  flameGrad.addColorStop(1, '#E97832');

  ctx.fillStyle = flameGrad;
  ctx.beginPath();
  ctx.moveTo(0, -95);
  ctx.bezierCurveTo(18, -60, 30, -35, 20, -10);
  ctx.bezierCurveTo(10, 5, -10, 5, -20, -10);
  ctx.bezierCurveTo(-30, -35, -18, -60, 0, -95);
  ctx.closePath();
  ctx.fill();

  // Flame Inner Core
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(0, -75);
  ctx.bezierCurveTo(8, -50, 14, -30, 8, -12);
  ctx.bezierCurveTo(4, -4, -4, -4, -8, -12);
  ctx.bezierCurveTo(-14, -30, -8, -50, 0, -75);
  ctx.closePath();
  ctx.fill();

  // Wick
  ctx.strokeStyle = isDarkTheme ? '#5C2D16' : '#2D1609';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.lineTo(2, -10);
  ctx.stroke();

  // Clay Diya Base
  const diyaGrad = ctx.createLinearGradient(-60, 0, 60, 45);
  if (isDarkTheme) {
    diyaGrad.addColorStop(0, '#D4A64C');
    diyaGrad.addColorStop(0.5, '#7B3428');
    diyaGrad.addColorStop(1, '#4A1E17');
  } else {
    diyaGrad.addColorStop(0, '#C99238');
    diyaGrad.addColorStop(0.5, '#8C3F2B');
    diyaGrad.addColorStop(1, '#5E2517');
  }

  ctx.fillStyle = diyaGrad;
  ctx.beginPath();
  ctx.moveTo(-65, 0);
  ctx.bezierCurveTo(-55, 45, 55, 45, 65, 0);
  ctx.bezierCurveTo(40, 12, -40, 12, -65, 0);
  ctx.closePath();
  ctx.fill();

  // Gold Rim
  ctx.strokeStyle = '#E9BD62';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, 65, 12, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Decorative dots
  ctx.fillStyle = '#FFF4CC';
  for (let i = -45; i <= 45; i += 15) {
    ctx.beginPath();
    ctx.arc(i, 4, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export async function generateGreetingCardCanvas(
  canvas: HTMLCanvasElement,
  options: GenerateCardOptions
): Promise<void> {
  const { template, story, name } = options;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Wait for Google Fonts to be loaded
  if (document.fonts) {
    await document.fonts.ready;
  }

  // Standard Instagram Portrait: 1080 x 1350
  const width = 1080;
  const height = 1350;
  canvas.width = width;
  canvas.height = height;

  const displayName = name && name.trim() ? name.trim() : null;

  // 1. Render Background & Styling based on Template
  if (template === 'traditional') {
    // Deep Maroon with Saffron Accents & Golden Borders
    const bgGrad = ctx.createRadialGradient(width / 2, height * 0.35, 100, width / 2, height / 2, 700);
    bgGrad.addColorStop(0, '#8F3A2B');
    bgGrad.addColorStop(0.5, '#7B3428');
    bgGrad.addColorStop(1, '#421610');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Golden Borders & Rangoli Corners
    ctx.strokeStyle = '#D4A64C';
    ctx.lineWidth = 5;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = '#E97832';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(55, 55, width - 110, height - 110);

    // Decorative corner diamonds
    const corners = [
      [55, 55],
      [width - 55, 55],
      [55, height - 55],
      [width - 55, height - 55],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = '#E9BD62';
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    });

  } else if (template === 'luxury') {
    // Obsidian Black with Antique Gold
    const bgGrad = ctx.createRadialGradient(width / 2, height * 0.3, 50, width / 2, height / 2, 800);
    bgGrad.addColorStop(0, '#1A1816');
    bgGrad.addColorStop(0.6, '#11100F');
    bgGrad.addColorStop(1, '#080707');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Luxury Minimal Borders
    ctx.strokeStyle = 'rgba(212, 166, 76, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, width - 90, height - 90);

    ctx.strokeStyle = 'rgba(233, 189, 98, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(55, 55, width - 110, height - 110);

    // Ambient golden particle specs
    ctx.fillStyle = 'rgba(233, 189, 98, 0.35)';
    for (let i = 0; i < 35; i++) {
      const px = Math.sin(i * 99) * 450 + width / 2;
      const py = Math.cos(i * 77) * 550 + height / 2;
      ctx.beginPath();
      ctx.arc(px, py, (i % 3) + 1, 0, Math.PI * 2);
      ctx.fill();
    }

  } else {
    // Minimal Elegant: Warm Cream with Gold Details
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#FAF3E3');
    bgGrad.addColorStop(0.5, '#F5E9D1');
    bgGrad.addColorStop(1, '#EFE0C2');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Elegant soft borders
    ctx.strokeStyle = '#D4A64C';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    ctx.strokeStyle = '#7B3428';
    ctx.lineWidth = 1;
    ctx.strokeRect(62, 62, width - 124, height - 124);
  }

  // 2. Draw Top Subtitle: "SHUBH DEEPAWALI"
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.font = '500 24px "Inter", sans-serif';

  if (template === 'minimal') {
    ctx.fillStyle = '#7B3428';
  } else {
    ctx.fillStyle = '#E9BD62';
  }
  ctx.fillText('• SHUBH DEEPAWALI •', width / 2, 140);

  // 3. Draw Festive Greeting: "Happy Diwali"
  ctx.font = '700 78px "Playfair Display", Georgia, serif';
  ctx.letterSpacing = '1px';

  if (template === 'minimal') {
    ctx.fillStyle = '#2B1B17';
  } else {
    const goldTextGrad = ctx.createLinearGradient(width / 2 - 250, 0, width / 2 + 250, 0);
    goldTextGrad.addColorStop(0, '#FFF4CC');
    goldTextGrad.addColorStop(0.5, '#E9BD62');
    goldTextGrad.addColorStop(1, '#D4A64C');
    ctx.fillStyle = goldTextGrad;
  }
  ctx.fillText('Happy Diwali', width / 2, 230);

  // 4. Draw Diya in Center
  drawCanvasDiya(ctx, width / 2, 420, 1.45, template !== 'minimal');

  // 5. Draw Visitor Name & Diwali Identity
  let startY = 570;

  if (displayName) {
    ctx.font = '400 32px "Inter", sans-serif';
    ctx.fillStyle = template === 'minimal' ? '#5E4E42' : '#C2B8AC';
    ctx.fillText(`Dedicated to ${displayName}`, width / 2, startY);
    startY += 55;
  } else {
    startY += 20;
  }

  // Identity Badge Box
  ctx.font = '700 48px "Playfair Display", Georgia, serif';
  ctx.fillStyle = template === 'minimal' ? '#7B3428' : '#FFF4CC';
  ctx.fillText(story.identity.title, width / 2, startY);

  // Divider Line
  ctx.strokeStyle = template === 'minimal' ? '#D4A64C' : 'rgba(212, 166, 76, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 120, startY + 30);
  ctx.lineTo(width / 2 + 120, startY + 30);
  ctx.stroke();

  // 6. Draw Personalized Blessing
  ctx.font = '500 34px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = template === 'minimal' ? '#2D221D' : '#F5E9D1';
  ctx.letterSpacing = '0.5px';

  const blessingStartY = startY + 95;
  wrapText(ctx, `"${story.blessing}"`, width / 2, blessingStartY, 780, 52, 5);

  // 7. Footer Branding & Philosophy
  ctx.font = '600 22px "Inter", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillStyle = template === 'minimal' ? '#7B3428' : '#E9BD62';
  ctx.fillText('THE DIWALI WITHIN', width / 2, height - 130);

  ctx.font = '400 18px "Inter", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillStyle = template === 'minimal' ? '#8A7B6E' : '#A39B92';
  ctx.fillText('Every Light Has a Story  •  Remember. Release. Rise.', width / 2, height - 95);
}

export function downloadCardAsPng(canvas: HTMLCanvasElement, filename: string = 'the-diwali-within.png') {
  const image = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.download = filename;
  link.href = image;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
