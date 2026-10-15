import React from 'react';
import { Filter, SlidersHorizontal, Download, Columns2, Search, Sparkles, Heart } from 'lucide-react';
import { BackgroundType, ExpressionType, FramingType, HeadshotStyle } from '../types';

interface FilterBarProps {
  selectedBg: BackgroundType;
  onChangeBg: (bg: BackgroundType) => void;
  selectedExpression: ExpressionType;
  onChangeExpression: (expr: ExpressionType) => void;
  selectedFraming: FramingType;
  onChangeFraming: (framing: FramingType) => void;
  selectedStyle: HeadshotStyle | 'tous';
  onChangeStyle: (style: HeadshotStyle | 'tous') => void;
  searchQuery: string;
  onChangeSearch: (query: string) => void;
  favoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  totalCount: number;
  filteredCount: number;
  onOpenZip: () => void;
  onOpenCompare: () => void;
  isZipping?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedBg,
  onChangeBg,
  selectedExpression,
  onChangeExpression,
  selectedFraming,
  onChangeFraming,
  selectedStyle,
  onChangeStyle,
  searchQuery,
  onChangeSearch,
  favoritesOnly,
  onToggleFavoritesOnly,
  totalCount,
  filteredCount,
  onOpenZip,
  onOpenCompare,
  isZipping,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-xl mb-8 space-y-5">
      {/* Top Bar: Search, View Mode, Zip Download */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par style, caméra, éclairage..."
              value={searchQuery}
              onChange={(e) => onChangeSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onChangeSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Favorites filter */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              favoritesOnly
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span>Coups de cœur</span>
          </button>

          {/* Count Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 font-mono">
            <span className="text-amber-400 font-bold">{filteredCount}</span> sur {totalCount} portraits
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCompare}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-700/50 rounded-xl transition-all active:scale-95 shadow-sm"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Comparer Avant / Après</span>
          </button>

          <button
            type="button"
            onClick={onOpenZip}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all active:scale-95 shadow-sm"
          >
            <span className="text-amber-400">🔒</span>
            <span>Pack 20 + ZIP (Bientôt)</span>
          </button>
        </div>
      </div>

      {/* Filter Row 1: Style Principal */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Style de portrait (5 collections)</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: 'tous', label: 'Tous les styles (20)' },
            { key: 'linkedin', label: '👔 Portrait LinkedIn' },
            { key: 'founder', label: '🚀 Bio de Fondateur' },
            { key: 'creative', label: '🎨 Directeur Créatif' },
            { key: 'outdoor', label: '☕ Candid en Extérieur' },
            { key: 'editorial_bw', label: '🎞️ Éditorial Noir & Blanc' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => onChangeStyle(item.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedStyle === item.key
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Row 2: Les 3 Filtres Demandés (Arrière-plan, Expression, Cadrage) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/60">
        {/* Arrière-plan */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Arrière-plan</span>
            <span className="text-[10px] text-slate-500 font-normal">bureau, extérieur, studio</span>
          </label>
          <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[
              { key: 'tous', label: 'Tous' },
              { key: 'bureau', label: '🏢 Bureau' },
              { key: 'extérieur', label: '🌿 Extérieur' },
              { key: 'studio', label: '📸 Studio' },
            ].map((bg) => (
              <button
                key={bg.key}
                onClick={() => onChangeBg(bg.key as BackgroundType)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all text-center ${
                  selectedBg === bg.key
                    ? 'bg-slate-800 text-white font-bold shadow-inner'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {bg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Expression */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Expression</span>
            <span className="text-[10px] text-slate-500 font-normal">souriant, sérieux, confiant</span>
          </label>
          <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[
              { key: 'tous', label: 'Tous' },
              { key: 'souriant', label: '😊 Souriant' },
              { key: 'sérieux', label: '💼 Sérieux' },
              { key: 'confiant', label: '✨ Confiant' },
            ].map((exp) => (
              <button
                key={exp.key}
                onClick={() => onChangeExpression(exp.key as ExpressionType)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all text-center ${
                  selectedExpression === exp.key
                    ? 'bg-slate-800 text-white font-bold shadow-inner'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {exp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cadrage */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Cadrage</span>
            <span className="text-[10px] text-slate-500 font-normal">visage, buste, épaules</span>
          </label>
          <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[
              { key: 'tous', label: 'Tous' },
              { key: 'visage', label: '👤 Visage' },
              { key: 'épaules', label: '👔 Épaules' },
              { key: 'buste', label: '🧍 Buste' },
            ].map((fr) => (
              <button
                key={fr.key}
                onClick={() => onChangeFraming(fr.key as FramingType)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all text-center ${
                  selectedFraming === fr.key
                    ? 'bg-slate-800 text-white font-bold shadow-inner'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {fr.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
