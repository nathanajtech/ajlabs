import React, { useState } from 'react';
import { X, Smartphone, Share2, PlusSquare, Check, Copy, Sparkles, ExternalLink, QrCode } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallModalProps {
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ onClose }) => {
  const { isInstallable, isIOS, isAndroid, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'qr'>(isIOS ? 'ios' : 'android');
  const [copied, setCopied] = useState(false);

  // Production/Shared App URL
  const appUrl = window.location.href.includes('localhost') || window.location.href.includes('127.0.0.1')
    ? 'https://ais-pre-xvqhsk5rozsn22e2ryq3rz-396800112587.us-east1.run.app'
    : window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-600 p-[1.5px] shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Installer AJ-Labs sur votre Téléphone
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  App PWA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Installez l'application directement sans passer par l'App Store ou le Play Store.
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
        <div className="p-5 sm:p-6 space-y-6">
          {/* Quick Install Banner if browser supports beforeinstallprompt */}
          {isInstallable && !isInstalled && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/10 to-indigo-500/20 border border-amber-500/40 text-center space-y-2">
              <div className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Installation automatique détectée</span>
              </div>
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Installer AJ-Labs en 1 Clic</span>
              </button>
            </div>
          )}

          {/* Device Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('android')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === 'android'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🤖 Android (Chrome/Brave)</span>
            </button>
            <button
              onClick={() => setActiveTab('ios')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === 'ios'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🍎 iPhone / iPad (Safari)</span>
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                activeTab === 'qr'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>📱 QR Code / Lien</span>
            </button>
          </div>

          {/* Guide Steps */}
          {activeTab === 'android' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Étapes pour Android (Google Chrome, Samsung Internet, Brave) :
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <p className="mt-0.5">
                    Ouvrez le lien de l'application dans votre navigateur <strong>Chrome</strong> ou <strong>Brave</strong>.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <p className="mt-0.5">
                    Appuyez sur le menu des <strong>3 points verticaux (⋮)</strong> en haut à droite du navigateur.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <p className="mt-0.5">
                    Touchez <strong className="text-white">« Installer l'application »</strong> ou <strong className="text-white">« Ajouter à l'écran d'accueil »</strong>.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    4
                  </div>
                  <p className="mt-0.5">
                    L'icône <strong>AJ-Labs</strong> apparaît sur votre écran d'accueil et se lance en plein écran comme une vraie application !
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Étapes pour iPhone & iPad (Navigateur Safari obligatoire) :
              </h4>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <p className="mt-0.5">
                    Ouvrez obligatoirement le lien dans <strong>Safari</strong> (les autres navigateurs iOS ne permettent pas l'installation).
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <p className="mt-0.5 flex items-center gap-1.5 flex-wrap">
                    Appuyez sur le bouton <strong>Partager</strong> <Share2 className="w-3.5 h-3.5 inline text-blue-400" /> en bas de votre écran.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <p className="mt-0.5 flex items-center gap-1.5 flex-wrap">
                    Faites défiler vers le bas et appuyez sur <strong className="text-white">« Sur l'écran d'accueil »</strong> <PlusSquare className="w-3.5 h-3.5 inline text-blue-400" />.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    4
                  </div>
                  <p className="mt-0.5">
                    Touchez <strong>« Ajouter »</strong> en haut à droite. Votre application AJ-Labs est prête !
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-300">
                Scannez ce QR Code avec l'appareil photo de votre smartphone pour ouvrir l'application directement :
              </p>

              {/* QR Code Graphic */}
              <div className="p-4 bg-white rounded-2xl inline-block shadow-xl mx-auto border-4 border-amber-400">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(appUrl)}&color=020617`}
                  alt="QR Code AJ-Labs"
                  className="w-44 h-44 mx-auto block"
                />
              </div>

              {/* Copy link */}
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 max-w-md mx-auto">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="flex-1 bg-transparent text-xs text-slate-300 font-mono px-2 outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Advantages of PWA on phone */}
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-1.5 text-slate-400">
            <span className="font-bold text-slate-300 block">Pourquoi l'installer sur votre téléphone ?</span>
            <ul className="list-disc list-inside space-y-1">
              <li>Prenez directement vos selfies avec la caméra de votre smartphone</li>
              <li>Affichage en plein écran sans barre d'adresse comme une application native</li>
              <li>Chargement instantané et aucun compte requis</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>AJ-Labs • PWA Mobile</span>
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
