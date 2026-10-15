import React, { useState } from 'react';
import { X, CheckCircle2, Lock, Download, Sparkles, AlertCircle, ArrowRight, Smartphone, RefreshCw, Layers } from 'lucide-react';
import { HeadshotItem } from '../types';

interface UnlockModalProps {
  unlockedItems: HeadshotItem[];
  pendingItem?: HeadshotItem | null;
  onClose: () => void;
  onDownloadSingle: (item: HeadshotItem) => void;
  onDownloadWatermark?: (item: HeadshotItem) => void;
  onSwapItem: (oldId: string, newId: string) => void;
  onUnlockPending: (item: HeadshotItem) => void;
  watermarkedCount?: number;
}

export const UnlockModal: React.FC<UnlockModalProps> = ({
  unlockedItems,
  pendingItem,
  onClose,
  onDownloadSingle,
  onDownloadWatermark,
  onSwapItem,
  onUnlockPending,
  watermarkedCount = 0,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-500 p-[1.5px] shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-sm">
                AJ
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  AJ-Labs • Vos Téléchargements Offerts
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                2 photos 4K sans filigrane + 3 photos avec filigrane AJ-Labs incluses gratuitement.
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* If there's a pending item that user wanted to unlock but limit reached */}
          {pendingItem && unlockedItems.length >= 2 && !unlockedItems.some((u) => u.id === pendingItem.id) && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-400 shrink-0">
                  <img src={pendingItem.baseImageUrl} alt={pendingItem.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Nouveau portrait souhaité
                  </span>
                  <h4 className="text-sm font-bold text-white truncate">{pendingItem.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Votre quota gratuit de 2 photos est atteint. Choisissez ci-dessous quelle photo remplacer :
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-amber-500/20">
                {unlockedItems.map((u, i) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => onSwapItem(u.id, pendingItem.id)}
                    className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 text-left transition-all flex items-center gap-2 group"
                  >
                    <img src={u.baseImageUrl} alt={u.title} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-white truncate">{u.title}</div>
                      <div className="text-[10px] text-amber-300 group-hover:underline flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" />
                        <span>Remplacer par celle-ci</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Currently unlocked items list */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Vos 2 photos 4K débloquées :</span>
              <span className="text-emerald-400 font-mono text-[11px]">
                {unlockedItems.length} sur 2 sélectionnée{unlockedItems.length > 1 ? 's' : ''}
              </span>
            </h4>

            {unlockedItems.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-slate-950/60 border border-dashed border-slate-800 text-xs text-slate-400">
                <p>Aucune photo débloquée pour l'instant.</p>
                <p className="text-slate-500 mt-1">Parcourez la galerie et cliquez sur "Débloquer en 4K" sur vos 2 portraits favoris !</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {unlockedItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-center gap-3 relative shadow-md"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-emerald-500/50 shrink-0">
                      <img src={item.baseImageUrl} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 bg-emerald-500 text-slate-950 text-[8px] font-black px-1 rounded">
                        #{index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                      <span className="text-[10px] text-slate-400 font-mono block">4K (3840×3840)</span>
                      <button
                        type="button"
                        onClick={() => onDownloadSingle(item)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold transition-all shadow-sm active:scale-95"
                      >
                        <Download className="w-3 h-3" />
                        <span>Télécharger</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Watermarked tier: 3 photos with AJ-Labs watermark */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>🏷️ Photos avec filigrane AJ-Labs</span>
              </span>
              <span className="text-amber-400 font-mono font-bold">
                {watermarkedCount} sur 3 utilisées
              </span>
            </div>
            <p className="text-xs text-slate-400">
              En plus de vos 2 photos 4K, vous avez droit à <strong>3 téléchargements de portraits avec le filigrane officiel AJ-Labs</strong>. Cliquez sur le bouton "Filigrane" sous n'importe quelle photo de la galerie.
            </p>
          </div>

          {/* Explanation on Haiti & Payment Methods */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Pack Complet 20 Photos + ZIP (Bientôt disponible)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pour s'adapter à la communauté en <strong>Haïti</strong> et à l'international sans dépendre de Stripe, nous préparons l'intégration de moyens de paiement locaux et accessibles :
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-rose-400 font-bold block">MonCash</span>
                <span className="text-[10px] text-slate-500">Digicel Haïti</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-blue-400 font-bold block">Natcash</span>
                <span className="text-[10px] text-slate-500">Natcom</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold block">Virement / CB</span>
                <span className="text-[10px] text-slate-500">Diaspora & Local</span>
              </div>
            </div>

            {/* Notification form */}
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="pt-2 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email pour être notifié de l'ouverture du pack 20 photos"
                  className="flex-1 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 placeholder-slate-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shrink-0"
                >
                  M'avertir
                </button>
              </form>
            ) : (
              <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Merci ! Vous serez informé dès l'ouverture des paiements MonCash & Natcash.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Profitez dès maintenant de vos 2 photos 4K gratuites</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
