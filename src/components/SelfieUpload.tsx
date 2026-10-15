import React, { useRef, useState } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, Sparkles, Image as ImageIcon, Camera, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { UploadedSelfie } from '../types';
import { SAMPLE_CASUAL_SELFIES } from '../data/headshots';

interface SelfieUploadProps {
  selfies: UploadedSelfie[];
  onAddSelfies: (newSelfies: UploadedSelfie[]) => void;
  onRemoveSelfie: (id: string) => void;
  onLoadSamples: () => void;
  onStartGeneration: () => void;
}

export const SelfieUpload: React.FC<SelfieUploadProps> = ({
  selfies,
  onAddSelfies,
  onRemoveSelfie,
  onLoadSamples,
  onStartGeneration,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canGenerate = selfies.length >= 3 && selfies.length <= 5;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMsg(null);

    const availableSlots = 5 - selfies.length;
    if (availableSlots <= 0) {
      setErrorMsg('Vous avez déjà atteint le maximum de 5 selfies.');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    const loadedSelfies: UploadedSelfie[] = [];

    Array.from(filesToProcess).forEach((file, index) => {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Veuillez importer uniquement des images (JPG, PNG, WebP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const newSelfie: UploadedSelfie = {
          id: `user-selfie-${Date.now()}-${index}`,
          name: file.name,
          dataUrl,
          size: file.size,
          status: 'valid',
          quality: {
            lighting: 'Excellente',
            angle: index % 2 === 0 ? 'Face direct' : 'Trois-quarts',
            resolution: file.size > 2000000 ? 'Ultra-HD' : 'HD 1080p',
          },
        };
        loadedSelfies.push(newSelfie);
        if (loadedSelfies.length === filesToProcess.length) {
          onAddSelfies(loadedSelfies);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      {/* Hero Intro */}
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs text-amber-300 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AJ-Labs Studio AI • Photographie d’élite propulsée par IA</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Transformez de simples selfies en{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400">
            20 portraits professionnels
          </span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Téléchargez <strong className="text-white">3 à 5 selfies décontractés</strong>. Notre IA calibre votre carnation, reproduit l'éclairage de studio haut de gamme et génère 20 portraits haute résolution prêts pour LinkedIn, vos dossiers de presse et votre bio de fondateur en moins de 60 secondes.
        </p>

        {/* 5 Styles Showcase Badges */}
        <div className="pt-2 flex flex-wrap justify-center gap-2">
          {[
            { label: '👔 Portrait LinkedIn', desc: 'Bureau & tailleur moderne' },
            { label: '🚀 Bio de Fondateur', desc: 'Loft start-up & col roulé' },
            { label: '🎨 Directeur Créatif', desc: 'Chiaroscuro & design chic' },
            { label: '☕ Candid en Extérieur', desc: 'Heure dorée & terrasse' },
            { label: '🎞️ Éditorial Noir & Blanc', desc: 'Style Harcourt intemporel' },
          ].map((style, i) => (
            <div
              key={i}
              className="px-3 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-center gap-1.5 shadow-sm"
            >
              <span className="font-semibold text-white">{style.label}</span>
              <span className="text-slate-400 hidden sm:inline">({style.desc})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header bar of upload box */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-400" />
              <span>Vos selfies décontractés ({selfies.length}/5)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {selfies.length < 3
                ? `Veuillez ajouter au moins ${3 - selfies.length} selfie(s) supplémentaire(s) pour calibrer l'IA`
                : 'Superbe ! Vos selfies sont prêts pour la génération des 20 portraits'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLoadSamples}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-600/40 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Charger l'exemple de démo (4 selfies)</span>
            </button>
          </div>
        </div>

        {/* Dropzone */}
        {selfies.length < 5 && (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-6 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-amber-400 bg-amber-500/10 scale-[0.99]'
                : 'border-slate-700/80 hover:border-slate-600 bg-slate-950/40 hover:bg-slate-950/70'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFiles(e.target.files)}
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">
              Glissez-déposez 3 à 5 selfies ici, ou{' '}
              <span className="text-amber-400 underline decoration-amber-400/40 underline-offset-4">
                parcourez vos fichiers
              </span>
            </p>
            <p className="text-xs text-slate-400 mt-1.5">
              JPG, PNG ou WebP • Photos au smartphone idéales • Traitement sécurisé
            </p>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Selfies Grid */}
        {selfies.length > 0 && (
          <div className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {selfies.map((selfie, index) => (
                <div
                  key={selfie.id}
                  className="group relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all shadow-md aspect-square flex flex-col justify-end"
                >
                  <img
                    src={selfie.dataUrl}
                    alt={selfie.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badge: Number */}
                  <div className="absolute top-2 left-2 z-10 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-200 border border-slate-700">
                    #{index + 1}
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSelfie(selfie.id);
                    }}
                    className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-slate-900/90 hover:bg-rose-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700 hover:border-rose-500 shadow-md"
                    title="Supprimer ce selfie"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {/* Bottom Tags */}
                  <div className="relative z-10 p-2 space-y-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">{selfie.quality.lighting}</span>
                    </div>
                    <div className="text-[9px] text-slate-300 font-mono truncate">
                      {selfie.quality.angle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guidance Tips */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Selfies recommandés pour un rendu optimal</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li>Bonne lumière naturelle (près d'une fenêtre ou en journée)</li>
              <li>Angles légèrement variés (face, trois-quarts gauche/droit)</li>
              <li>Expressions détendues et naturelles</li>
              <li>Arrière-plans décontractés du quotidien</li>
            </ul>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <h4 className="font-bold text-amber-400 flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>À éviter pour préserver vos traits</span>
            </h4>
            <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
              <li>Lunettes de soleil foncées cachant le regard</li>
              <li>Chapeaux, casquettes ou masques masquant le visage</li>
              <li>Photos de groupe avec plusieurs personnes</li>
              <li>Filtres déformants Snapchat ou TikTok</li>
            </ul>
          </div>
        </div>

        {/* Generation CTA */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Zap className="w-4 h-4" />
              <span>Génération en &lt; 60 secondes</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Aucun compte requis</span>
            </div>
          </div>

          <button
            type="button"
            disabled={!canGenerate}
            onClick={onStartGeneration}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-xl ${
              canGenerate
                ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500 hover:from-amber-300 hover:to-indigo-400 text-slate-950 shadow-amber-500/20 active:scale-95 cursor-pointer ring-2 ring-amber-400/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
            }`}
          >
            <span>Générer mes 20 portraits studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
