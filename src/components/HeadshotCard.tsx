import React from 'react';
import { Download, Columns2, Sliders, Heart, Check, ZoomIn, Sparkles } from 'lucide-react';
import { HeadshotItem } from '../types';

interface HeadshotCardProps {
  item: HeadshotItem;
  onDownloadSingle: (item: HeadshotItem) => void;
  onDownloadWatermark?: (item: HeadshotItem) => void;
  onOpenCompare: (item: HeadshotItem) => void;
  onOpenDetail: (item: HeadshotItem) => void;
  onOpenMockup?: (item: HeadshotItem) => void;
  onUnlock?: (item: HeadshotItem) => void;
  isUnlocked?: boolean;
  onToggleFavorite: (id: string) => void;
}

export const HeadshotCard: React.FC<HeadshotCardProps> = ({
  item,
  onDownloadSingle,
  onDownloadWatermark,
  onOpenCompare,
  onOpenDetail,
  onOpenMockup,
  onUnlock,
  isUnlocked,
  onToggleFavorite,
}) => {
  // Compute CSS filter from retouch settings
  const r = item.retouchSettings;
  const brightness = 1 + (r.lightingBoost / 250);
  const contrast = 1 + (r.contrast / 200);
  const sepia = r.warmth > 0 ? r.warmth / 200 : 0;
  const grayscale = r.blackAndWhite ? 1 : 0;
  const filterStyle = `brightness(${brightness}) contrast(${contrast}) sepia(${sepia}) grayscale(${grayscale})`;

  // Visual framing simulation
  let scaleClass = 'scale-100 object-center';
  if (item.framing === 'visage') {
    scaleClass = 'scale-115 object-top';
  } else if (item.framing === 'épaules') {
    scaleClass = 'scale-105 object-center';
  } else if (item.framing === 'buste') {
    scaleClass = 'scale-100 object-center';
  }

  return (
    <div className="group relative bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col">
      {/* Image container */}
      <div
        className="relative w-full aspect-square bg-slate-950 overflow-hidden cursor-pointer"
        onClick={() => onOpenDetail(item)}
      >
        <img
          src={item.baseImageUrl}
          alt={item.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${scaleClass}`}
          style={{ filter: filterStyle }}
          referrerPolicy="no-referrer"
        />

        {/* Gradient dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 shadow-sm">
              {item.styleLabel}
            </span>
            {isUnlocked && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                ✓ 4K Débloquée
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(item.id);
              }}
              className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                item.isFavorite
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700/80'
              }`}
              title="Ajouter aux coups de cœur"
            >
              <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hover Quick Overlay Action */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-[2px]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(item);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Inspecter 4K</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCompare(item);
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Comparer</span>
            </button>
          </div>
        </div>

        {/* Bottom tags on image */}
        <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
          <h3 className="text-sm font-bold text-white tracking-tight truncate drop-shadow-md">
            {item.title}
          </h3>
          <p className="text-[11px] text-slate-300 font-mono flex items-center gap-2 mt-0.5">
            <span>{item.focalLength} • {item.aperture}</span>
            <span>•</span>
            <span className="text-amber-300 capitalize">{item.background}</span>
            <span>•</span>
            <span className="capitalize">{item.expression}</span>
          </p>
        </div>
      </div>

      {/* Card Footer Info & Download Action */}
      <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            {item.framing === 'visage' ? 'Cadrage Visage' : item.framing === 'épaules' ? 'Cadrage Épaules' : 'Cadrage Buste'}
          </div>
          <div className="text-[11px] text-slate-300 font-medium">
            4K (3840×3840)
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenMockup && (
            <button
              type="button"
              onClick={() => onOpenMockup(item)}
              className="p-2 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 hover:text-white border border-blue-800/60 transition-colors"
              title="Mettre en situation sur LinkedIn ou Badge Conférencier"
            >
              <span className="text-[10px] font-bold">Mockup</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenCompare(item)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Comparer instantanément avec votre selfie"
          >
            <Columns2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onOpenDetail(item)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Ajuster les retouches"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
          {isUnlocked ? (
            <button
              type="button"
              onClick={() => onDownloadSingle(item)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-sm active:scale-95"
              title="Télécharger cette photo débloquée en Ultra-HD (4K)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-[11px]">4K</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              {onDownloadWatermark && (
                <button
                  type="button"
                  onClick={() => onDownloadWatermark(item)}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-[10px] font-semibold"
                  title="Télécharger avec filigrane AJ-Labs (3 gratuites)"
                >
                  Filigrane
                </button>
              )}
              <button
                type="button"
                onClick={() => (onUnlock ? onUnlock(item) : onDownloadSingle(item))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-sm active:scale-95"
                title="Débloquer gratuitement en 4K Ultra-HD (2 offertes)"
              >
                <Sparkles className="w-3 h-3 text-slate-950" />
                <span className="text-[11px]">Débloquer 4K</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
