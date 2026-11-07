import React, { useState } from 'react';
import { Download, Share2, Sparkles, Check } from 'lucide-react';
import type { CardTemplate, StoryResponse } from '../../types/story';
import { GreetingCard } from './GreetingCard';
import { Button } from '../common/Button';
import { downloadCardAsPng } from '../../utils/cardGenerator';
import { shareDiwaliStory } from '../../utils/whatsappShare';

interface CardEditorProps {
  story: StoryResponse;
  name?: string;
  selectedTemplate: CardTemplate;
  onTemplateChange: (tpl: CardTemplate) => void;
  onBackToStory: () => void;
}

export const CardEditor: React.FC<CardEditorProps> = ({
  story,
  name,
  selectedTemplate,
  onTemplateChange,
  onBackToStory,
}) => {
  const [activeCanvas, setActiveCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const templates: { id: CardTemplate; name: string; desc: string; previewColor: string; border: string }[] = [
    {
      id: 'traditional',
      name: 'Traditional Diwali',
      desc: 'Deep maroon with saffron & gold borders',
      previewColor: 'from-[#7B3428] to-[#421610]',
      border: 'border-[#E97832]',
    },
    {
      id: 'luxury',
      name: 'Premium Luxury',
      desc: 'Obsidian black with glowing diya & antique gold',
      previewColor: 'from-[#1B1916] to-[#0A0908]',
      border: 'border-[#D4A64C]',
    },
    {
      id: 'minimal',
      name: 'Minimal Elegant',
      desc: 'Warm cream with subtle gold accents',
      previewColor: 'from-[#F5E9D1] to-[#E5D7BA]',
      border: 'border-[#7B3428]',
    },
  ];

  const handleDownload = () => {
    if (!activeCanvas) return;
    setIsDownloading(true);
    const sanitizedName = name && name.trim() ? name.trim().toLowerCase().replace(/\s+/g, '-') : 'diwali';
    downloadCardAsPng(activeCanvas, `the-diwali-within-${sanitizedName}.png`);
    setTimeout(() => setIsDownloading(false), 800);
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await shareDiwaliStory(story, name, activeCanvas);
      setShareFeedback('Shared successfully!');
      setTimeout(() => setShareFeedback(null), 3000);
    } catch {
      setShareFeedback(null);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Studio Header */}
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#D4A64C] font-semibold mb-2">
          Greeting Card Studio
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-gold-gradient">
          Your Diwali Blessing Card
        </h2>
        <p className="text-sm sm:text-base text-[#A39B92] mt-2 max-w-md mx-auto">
          Choose an aesthetic template and download or share your personalized Diwali greeting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Live Canvas Preview */}
        <div className="lg:col-span-7 flex justify-center">
          <GreetingCard
            template={selectedTemplate}
            story={story}
            name={name}
            onCanvasReady={(canvas) => setActiveCanvas(canvas)}
          />
        </div>

        {/* Right Side: Template Controls & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#1B1916]/80 border border-[#D4A64C]/25 backdrop-blur-md">
            <h3 className="text-sm uppercase tracking-wider text-[#F5E9D1] font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E9BD62]" />
              Select Template
            </h3>

            <div className="space-y-3">
              {templates.map((t) => {
                const isActive = selectedTemplate === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onTemplateChange(t.id)}
                    className={`w-full p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-[#25221E] border-[#E9BD62] shadow-[0_0_20px_rgba(233,189,98,0.25)] ring-1 ring-[#E9BD62]'
                        : 'bg-[#141312] border-[#D4A64C]/20 hover:border-[#D4A64C]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.previewColor} border ${t.border} shadow-sm`}
                      />
                      <div>
                        <div className="text-sm font-semibold text-[#F5F0E8]">{t.name}</div>
                        <div className="text-xs text-[#A39B92]">{t.desc}</div>
                      </div>
                    </div>

                    {isActive && (
                      <div className="w-6 h-6 rounded-full bg-[#E9BD62] text-[#11100F] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleDownload}
              isLoading={isDownloading}
            >
              <Download className="w-5 h-5" />
              Download High-Res Card (PNG)
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleShare}
              isLoading={isSharing}
            >
              <Share2 className="w-5 h-5 text-[#E9BD62]" />
              Share on WhatsApp / Web
            </Button>

            {shareFeedback && (
              <p className="text-xs text-center text-[#E9BD62] animate-fade-in font-medium">
                {shareFeedback}
              </p>
            )}

            <Button
              variant="ghost"
              size="md"
              className="w-full text-xs text-[#A39B92]"
              onClick={onBackToStory}
            >
              ← Back to My Story
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
