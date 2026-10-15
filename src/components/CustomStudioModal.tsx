import React, { useState } from 'react';
import { X, Sparkles, Wand2, Send, Download, Check, AlertCircle } from 'lucide-react';
import { HeadshotItem } from '../types';

interface CustomStudioModalProps {
  onClose: () => void;
  onAddCustomHeadshot: (newHeadshot: HeadshotItem) => void;
}

export const CustomStudioModal: React.FC<CustomStudioModalProps> = ({
  onClose,
  onAddCustomHeadshot,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Costume moderne chic');
  const [selectedSetting, setSelectedSetting] = useState('Bureau avec baie vitrée');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presets = [
    { label: '🎩 Smoking de Gala', prompt: 'Smoking de soirée noir en velours, nœud papillon en soie, studio feutré, éclairage d’ambiance noble' },
    { label: '🌿 Lin Blanc & Soleil', prompt: 'Chemise en lin blanc naturel déboutonnée, terrasse ensoleillée du sud, lumière douce et bienveillante' },
    { label: '🏢 Verrière Station F', prompt: 'Veste blazer casual grise, col ouvert, grand atrium contemporain lumineux avec structures métalliques' },
    { label: '📚 Bibliothèque d’Avocat', prompt: 'Veste bleu marine texturée, bibliothèque en bois de chêne massif floutée, allure docte et rassurante' },
    { label: '⚡ Cyber / Neo-Tech', prompt: 'Vêtement minimaliste noir mat, rétro-éclairage subtil turquoise et ambre, studio moderne avant-gardiste' },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const fullPrompt = `${customPrompt || selectedStyle + ' dans un ' + selectedSetting}. Portrait ultra-haute définition 85mm f/1.4, éclairage studio professionnel, grain réaliste, carnation naturelle.`;

    try {
      const res = await fetch('/api/generate-portrait', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          style: selectedStyle,
        }),
      });

      const data = await res.json();

      if (data.success && data.imageUrl) {
        const customItem: HeadshotItem = {
          id: `custom-hs-${Date.now()}`,
          title: `Création sur-mesure : ${customPrompt ? customPrompt.slice(0, 25) + '...' : selectedStyle}`,
          styleKey: 'creative',
          styleLabel: 'Création sur-mesure',
          background: 'studio',
          expression: 'confiant',
          framing: 'buste',
          lighting: 'Éclairage personnalisé Gemini AI Studio',
          camera: 'Hasselblad H6D-100c',
          focalLength: '85mm',
          aperture: 'f/1.4',
          baseImageUrl: data.imageUrl,
          resolution: '3840 x 3840 px (4K)',
          fileSize: '4.7 Mo',
          description: fullPrompt,
          isFavorite: true,
          retouchSettings: {
            skinSmooth: 30,
            lightingBoost: 20,
            bokehDepth: 55,
            eyeClarity: 50,
            blackAndWhite: false,
            warmth: 8,
            contrast: 22,
          },
        };
        onAddCustomHeadshot(customItem);
        onClose();
      } else {
        setErrorMsg(data.error || 'La génération personnalisée a rencontré une limite temporaire.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-[1.5px]">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Studio Créatif : Tenue & Décor Personnalisés
              </h3>
              <p className="text-xs text-slate-400">
                Commandez une tenue ou un arrière-plan sur-mesure généré par l'IA Gemini.
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
        <div className="p-6 space-y-5">
          {/* Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Idées & Ambiances prêtes à l'emploi :
            </label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setCustomPrompt(p.prompt)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all text-left"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt textarea */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Décrivez la tenue, les couleurs ou l'atmosphère souhaitée :
            </label>
            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ex: Blazer en velours vert émeraude, bureau d'architecte épuré, lumière douce du matin..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGenerate}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500 hover:from-amber-300 hover:to-indigo-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 active:scale-95 disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Création de votre portrait IA en cours...' : 'Générer ce portrait sur-mesure'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
