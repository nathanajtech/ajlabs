import React, { useState } from 'react';
import { X, Download, Linkedin, Award, Newspaper, Check, Sparkles, User, Briefcase, Building2, MapPin } from 'lucide-react';
import { HeadshotItem } from '../types';

interface MockupPreviewModalProps {
  headshot: HeadshotItem;
  onClose: () => void;
}

export const MockupPreviewModal: React.FC<MockupPreviewModalProps> = ({
  headshot,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'speaker' | 'press'>('linkedin');
  const [userName, setUserName] = useState('Alexandre Laurent');
  const [userTitle, setUserTitle] = useState('Fondateur & CEO • NextGen Tech');
  const [userCompany, setUserCompany] = useState('Paris, France • 500+ relations');
  const [badgeType, setBadgeType] = useState<'none' | 'opentowork' | 'hiring' | 'topvoice'>('topvoice');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Simulateur de Rendu Réel (Mockup)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Prévisualisation en situation
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Visualisez immédiatement l'impact de ce portrait dans votre profil LinkedIn, votre badge de conférence ou un article de presse.
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

        {/* Tab Switcher & Edit inputs */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/40 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('linkedin')}
              className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'linkedin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>Profil LinkedIn</span>
            </button>
            <button
              onClick={() => setActiveTab('speaker')}
              className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'speaker'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Badge Conférencier</span>
            </button>
            <button
              onClick={() => setActiveTab('press')}
              className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'press'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Article de Presse (Bio)</span>
            </button>
          </div>

          {/* Quick Info editor */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Votre nom"
              className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
            />
            <input
              type="text"
              value={userTitle}
              onChange={(e) => setUserTitle(e.target.value)}
              placeholder="Votre poste / titre"
              className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400 max-w-[200px]"
            />
          </div>
        </div>

        {/* Mockup Canvas Area */}
        <div className="p-6 sm:p-10 flex-1 flex items-center justify-center bg-slate-950/80 overflow-y-auto">
          {activeTab === 'linkedin' && (
            <div className="w-full max-w-xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-300">
              {/* LinkedIn Cover Banner */}
              <div className="h-32 sm:h-40 bg-gradient-to-r from-slate-800 via-indigo-950 to-blue-900 relative p-4 flex items-end justify-end">
                <span className="text-[10px] font-mono text-white/50 tracking-wider">
                  Bannière LinkedIn 1584 × 396 px
                </span>
              </div>

              {/* Profile Details */}
              <div className="px-6 pb-6 relative pt-0">
                {/* Avatar with selected badge */}
                <div className="relative -mt-16 sm:-mt-20 w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-xl bg-slate-200 overflow-hidden">
                  <img
                    src={headshot.baseImageUrl}
                    alt={headshot.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Badge border overlay */}
                  {badgeType === 'opentowork' && (
                    <div className="absolute inset-0 rounded-full border-[6px] border-emerald-500/90 pointer-events-none flex items-end justify-center pb-1">
                      <span className="bg-emerald-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                        #OpenToWork
                      </span>
                    </div>
                  )}
                  {badgeType === 'hiring' && (
                    <div className="absolute inset-0 rounded-full border-[6px] border-blue-600/90 pointer-events-none flex items-end justify-center pb-1">
                      <span className="bg-blue-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                        #Hiring
                      </span>
                    </div>
                  )}
                </div>

                {/* Name & Headline */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl font-bold text-slate-900">{userName}</h4>
                    {badgeType === 'topvoice' && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                        Top Voice 🌟
                      </span>
                    )}
                    <span className="text-xs text-blue-600 font-semibold">• 1er</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{userTitle}</p>
                  <p className="text-xs text-slate-500">{userCompany}</p>
                </div>

                {/* Action buttons on mock */}
                <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  <span className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-sm">
                    Message
                  </span>
                  <span className="px-4 py-1.5 rounded-full border border-slate-400 text-slate-700 text-xs font-bold">
                    En savoir plus
                  </span>
                  <span className="px-4 py-1.5 rounded-full border border-slate-400 text-slate-700 text-xs font-bold">
                    ... Plus
                  </span>
                </div>

                {/* Badge selector toggles */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Badge de profil :</span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { key: 'none', label: 'Aucun' },
                      { key: 'topvoice', label: 'Top Voice' },
                      { key: 'opentowork', label: 'Open to Work' },
                      { key: 'hiring', label: 'Hiring' },
                    ].map((b) => (
                      <button
                        key={b.key}
                        onClick={() => setBadgeType(b.key as any)}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                          badgeType === b.key
                            ? 'bg-slate-900 text-white font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'speaker' && (
            <div className="w-full max-w-md bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-500/40 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl" />
              <div className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-widest border border-amber-400/40 mb-4">
                KEYNOTE SPEAKER • AI SUMMIT 2026
              </div>

              <div className="relative mx-auto w-36 h-36 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl mb-4">
                <img
                  src={headshot.baseImageUrl}
                  alt={headshot.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h4 className="text-2xl font-black text-white tracking-tight">{userName}</h4>
              <p className="text-sm text-amber-300 font-semibold mt-1">{userTitle}</p>
              <p className="text-xs text-slate-400 mt-3 max-w-xs mx-auto leading-relaxed">
                "Bâtir l'avenir de l'intelligence artificielle appliquée aux entreprises de demain."
              </p>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                PASS VIP ACCRÉDITÉ • SCÈNE PRINCIPALE
              </div>
            </div>
          )}

          {activeTab === 'press' && (
            <div className="w-full max-w-lg bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                <span className="font-serif font-black text-xl tracking-tight text-slate-900">
                  LES ÉCHOS • PORTRAIT D'ENTREPRENEUR
                </span>
                <span className="text-[10px] text-slate-400 font-mono">ÉDITION SPÉCIALE</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-full sm:w-44 aspect-square rounded-xl overflow-hidden shadow-lg border border-slate-300 shrink-0">
                  <img
                    src={headshot.baseImageUrl}
                    alt={headshot.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                    Leader de la semaine
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 leading-tight">
                    Comment {userName} réinvente les standards de son industrie
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    À la tête de son organisation, {userName} s'impose comme une figure incontournable grâce à une vision audacieuse et une exécution sans compromis.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Style actuel : <strong className="text-white">{headshot.title}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
          >
            Fermer le simulateur
          </button>
        </div>
      </div>
    </div>
  );
};
