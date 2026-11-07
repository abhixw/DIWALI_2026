import type { StoryResponse } from '../types/story';

export async function shareDiwaliStory(
  story: StoryResponse,
  name?: string,
  canvas?: HTMLCanvasElement | null
): Promise<boolean> {
  const displayName = name && name.trim() ? name.trim() : 'a fellow traveler';
  
  const shareText = 
    `🪔 *The Diwali Within — Every Light Has a Story*\n\n` +
    `A personal Diwali story crafted for ${displayName}:\n` +
    `✨ *Identity:* ${story.identity.title}\n` +
    `📜 *Blessing:* "${story.blessing}"\n` +
    `💫 *Promise:* "${story.personal_promise}"\n\n` +
    `Remember. Release. Rise.\n` +
    `Discover your own story this Diwali: ${window.location.origin}`;

  // Try Native Web Share API first (Mobile)
  if (navigator.share) {
    try {
      if (canvas && navigator.canShare) {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), 'image/png')
        );

        if (blob) {
          const file = new File([blob], 'diwali-greeting.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'The Diwali Within',
              text: shareText,
              files: [file],
            });
            return true;
          }
        }
      }

      // Share text and url
      await navigator.share({
        title: 'The Diwali Within',
        text: shareText,
        url: window.location.origin,
      });
      return true;
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Native share failed, falling back to WhatsApp link:', err);
      } else {
        return false;
      }
    }
  }

  // Fallback: WhatsApp web link
  const encoded = encodeURIComponent(shareText);
  const whatsappUrl = `https://wa.me/?text=${encoded}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  return true;
}
