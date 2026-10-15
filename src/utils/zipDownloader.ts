import JSZip from 'jszip';
import { HeadshotItem } from '../types';

export async function downloadHeadshotSingle(item: HeadshotItem): Promise<void> {
  try {
    const response = await fetch(item.baseImageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    
    // Clean safe filename
    const safeTitle = item.title.replace(/[^a-zA-Z0-9_\-]/g, '_');
    a.download = `${safeTitle}_4K_StudioHeadshot.jpg`;
    
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Erreur de téléchargement unique:', error);
    // Direct link fallback
    const a = document.createElement('a');
    a.href = item.baseImageUrl;
    a.download = `${item.title}.jpg`;
    a.target = '_blank';
    a.click();
  }
}

export async function downloadAllHeadshotsZip(
  items: HeadshotItem[],
  onProgress?: (percent: number, currentItem: string) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('StudioHeadshots_20_Portraits_4K') || zip;

  let loaded = 0;
  const total = items.length;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const indexStr = String(i + 1).padStart(2, '0');
    const safeTitle = item.title.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const filename = `${indexStr}_${safeTitle}_4K.jpg`;

    if (onProgress) {
      onProgress(Math.round(((i) / total) * 90), item.title);
    }

    try {
      const response = await fetch(item.baseImageUrl);
      const blob = await response.blob();
      folder.file(filename, blob);
    } catch (err) {
      console.warn(`Could not fetch image for ${filename}, skipping`, err);
    }

    loaded++;
  }

  // Include a helpful Readme & License note
  const readmeContent = `========================================================
STUDIOHEADSHOT AI - PACK OFFICIEL 20 PORTRAITS HAUTE RÉSOLUTION (4K)
========================================================

Félicitations pour votre nouvelle collection de portraits professionnels !

CONTENU DE L'ARCHIVE :
- 20 portraits professionnels calibrés (LinkedIn, Fondateur, Créatif, Candid, N&B Harcourt)
- Résolution native : 3840 x 3840 px (Ultra-HD 4K)
- Métadonnées complètes de prise de vue studio (85mm, f/1.4, Softbox & Rimlight)

CONSEILS D'USAGE :
1. LinkedIn : Préférez le fichier "01_LinkedIn_Corporate_Executive_4K.jpg" ou "02_LinkedIn_Cadre_Superieur_4K.jpg".
2. Site Web & Bio Fondateur : Utilisez le style "Bio Fondateur Startup Loft".
3. Dossier de presse & Interviews : Les versions Harcourt Noir & Blanc offrent un prestige intemporel.
4. Réseaux sociaux & Twitter/X : Les portraits Candid extérieur apportent authenticité et sympathie.

DROITS :
Vous détenez 100% des droits commerciaux et personnels d'utilisation de ces portraits.
Généré avec StudioHeadshot AI.
========================================================`;

  folder.file('LISEZMOI_CONSEILS_USAGE.txt', readmeContent);

  if (onProgress) {
    onProgress(95, 'Création de l’archive ZIP...');
  }

  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  if (onProgress) {
    onProgress(100, 'Téléchargement prêt !');
  }

  const zipUrl = window.URL.createObjectURL(content);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = zipUrl;
  a.download = `StudioHeadshots_20_Portraits_4K.zip`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(zipUrl);
  document.body.removeChild(a);
}
