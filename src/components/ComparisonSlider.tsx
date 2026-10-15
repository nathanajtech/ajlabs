import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Download, Sliders, Sparkles, RefreshCw, Layers, Check, Camera, Image as ImageIcon } from 'lucide-react';
import { HeadshotItem, UploadedSelfie, RetouchSettings } from '../types';

interface ComparisonSliderProps {
  headshot: HeadshotItem;
  allHeadshots: HeadshotItem[];
  selfies: UploadedSelfie[];
  onClose: () => void;
  onUpdateRetouch: (id: string, newSettings: RetouchSettings) => void;
  onDownloadSingle: (item: HeadshotItem) => void;
  onSelectHeadshot: (item: HeadshotItem) => void;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  headshot,
  allHeadshots,
  selfies,
  onClose,
  onUpdateRetouch,
  onDownloadSingle,
  onSelectHeadshot,
}) => {
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100 %
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Selected selfie to compare against
  const [selectedSelfieIndex, setSelectedSelfieIndex] = useState(0);
  const currentSelfie = selfies[selectedSelfieIndex] || selfies[0];

  // Local retouch state
  const [retouch, setRetouch] = useState<RetouchSettings>({ ...headshot.retouchSettings });

  // Keep local state in sync when headshot changes
  useEffect(() => {
    setRetouch({ ...headshot.retouchSettings });
  }, [headshot]);

  const handleRetouchChange = (key: keyof RetouchSettings, value: any) => {
    const updated = { ...retouch, [key]: value };
    setRetouch(updated);
    onUpdateRetouch(headshot.id, updated);
  };

  const handleResetRetouch = () => {
    const defaults: RetouchSettings = {
      skinSmooth: 30,
      lightingBoost: 20,
      bokehDepth: 50,
      eyeClarity: 50,
      blackAndWhite: headshot.styleKey === 'editorial_bw',
      warmth: 8,
      contrast: 20,
    };
    setRetouch(defaults);
    onUpdateRetouch(headshot.id, defaults);
  };

  // Slider dragging logic
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(x, rect.width));
    const percentage = (clamped / rect.width) * 100;
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  // Compute CSS filter from retouch settings
  const brightness = 1 + (retouch.lightingBoost / 250);
  const contrastVal = 1 + (retouch.contrast / 200);
  const sepia = retouch.warmth > 0 ? retouch.warmth / 200 : 0;
  const grayscale = retouch.blackAndWhite ? 1 : 0;
  const blurAmount = retouch.skinSmooth > 50 ? ((retouch.skinSmooth - 50) / 100) * 0.8 : 0;
  const filterStyle = `brightness(${brightness}) contrast(${contrastVal}) sepia(${sepia}) grayscale(${grayscale}) blur(${blurAmount}px)`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-6xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Comparateur Instantané Avant / Après
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Prévisualisation directe
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Glissez le curseur central pour observer la métamorphose entre votre selfie d'origine et le portrait studio retouché.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content: Slider View + Retouch Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Column: Interactive Image Comparison Slider (7 cols) */}
          <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col items-center justify-center bg-slate-950/70 border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Selfie Selector Pills */}
            <div className="w-full flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Choisir le selfie décontracté de référence :
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {selfies.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSelfieIndex(idx)}
                    className={`relative w-8 h-8 rounded-lg overflow-hidden border transition-all ${
                      selectedSelfieIndex === idx
                        ? 'border-amber-400 ring-2 ring-amber-400/30 scale-105'
                        : 'border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                    title={`Selfie #${idx + 1}`}
                  >
                    <img src={s.dataUrl} alt={`Selfie ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Slider Container */}
            <div
              ref={containerRef}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative w-full aspect-square max-w-[540px] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-slate-700/80 shadow-2xl bg-black"
            >
              {/* Layer 1: Après (Full Image in background) */}
              <img
                src={headshot.baseImageUrl}
                alt="Après - Portrait IA Studio"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: filterStyle }}
                referrerPolicy="no-referrer"
              />

              {/* Layer 2: Avant (Clipped Image on top) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={currentSelfie ? currentSelfie.dataUrl : headshot.baseImageUrl}
                  alt="Avant - Selfie décontracté"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                    maxWidth: 'none',
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              </div>

              {/* Divider Line & Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-slate-950 font-bold flex items-center justify-center shadow-2xl border-2 border-slate-950 text-xs">
                  ⟷
                </div>
              </div>

              {/* Badges on left and right */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-md text-[11px] font-bold text-slate-300 border border-slate-700 pointer-events-none">
                📸 Selfie Décontracté (Avant)
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-amber-500/90 backdrop-blur-md text-[11px] font-bold text-slate-950 border border-amber-300 pointer-events-none shadow-md">
                ✨ Studio IA 4K (Après)
              </div>
            </div>

            {/* Slider Hint */}
            <div className="flex items-center justify-between w-full max-w-[540px] mt-3 text-xs text-slate-400">
              <span>← Glisser vers la gauche</span>
              <span className="font-mono text-amber-400">{Math.round(sliderPos)}%</span>
              <span>Glisser vers la droite →</span>
            </div>

            {/* Portrait switcher thumbnails */}
            <div className="w-full max-w-[540px] mt-4 pt-3 border-t border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                Changer de portrait à comparer :
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {allHeadshots.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectHeadshot(item)}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border transition-all ${
                      headshot.id === item.id
                        ? 'border-amber-400 ring-2 ring-amber-400/30 scale-105'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                    title={item.title}
                  >
                    <img src={item.baseImageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Instant Retouch Sliders (5 cols) */}
          <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between bg-slate-900 space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">Retouches en direct</h4>
                </div>
                <button
                  onClick={handleResetRetouch}
                  className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                  title="Réinitialiser"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Défaut</span>
                </button>
              </div>

              {/* Slider 1: Lissage de peau subtil */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Teint & Lissage de peau</span>
                  <span className="font-mono text-amber-400">{retouch.skinSmooth}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={retouch.skinSmooth}
                  onChange={(e) => handleRetouchChange('skinSmooth', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Slider 2: Éclairage Studio Keylight */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Éclairage Studio & Keylight</span>
                  <span className="font-mono text-amber-400">+{retouch.lightingBoost}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={retouch.lightingBoost}
                  onChange={(e) => handleRetouchChange('lightingBoost', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Slider 3: Contraste & relief */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Contraste & Relief des traits</span>
                  <span className="font-mono text-amber-400">{retouch.contrast}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={retouch.contrast}
                  onChange={(e) => handleRetouchChange('contrast', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Slider 4: Chaleur colorimétrique */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Température de couleur (Kelvin)</span>
                  <span className="font-mono text-amber-400">{retouch.warmth > 0 ? `+${retouch.warmth}` : retouch.warmth}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="40"
                  value={retouch.warmth}
                  onChange={(e) => handleRetouchChange('warmth', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Toggle: Noir & Blanc Harcourt */}
              <div className="pt-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <div className="text-xs">
                    <span className="font-semibold text-white block">Éditorial Noir & Blanc</span>
                    <span className="text-[11px] text-slate-400">Contraste argentique Harcourt</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={retouch.blackAndWhite}
                    onChange={(e) => handleRetouchChange('blackAndWhite', e.target.checked)}
                    className="w-4 h-4 rounded text-amber-400 bg-slate-900 border-slate-700 focus:ring-amber-400"
                  />
                </label>
              </div>

              {/* Portrait specs recap */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-[11px] space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Style :</span>
                  <span className="font-semibold text-amber-300">{headshot.styleLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cadrage :</span>
                  <span className="capitalize">{headshot.framing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Caméra :</span>
                  <span>{headshot.camera} ({headshot.focalLength})</span>
                </div>
              </div>
            </div>

            {/* Bottom Download Action */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => onDownloadSingle(headshot)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger ce portrait retouché (4K)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
