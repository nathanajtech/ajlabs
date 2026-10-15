import { HeadshotItem } from '../types';

/**
 * Generates and downloads a watermarked version of a headshot using HTML5 Canvas.
 * Watermark text: "AJ-Labs • Aperçu Studio"
 */
export async function downloadHeadshotWithWatermark(
  item: HeadshotItem,
  brandText: string = 'AJ-Labs'
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context non disponible'));
          return;
        }

        canvas.width = img.width || 1200;
        canvas.height = img.height || 1200;

        // Draw original base image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Apply item retouch filters if any
        // Watermark styling
        const w = canvas.width;
        const h = canvas.height;

        // Diagonal repeating subtle watermark
        ctx.save();
        ctx.rotate((-25 * Math.PI) / 180);
        ctx.font = `900 ${Math.round(w * 0.055)}px sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.lineWidth = Math.round(w * 0.003);

        const stepX = w * 0.45;
        const stepY = h * 0.25;

        for (let x = -w * 1.5; x < w * 2.5; x += stepX) {
          for (let y = -h * 1.5; y < h * 2.5; y += stepY) {
            ctx.strokeText(`${brandText} • PREVIEW`, x, y);
            ctx.fillText(`${brandText} • PREVIEW`, x, y);
          }
        }
        ctx.restore();

        // Elegant bottom badge watermark
        const badgeHeight = Math.round(h * 0.08);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(0, h - badgeHeight, w, badgeHeight);

        ctx.font = `bold ${Math.round(badgeHeight * 0.38)}px sans-serif`;
        ctx.fillStyle = '#f59e0b'; // Amber-400
        ctx.textAlign = 'left';
        ctx.fillText(`⚡ ${brandText} Studio AI`, Math.round(w * 0.04), h - Math.round(badgeHeight * 0.35));

        ctx.font = `normal ${Math.round(badgeHeight * 0.3)}px sans-serif`;
        ctx.fillStyle = '#cbd5e1'; // Slate-300
        ctx.textAlign = 'right';
        ctx.fillText('Aperçu Gratuit • Pack 4K sans filigrane', w - Math.round(w * 0.04), h - Math.round(badgeHeight * 0.38));

        // Convert canvas to blob and download
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Erreur de conversion blob'));
              return;
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            const safeTitle = item.title.replace(/[^a-zA-Z0-9_\-]/g, '_');
            a.download = `${brandText}_${safeTitle}_Filigrane.jpg`;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
            resolve();
          },
          'image/jpeg',
          0.92
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (e) => reject(e);
    img.src = item.baseImageUrl;
  });
}
