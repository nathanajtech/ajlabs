import React from 'react';
import { Camera, Sparkles, Zap, ShieldCheck, Download, RefreshCw, Smartphone } from 'lucide-react';

interface HeaderProps {
  hasResults: boolean;
  onReset: () => void;
  onOpenZip: () => void;
  onOpenInstall?: () => void;
  unlockedCount?: number;
  watermarkedCount?: number;
  isZipping?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  hasResults,
  onReset,
  onOpenZip,
  onOpenInstall,
  unlockedCount = 0,
  watermarkedCount = 0,
  isZipping,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-900/90 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand AJ-Labs */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 p-[1.5px] shadow-lg shadow-amber-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 tracking-tighter text-sm">
              AJ
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                AJ-Labs<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">.ai</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Studio AI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Écosystème AJ • 20 portraits studio par IA en moins de 60s
            </p>
          </div>
        </div>

        {/* Value Props / Badges */}
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full">
            <Zap className="w-3.5 h-3.5" />
            <span>&lt; 60s chrono</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-300 bg-indigo-950/40 border border-indigo-800/50 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sans compte requis</span>
          </div>
        </div>

        {/* Actions & Credits */}
        <div className="flex items-center gap-2.5">
          {onOpenInstall && (
            <button
              onClick={onOpenInstall}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-750 rounded-xl transition-all active:scale-95 shadow-sm"
              title="Installer AJ-Labs sur votre téléphone (Android & iPhone)"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Installer l'App</span>
            </button>
          )}

          {hasResults && (
            <>
              {/* Free 4K credits counter */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{unlockedCount}/2 4K offertes</span>
              </div>

              {/* Watermark credits counter */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-300">
                <span>🏷️ {watermarkedCount}/3 filigranes</span>
              </div>

              <button
                onClick={onReset}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                title="Recommencer une séance avec d'autres selfies"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Nouveau shooting</span>
              </button>

              <button
                onClick={onOpenZip}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-750 border border-slate-700 rounded-lg transition-all active:scale-95"
                title="Pack 20 photos + ZIP (Bientôt)"
              >
                <span className="text-amber-400">🔒</span>
                <span>Pack 20 + ZIP (Bientôt)</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
