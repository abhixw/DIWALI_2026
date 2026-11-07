import { useEffect, useRef } from 'react';
import type { CardTemplate, StoryResponse } from '../../types/story';
import { generateGreetingCardCanvas } from '../../utils/cardGenerator';

interface GreetingCardProps {
  template: CardTemplate;
  story: StoryResponse;
  name?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export const GreetingCard: React.FC<GreetingCardProps> = ({
  template,
  story,
  name,
  onCanvasReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isMounted = true;

    generateGreetingCardCanvas(canvas, { template, story, name }).then(() => {
      if (isMounted && onCanvasReady) {
        onCanvasReady(canvas);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [template, story, name, onCanvasReady]);

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[#D4A64C]/35 bg-[#121110]">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain block"
      />
    </div>
  );
};
