export type HeadshotStyle = 
  | 'linkedin' 
  | 'founder' 
  | 'creative' 
  | 'outdoor' 
  | 'editorial_bw';

export type BackgroundType = 'tous' | 'bureau' | 'extérieur' | 'studio';

export type ExpressionType = 'tous' | 'souriant' | 'sérieux' | 'confiant';

export type FramingType = 'tous' | 'visage' | 'buste' | 'épaules';

export interface RetouchSettings {
  skinSmooth: number;       // 0 to 100
  lightingBoost: number;    // 0 to 100
  bokehDepth: number;       // 0 to 100
  eyeClarity: number;       // 0 to 100
  blackAndWhite: boolean;
  warmth: number;           // -50 to 50
  contrast: number;         // 0 to 100
}

export interface HeadshotItem {
  id: string;
  title: string;
  styleKey: HeadshotStyle;
  styleLabel: string;
  background: 'bureau' | 'extérieur' | 'studio';
  expression: 'souriant' | 'sérieux' | 'confiant';
  framing: 'visage' | 'buste' | 'épaules';
  lighting: string;
  camera: string;
  focalLength: string;
  aperture: string;
  baseImageUrl: string;
  aspectCrop?: string;
  resolution: string;
  fileSize: string;
  description: string;
  isFavorite?: boolean;
  isUnlocked?: boolean;
  retouchSettings: RetouchSettings;
}

export interface UploadedSelfie {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
  status: 'valid' | 'analyzing' | 'warning';
  quality: {
    lighting: 'Excellente' | 'Bonne' | 'Moyenne';
    angle: 'Face direct' | 'Trois-quarts' | 'Légère inclinaison';
    resolution: 'HD 1080p' | 'Ultra-HD' | 'Standard';
  };
}

export interface GenerationStep {
  id: number;
  title: string;
  description: string;
  durationMs: number;
}
