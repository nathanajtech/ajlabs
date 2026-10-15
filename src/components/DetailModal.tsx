import React, { useEffect, useState } from 'react';
import { X, Download, Heart, ChevronLeft, ChevronRight, Sliders, Camera, Sparkles, RefreshCw, ZoomIn } from 'lucide-react';
import { HeadshotItem, RetouchSettings } from '../types';

interface DetailModalProps {
  item: HeadshotItem;
  allHeadshots: HeadshotItem[];
  onClose: () => void;
  onSelect: (item: HeadshotItem) => void;
  onDownloadSingle: (item: HeadshotItem) => void;
  onDownloadWatermark?: (item: HeadshotItem) => void;
  onOpenMockup?: (item: HeadshotItem) => void;
  onUnlock?: (item: HeadshotItem) => void;
  isUnlocked?: boolean;
  onToggleFavorite: (id: string) => void;
  onUpdateRetouch: (id: string, newSettings: RetouchSettings) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  item,
  allHeadshots,
  onClose,
  onSelect,
  onDownloadSingle,
  onDownloadWatermark,
  onOpenMockup,
  onUnlock,
  isUnlocked,
  onToggleFavorite,
  onUpdateRetouch,
}) => {
  const currentIndex = allHeadshots.findIndex((h) => h.id === item.id);
  const [retouch, setRetouch] = useState<RetouchSettings>({ ...item.retouchSettings });
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setRetouch({ ...item.retouchSettings });
    setIsZoomed(false);
  }, [item]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onSelect(allHeadshots[currentIndex - 1]);
      }
      if (e.key === 'ArrowRight' && currentIndex < allHeadshots.length - 1) {
        onSelect(allHeadshots[currentIndex + 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allHeadshots, onClose, onSelect]);

  const handleRetouchChange = (key: keyof RetouchSettings, value: any) => {
    const updated = { ...retouch, [key]: value };
    setRetouch(updated);
    onUpdateRetouch(item.id, updated);
  };

  const handleResetRetouch = () => {
    const defaults: RetouchSettings = {
      skinSmooth: 30,
      lightingBoost: 20,
      bokehDepth: 50,
      eyeClarity: 50,
      blackAndWhite: item.styleKey === 'editorial_bw',
      warmth: 8,
      contrast: 20,
    };
    setRetouch(defaults);
    onUpdateRetouch(item.id, defaults);
  };

  // Compute CSS filter from retouch settings
  const brightness = 1 + (retouch.lightingBoost / 250);
  const contrastVal = 1 + (retouch.contrast / 200);
  const sepia = retouch.warmth > 0 ? retouch.warmth / 200 : 0;
  const grayscale = retouch.blackAndWhite ? 1 : 0;
  const filterStyle = `brightness(${brightness}) contrast(${contrastVal}) sepia(${sepia}) grayscale(${grayscale})`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {item.styleLabel}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-sm sm:max-w-md">
              {item.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(item.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                item.isFavorite
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Ajouter aux coups de cœur"
            >
              <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Main Photo Area */}
          <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col items-center justify-center bg-slate-950 relative border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Prev / Next Floating Arrows */}
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={() => onSelect(allHeadshots[currentIndex - 1])}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 shadow-xl transition-all"
                title="Portrait précédent (Touche ←)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {currentIndex < allHeadshots.length - 1 && (
              <button
                type="button"
                onClick={() => onSelect(allHeadshots[currentIndex + 1])}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 shadow-xl transition-all"
                title="Portrait suivant (Touche →)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Image Container with Zoom Toggle */}
            <div
              className={`relative max-w-[500px] w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-800 cursor-zoom-in transition-all ${
                isZoomed ? 'scale-125 z-10 cursor-zoom-out' : ''
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              title="Cliquez pour zoomer dans les détails de la photo"
            >
              <img
                src={item.baseImageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                style={{ filter: filterStyle }}
                referrerPolicy="no-referrer"
              />

              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-slate-800 flex items-center gap-1.5 pointer-events-none">
                <ZoomIn className="w-3 h-3 text-amber-400" />
                <span>{isZoomed ? 'Zoom 125%' : 'Cliquez pour zoomer'}</span>
              </div>
            </div>

            {/* Counter indicator */}
            <div className="mt-3 text-xs font-mono text-slate-400">
              Portrait {currentIndex + 1} sur {allHeadshots.length}
            </div>
          </div>

          {/* Right Column: EXIF Specs & Retouch Controls */}
          <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between bg-slate-900 space-y-6">
            <div className="space-y-5">
              {/* Technical Studio Specs */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>Métadonnées Prise de Vue Studio</span>
                </h4>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Boîtier :</span>
                    <span className="font-semibold text-white">{item.camera}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Objectif :</span>
                    <span className="text-amber-300 font-mono">{item.focalLength} • {item.aperture}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Éclairage :</span>
                    <span className="text-right text-slate-300 truncate max-w-[170px]" title={item.lighting}>
                      {item.lighting}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Arrière-plan :</span>
                    <span className="capitalize text-white">{item.background}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expression :</span>
                    <span className="capitalize text-white">{item.expression}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cadrage :</span>
                    <span className="capitalize text-white">{item.framing}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Résolution :</span>
                    <span className="font-mono text-emerald-400 font-bold">{item.resolution}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-slate-400 leading-relaxed italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                "{item.description}"
              </div>

              {/* Retouch Sliders */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ajustements de retouche</span>
                  </div>
                  <button
                    onClick={handleResetRetouch}
                    className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Réinitialiser</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">Teint & Lissage</span>
                    <span className="font-mono text-amber-400">{retouch.skinSmooth}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={retouch.skinSmooth}
                    onChange={(e) => handleRetouchChange('skinSmooth', parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">Éclairage Studio</span>
                    <span className="font-mono text-amber-400">+{retouch.lightingBoost}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={retouch.lightingBoost}
                    onChange={(e) => handleRetouchChange('lightingBoost', parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">Contraste</span>
                    <span className="font-mono text-amber-400">{retouch.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={retouch.contrast}
                    onChange={(e) => handleRetouchChange('contrast', parseInt(e.target.value, 10))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              {onOpenMockup && (
                <button
                  type="button"
                  onClick={() => onOpenMockup(item)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Tester en situation (LinkedIn, Badge, Presse)</span>
                </button>
              )}
              {isUnlocked ? (
                <button
                  type="button"
                  onClick={() => onDownloadSingle(item)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger cette photo débloquée (4K Ultra-HD)</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => (onUnlock ? onUnlock(item) : onDownloadSingle(item))}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Débloquer gratuitement en 4K (2 offertes)</span>
                  </button>
                  {onDownloadWatermark && (
                    <button
                      type="button"
                      onClick={() => onDownloadWatermark(item)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors border border-slate-700"
                    >
                      <span>🏷️ Télécharger avec filigrane AJ-Labs (3 offertes)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
