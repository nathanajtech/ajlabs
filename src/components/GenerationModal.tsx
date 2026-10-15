import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Clock, Zap, Camera, ShieldCheck, Cpu } from 'lucide-react';
import { UploadedSelfie } from '../types';

interface GenerationModalProps {
  selfies: UploadedSelfie[];
  onComplete: () => void;
  onAnalysisResult?: (analysis: any) => void;
}

export const GenerationModal: React.FC<GenerationModalProps> = ({
  selfies,
  onComplete,
  onAnalysisResult,
}) => {
  const [progress, setProgress] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(25);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      title: 'Cartographie faciale 3D',
      desc: `Analyse des ${selfies.length} selfies, calcul de la carnation, symétrie et repères biométriques`,
      percent: 25,
    },
    {
      title: 'Calibration des éclairages studio',
      desc: 'Simulation des réflecteurs, boîtes à lumière Octabox et ombres douces Rembrandt',
      percent: 55,
    },
    {
      title: 'Génération des 20 variations de style',
      desc: 'LinkedIn, Bio de Fondateur, Directeur Créatif, Candid Extérieur et Harcourt Noir & Blanc',
      percent: 85,
    },
    {
      title: 'Étalonnage 4K & Finitions Studio',
      desc: 'Suréchantillonnage haute résolution, netteté du regard et packaging HD',
      percent: 100,
    },
  ];

  // Request backend AI analysis in background
  useEffect(() => {
    fetch('/api/analyze-selfies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selfieCount: selfies.length,
        descriptions: 'Selfies décontractés avec lumière naturelle et angles variés',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.analysis && onAnalysisResult) {
          onAnalysisResult(data.analysis);
        }
      })
      .catch((err) => {
        console.warn('Analysis fallback:', err);
      });
  }, [selfies.length, onAnalysisResult]);

  useEffect(() => {
    // Total duration ~ 25 seconds (well under 60 seconds)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        const next = prev + 1;
        // Update current step index based on progress
        if (next < 25) setCurrentStepIndex(0);
        else if (next < 55) setCurrentStepIndex(1);
        else if (next < 85) setCurrentStepIndex(2);
        else setCurrentStepIndex(3);

        return next;
      });

      setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : 0));
    }, 240);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setProgress(100);
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Center Scanner Visual */}
        <div className="relative mx-auto w-28 h-28 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-ping opacity-75" />
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 border border-slate-700 flex flex-col items-center justify-center shadow-xl">
            <Cpu className="w-8 h-8 text-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-amber-300 mt-1">{progress}%</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>Traitement express : {secondsRemaining}s restantes (&lt; 60s)</span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Génération de vos 20 portraits studio
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Le moteur IA AJ-Labs applique l'éclairage de studio professionnel à vos traits naturels.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-8">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span className="text-amber-400 font-semibold">{steps[currentStepIndex].title}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500 rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Items */}
        <div className="space-y-3 mb-8">
          {steps.map((step, idx) => {
            const isDone = progress >= step.percent;
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  isCurrent
                    ? 'bg-slate-800/80 border-amber-500/50 shadow-md'
                    : isDone
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                    : 'bg-slate-950/20 border-slate-900 opacity-40'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-mono ${
                        isCurrent
                          ? 'border-amber-400 text-amber-300 animate-pulse'
                          : 'border-slate-600 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white flex items-center justify-between">
                    <span>{step.title}</span>
                    {isCurrent && (
                      <span className="text-[10px] text-amber-400 font-mono">En cours...</span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Skip & Security Note */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Aucune donnée conservée après la session</span>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="text-xs text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
          >
            Accélérer et voir les 20 portraits &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
