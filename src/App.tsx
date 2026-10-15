import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SelfieUpload } from './components/SelfieUpload';
import { GenerationModal } from './components/GenerationModal';
import { FilterBar } from './components/FilterBar';
import { HeadshotCard } from './components/HeadshotCard';
import { ComparisonSlider } from './components/ComparisonSlider';
import { DetailModal } from './components/DetailModal';
import { MockupPreviewModal } from './components/MockupPreviewModal';
import { CustomStudioModal } from './components/CustomStudioModal';
import { UnlockModal } from './components/UnlockModal';
import { InstallModal } from './components/InstallModal';
import { INITIAL_HEADSHOTS, SAMPLE_CASUAL_SELFIES } from './data/headshots';
import { HeadshotItem, UploadedSelfie, BackgroundType, ExpressionType, FramingType, HeadshotStyle, RetouchSettings } from './types';
import { downloadHeadshotSingle, downloadAllHeadshotsZip } from './utils/zipDownloader';
import { downloadHeadshotWithWatermark } from './utils/watermark';
import { Sparkles, Download, Layers, ShieldCheck, CheckCircle2, Sliders, RefreshCw, Star, Wand2, Smartphone } from 'lucide-react';

export default function App() {
  // Uploaded selfies state (3 to 5 selfies)
  const [selfies, setSelfies] = useState<UploadedSelfie[]>([]);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Headshots state (20 portraits)
  const [headshots, setHeadshots] = useState<HeadshotItem[]>(INITIAL_HEADSHOTS);

  // Filters state
  const [selectedBg, setSelectedBg] = useState<BackgroundType>('tous');
  const [selectedExpression, setSelectedExpression] = useState<ExpressionType>('tous');
  const [selectedFraming, setSelectedFraming] = useState<FramingType>('tous');
  const [selectedStyle, setSelectedStyle] = useState<HeadshotStyle | 'tous'>('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Active Modals
  const [compareHeadshot, setCompareHeadshot] = useState<HeadshotItem | null>(null);
  const [detailHeadshot, setDetailHeadshot] = useState<HeadshotItem | null>(null);
  const [mockupHeadshot, setMockupHeadshot] = useState<HeadshotItem | null>(null);
  const [showCustomStudio, setShowCustomStudio] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [pendingUnlockItem, setPendingUnlockItem] = useState<HeadshotItem | null>(null);

  // 2 Free 4K unlocks state & 3 Watermarked downloads state
  const [unlockedIds, setUnlockedIds] = useState<string[]>(['hs-01']);
  const [watermarkedIds, setWatermarkedIds] = useState<string[]>([]);

  const handleUnlock = (item: HeadshotItem) => {
    if (unlockedIds.includes(item.id)) {
      downloadHeadshotSingle(item);
      return;
    }
    if (unlockedIds.length < 2) {
      setUnlockedIds((prev) => [...prev, item.id]);
      downloadHeadshotSingle(item);
    } else {
      setPendingUnlockItem(item);
      setShowUnlockModal(true);
    }
  };

  const handleDownloadWatermark = async (item: HeadshotItem) => {
    if (watermarkedIds.includes(item.id)) {
      await downloadHeadshotWithWatermark(item, 'AJ-Labs');
      return;
    }
    if (watermarkedIds.length < 3) {
      setWatermarkedIds((prev) => [...prev, item.id]);
      await downloadHeadshotWithWatermark(item, 'AJ-Labs');
    } else {
      setPendingUnlockItem(item);
      setShowUnlockModal(true);
    }
  };

  const handleSwapItem = (oldId: string, newId: string) => {
    setUnlockedIds((prev) => prev.map((id) => (id === oldId ? newId : id)));
    setPendingUnlockItem(null);
    setShowUnlockModal(false);
    const target = headshots.find((h) => h.id === newId);
    if (target) downloadHeadshotSingle(target);
  };

  // ZIP download progress
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [zipStatusText, setZipStatusText] = useState('');

  // Handlers for selfies
  const handleAddSelfies = (newSelfies: UploadedSelfie[]) => {
    setSelfies((prev) => {
      const combined = [...prev, ...newSelfies];
      return combined.slice(0, 5);
    });
  };

  const handleRemoveSelfie = (id: string) => {
    setSelfies((prev) => prev.filter((s) => s.id !== id));
  };

  const handleLoadSamples = () => {
    setSelfies(SAMPLE_CASUAL_SELFIES);
  };

  const handleStartGeneration = () => {
    if (selfies.length < 3) return;
    setIsGenerating(true);
  };

  const handleGenerationComplete = () => {
    setIsGenerating(false);
    setHasGenerated(true);
    // Smooth scroll to top of gallery
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setHasGenerated(false);
    setSelfies([]);
    setAnalysisResult(null);
    setCompareHeadshot(null);
    setDetailHeadshot(null);
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setHeadshots((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  // Update Retouch Settings for an item
  const handleUpdateRetouch = (id: string, newSettings: RetouchSettings) => {
    setHeadshots((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, retouchSettings: newSettings } : item
      )
    );
  };

  // Download All in ZIP
  const handleDownloadAllZip = async () => {
    setIsZipping(true);
    setZipProgress(0);
    setZipStatusText('Initialisation de l’archive...');

    try {
      await downloadAllHeadshotsZip(headshots, (percent, status) => {
        setZipProgress(percent);
        setZipStatusText(status);
      });
    } catch (error) {
      console.error('Erreur lors du ZIP:', error);
    } finally {
      setTimeout(() => {
        setIsZipping(false);
      }, 1000);
    }
  };

  // Filtered headshots computation
  const filteredHeadshots = useMemo(() => {
    return headshots.filter((item) => {
      // Arrière-plan filter
      if (selectedBg !== 'tous' && item.background !== selectedBg) {
        return false;
      }
      // Expression filter
      if (selectedExpression !== 'tous' && item.expression !== selectedExpression) {
        return false;
      }
      // Cadrage filter
      if (selectedFraming !== 'tous' && item.framing !== selectedFraming) {
        return false;
      }
      // Style filter
      if (selectedStyle !== 'tous' && item.styleKey !== selectedStyle) {
        return false;
      }
      // Favorites only
      if (favoritesOnly && !item.isFavorite) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesStyle = item.styleLabel.toLowerCase().includes(q);
        const matchesLighting = item.lighting.toLowerCase().includes(q);
        const matchesCamera = item.camera.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesStyle && !matchesLighting && !matchesCamera && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [headshots, selectedBg, selectedExpression, selectedFraming, selectedStyle, favoritesOnly, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Header */}
      <Header
        hasResults={hasGenerated}
        onReset={handleReset}
        onOpenZip={() => {
          setPendingUnlockItem(null);
          setShowUnlockModal(true);
        }}
        onOpenInstall={() => setShowInstallModal(true)}
        unlockedCount={unlockedIds.length}
        watermarkedCount={watermarkedIds.length}
        isZipping={isZipping}
      />

      {/* Main Container */}
      <main className="flex-1 w-full">
        {!hasGenerated ? (
          /* Step 1: Upload selfies screen */
          <SelfieUpload
            selfies={selfies}
            onAddSelfies={handleAddSelfies}
            onRemoveSelfie={handleRemoveSelfie}
            onLoadSamples={handleLoadSamples}
            onStartGeneration={handleStartGeneration}
          />
        ) : (
          /* Step 2: Gallery of 20 Portraits screen */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Gallery Top Banner with Biometric Insights */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Shooting terminé avec succès</span>
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    20 portraits générés en 24 secondes
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Votre Galerie de Portraits Professionnels
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                  {analysisResult ? (
                    <span>
                      Morphologie détectée : <strong className="text-white">{analysisResult.faceShape}</strong> • Éclairage recommandé : <strong className="text-amber-300">{analysisResult.lightingAdvice}</strong>
                    </span>
                  ) : (
                    "Sélectionnez n'importe quel portrait pour inspecter les détails 4K, retoucher l'éclairage ou comparer avec vos selfies décontractés."
                  )}
                </p>
              </div>

              {/* Action shortcuts */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCustomStudio(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs sm:text-sm font-bold border border-slate-700 shadow-md transition-all active:scale-95"
                >
                  <Wand2 className="w-4 h-4 text-amber-400" />
                  <span>Tenue sur-mesure (IA)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCompareHeadshot(headshots[0])}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                  <Layers className="w-4 h-4" />
                  <span>Comparateur Avant / Après</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPendingUnlockItem(null);
                    setShowUnlockModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Crédits : {unlockedIds.length}/2 4K • {watermarkedIds.length}/3 Filigranes</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
              selectedBg={selectedBg}
              onChangeBg={setSelectedBg}
              selectedExpression={selectedExpression}
              onChangeExpression={setSelectedExpression}
              selectedFraming={selectedFraming}
              onChangeFraming={setSelectedFraming}
              selectedStyle={selectedStyle}
              onChangeStyle={setSelectedStyle}
              searchQuery={searchQuery}
              onChangeSearch={setSearchQuery}
              favoritesOnly={favoritesOnly}
              onToggleFavoritesOnly={() => setFavoritesOnly(!favoritesOnly)}
              totalCount={headshots.length}
              filteredCount={filteredHeadshots.length}
              onOpenZip={() => {
                setPendingUnlockItem(null);
                setShowUnlockModal(true);
              }}
              onOpenCompare={() => setCompareHeadshot(headshots[0])}
              isZipping={isZipping}
            />

            {/* Results Grid */}
            {filteredHeadshots.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
                <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">
                  Aucun portrait ne correspond aux filtres sélectionnés
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                  Essayez d'élargir vos critères de recherche ou réinitialisez les filtres d'expression et d'arrière-plan.
                </p>
                <button
                  onClick={() => {
                    setSelectedBg('tous');
                    setSelectedExpression('tous');
                    setSelectedFraming('tous');
                    setSelectedStyle('tous');
                    setSearchQuery('');
                    setFavoritesOnly(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl border border-slate-700 transition-colors"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredHeadshots.map((item) => (
                  <HeadshotCard
                    key={item.id}
                    item={item}
                    onDownloadSingle={downloadHeadshotSingle}
                    onDownloadWatermark={handleDownloadWatermark}
                    onOpenCompare={(target) => setCompareHeadshot(target)}
                    onOpenDetail={(target) => setDetailHeadshot(target)}
                    onOpenMockup={(target) => setMockupHeadshot(target)}
                    onUnlock={handleUnlock}
                    isUnlocked={unlockedIds.includes(item.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Generation in Progress Modal */}
      {isGenerating && (
        <GenerationModal
          selfies={selfies}
          onComplete={handleGenerationComplete}
          onAnalysisResult={(analysis) => setAnalysisResult(analysis)}
        />
      )}

      {/* Instant Before/After Comparison Modal */}
      {compareHeadshot && (
        <ComparisonSlider
          headshot={compareHeadshot}
          allHeadshots={headshots}
          selfies={selfies.length > 0 ? selfies : SAMPLE_CASUAL_SELFIES}
          onClose={() => setCompareHeadshot(null)}
          onUpdateRetouch={handleUpdateRetouch}
          onDownloadSingle={downloadHeadshotSingle}
          onSelectHeadshot={(target) => setCompareHeadshot(target)}
        />
      )}

      {/* Detail & Fullscreen Inspection Modal */}
      {detailHeadshot && (
        <DetailModal
          item={detailHeadshot}
          allHeadshots={headshots}
          onClose={() => setDetailHeadshot(null)}
          onSelect={(target) => setDetailHeadshot(target)}
          onDownloadSingle={downloadHeadshotSingle}
          onDownloadWatermark={handleDownloadWatermark}
          onOpenMockup={(target) => {
            setDetailHeadshot(null);
            setMockupHeadshot(target);
          }}
          onUnlock={handleUnlock}
          isUnlocked={unlockedIds.includes(detailHeadshot.id)}
          onToggleFavorite={handleToggleFavorite}
          onUpdateRetouch={handleUpdateRetouch}
        />
      )}

      {/* Live Mockup Preview Modal (LinkedIn / Speaker / Press) */}
      {mockupHeadshot && (
        <MockupPreviewModal
          headshot={mockupHeadshot}
          onClose={() => setMockupHeadshot(null)}
        />
      )}

      {/* Custom Studio Outfit & Setting Modal */}
      {showCustomStudio && (
        <CustomStudioModal
          onClose={() => setShowCustomStudio(false)}
          onAddCustomHeadshot={(newHeadshot) => {
            setHeadshots((prev) => [newHeadshot, ...prev]);
          }}
        />
      )}

      {/* 2 Free 4K Photos Unlock & Payment Modal */}
      {showUnlockModal && (
        <UnlockModal
          unlockedItems={headshots.filter((h) => unlockedIds.includes(h.id))}
          pendingItem={pendingUnlockItem}
          onClose={() => {
            setShowUnlockModal(false);
            setPendingUnlockItem(null);
          }}
          onDownloadSingle={downloadHeadshotSingle}
          onDownloadWatermark={handleDownloadWatermark}
          onSwapItem={handleSwapItem}
          onUnlockPending={(item) => handleUnlock(item)}
          watermarkedCount={watermarkedIds.length}
        />
      )}

      {/* Mobile Install Guide & QR Modal */}
      {showInstallModal && (
        <InstallModal onClose={() => setShowInstallModal(false)} />
      )}

      {/* ZIP Downloading Floating Banner */}
      {isZipping && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/50 rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-sm w-full animate-bounce">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-xs font-bold text-white mb-1">
              <span>Génération de l'archive ZIP</span>
              <span className="font-mono text-amber-400">{zipProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-200"
                style={{ width: `${zipProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-1">{zipStatusText}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">AJ-Labs</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">Écosystème AJ</span>
            <span>•</span>
            <span>2 photos 4K + 3 avec filigrane gratuites</span>
            <span>•</span>
            <span>Résolution native 4K (3840×3840)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Traitement &lt; 60 secondes</span>
            <span>•</span>
            <span>Sans compte requis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
