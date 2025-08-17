import { 
  PromptMode, 
  ImageStyle, 
  Lighting, 
  Framing, 
  CameraAngle, 
  ContentTone, 
  PointOfView, 
  CameraResolution, 
  AspectRatio 
} from './types';

export interface PromptTemplate {
  id: string; // Unique identifier
  title: string;
  description: string;
  prompt: string;
  mode: PromptMode;
  category: TemplateCategory; // New categorization
  tags: string[]; // For filtering and search
  difficulty: DifficultyLevel; // User experience level
  estimatedTime?: number; // Generation time in seconds
  
  // Visual modifiers
  imageStyle?: ImageStyle;
  lighting?: Lighting;
  framing?: Framing;
  cameraAngle?: CameraAngle;
  contentTone?: ContentTone;
  pov?: PointOfView;
  resolution?: CameraResolution;
  aspectRatio?: AspectRatio;
  
  // Advanced options
  variations?: PromptVariation[]; // Alternative versions
  requiredParameters?: string[]; // Parameters user must fill
  compatibility?: string[]; // Compatible AI models
  
  // Metadata
  created: string;
  popularity?: number; // Usage statistics
  featured?: boolean;
}

export enum TemplateCategory {
  Portrait = 'portrait',
  Landscape = 'landscape',
  Character = 'character',
  Product = 'product',
  Architecture = 'architecture',
  Abstract = 'abstract',
  Vintage = 'vintage',
  Cinematic = 'cinematic',
  Action = 'action',
  Nature = 'nature',
  Fantasy = 'fantasy',
  Documentary = 'documentary'
}

export enum DifficultyLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced'
}

export interface PromptVariation {
  name: string;
  description: string;
  modifiedPrompt: string;
  styleOverrides?: Partial<PromptTemplate>;
}

// Template validation utility
export class TemplateValidator {
  static validate(template: PromptTemplate): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    if (!template.id) errors.push('Template ID is required');
    if (!template.title) errors.push('Title is required');
    if (!template.prompt) errors.push('Prompt is required');
    if (!template.mode) errors.push('Mode is required');

    // Mode-specific validation
    if (template.mode === PromptMode.Video) {
      if (!template.pov) warnings.push('Point of view recommended for video templates');
      if (!template.resolution) warnings.push('Resolution recommended for video templates');
    }

    // Logical consistency checks
    if (template.imageStyle === ImageStyle.Polaroid && template.lighting === Lighting.SoftStudio) {
      warnings.push('Soft studio lighting may not match polaroid aesthetic');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Enhanced template collection with better organization
export const templates: PromptTemplate[] = [
  // === PORTRAIT & CHARACTER TEMPLATES ===
  {
    id: 'polaroid-portrait',
    title: 'Realistic Polaroid Photo',
    description: 'Generates a realistic, awkwardly-framed polaroid with harsh flash and film texture.',
    prompt: 'a cat sleeping on a bookshelf',
    mode: PromptMode.Image,
    category: TemplateCategory.Portrait,
    tags: ['vintage', 'polaroid', 'film', 'casual'],
    difficulty: DifficultyLevel.Beginner,
    estimatedTime: 30,
    imageStyle: ImageStyle.Polaroid,
    lighting: Lighting.HarshDirectFlash,
    framing: Framing.Cropped,
    cameraAngle: CameraAngle.DutchAngle,
    aspectRatio: AspectRatio.Square,
    compatibility: ['dalle_3', 'midjourney_v7'],
    created: '2024-01-15',
    popularity: 85,
    featured: true,
    variations: [
      {
        name: 'Faded Polaroid',
        description: 'Aged version with yellowed edges',
        modifiedPrompt: 'a cat sleeping on a bookshelf, faded vintage polaroid with yellowed edges',
      }
    ]
  },
  {
    id: 'disney-character',
    title: 'Classic Disney Character',
    description: 'Transforms a character description into the classic, hand-drawn Disney animation style.',
    prompt: 'a friendly librarian with glasses',
    mode: PromptMode.Image,
    category: TemplateCategory.Character,
    tags: ['disney', 'animation', 'cartoon', 'character'],
    difficulty: DifficultyLevel.Intermediate,
    estimatedTime: 45,
    imageStyle: ImageStyle.ClassicAnimation,
    contentTone: ContentTone.Whimsical,
    framing: Framing.MediumShot,
    lighting: Lighting.SoftStudio,
    compatibility: ['dalle_3', 'midjourney_v7'],
    created: '2024-01-10',
    popularity: 92,
    featured: true
  },
  {
    id: 'yearbook-photo',
    title: 'Awkward 90\'s Yearbook Photo',
    description: 'Generates a cheesy, awkward 1990s high school yearbook photo with a laser background.',
    prompt: 'a teenager with braces and a mullet',
    mode: PromptMode.Image,
    category: TemplateCategory.Portrait,
    tags: ['90s', 'yearbook', 'retro', 'humorous', 'school'],
    difficulty: DifficultyLevel.Beginner,
    estimatedTime: 35,
    imageStyle: ImageStyle._35mmFilm,
    lighting: Lighting.HarshDirectFlash,
    framing: Framing.TightShot,
    cameraAngle: CameraAngle.Frontal,
    contentTone: ContentTone.Humorous,
    aspectRatio: AspectRatio.Portrait,
    compatibility: ['dalle_3', 'midjourney_v7'],
    created: '2024-01-08',
    popularity: 78
  },

  // === PRODUCT & OBJECT TEMPLATES ===
  {
    id: 'lego-house',
    title: 'Your Home As A LEGO Set',
    description: 'Renders a house as a photorealistic LEGO Creator Expert playset, complete with box art.',
    prompt: 'a cozy, two-story suburban house with a large front porch',
    mode: PromptMode.Image,
    category: TemplateCategory.Product,
    tags: ['lego', 'toy', 'architecture', 'realistic'],
    difficulty: DifficultyLevel.Advanced,
    estimatedTime: 60,
    imageStyle: ImageStyle.Hyperrealistic,
    lighting: Lighting.SoftStudio,
    framing: Framing.EstablishingShot,
    aspectRatio: AspectRatio.Landscape,
    compatibility: ['dalle_3', 'runway_gen3'],
    created: '2024-01-12',
    popularity: 88,
    featured: true,
    requiredParameters: ['house_description']
  },
  {
    id: 'beanie-baby',
    title: 'Collectible Beanie Baby',
    description: 'Creates a photo of a custom, 1990s-style collectible Beanie Baby plush toy with a tag.',
    prompt: 'a cute golden retriever puppy',
    mode: PromptMode.Image,
    category: TemplateCategory.Product,
    tags: ['beanie baby', 'collectible', '90s', 'plush', 'toy'],
    difficulty: DifficultyLevel.Intermediate,
    estimatedTime: 40,
    imageStyle: ImageStyle.Hyperrealistic,
    lighting: Lighting.SoftStudio,
    framing: Framing.TightShot,
    contentTone: ContentTone.Whimsical,
    aspectRatio: AspectRatio.Square,
    compatibility: ['dalle_3', 'midjourney_v7'],
    created: '2024-01-05',
    popularity: 71
  },

  // === VIDEO TEMPLATES ===
  {
    id: 'cinematic-drone',
    title: 'Cinematic Drone Shot',
    description: 'A sweeping, epic drone shot revealing a dramatic landscape.',
    prompt: 'mist-covered mountain range at sunrise with ancient ruins',
    mode: PromptMode.Video,
    category: TemplateCategory.Cinematic,
    tags: ['drone', 'landscape', 'cinematic', 'epic'],
    difficulty: DifficultyLevel.Advanced,
    estimatedTime: 300,
    pov: PointOfView.Aerial,
    resolution: CameraResolution.EightK,
    contentTone: ContentTone.Adventurous,
    aspectRatio: AspectRatio.Landscape,
    compatibility: ['sora', 'runway_gen3'],
    created: '2024-01-20',
    popularity: 94,
    featured: true
  },
  {
    id: 'action-chase',
    title: 'Tense Action Scene',
    description: 'A short, fast-paced action sequence with a suspenseful tone.',
    prompt: 'running through a narrow, rain-soaked alley at night',
    mode: PromptMode.Video,
    category: TemplateCategory.Action,
    tags: ['action', 'chase', 'suspense', 'urban'],
    difficulty: DifficultyLevel.Intermediate,
    estimatedTime: 240,
    pov: PointOfView.FirstPerson,
    contentTone: ContentTone.Tension,
    resolution: CameraResolution.HD,
    aspectRatio: AspectRatio.Landscape,
    compatibility: ['runway_gen3', 'pika'],
    created: '2024-01-18',
    popularity: 82
  },
  {
    id: 'fairy-intro',
    title: 'Whimsical Character Intro',
    description: 'A charming introduction to a magical, whimsical character.',
    prompt: 'a tiny, glowing fairy asleep inside a flower that is slowly blooming',
    mode: PromptMode.Video,
    category: TemplateCategory.Fantasy,
    tags: ['fantasy', 'fairy', 'whimsical', 'magic', 'nature'],
    difficulty: DifficultyLevel.Intermediate,
    estimatedTime: 180,
    pov: PointOfView.Dolly,
    contentTone: ContentTone.Whimsical,
    resolution: CameraResolution.FourK,
    aspectRatio: AspectRatio.Square,
    compatibility: ['sora', 'veo_3'],
    created: '2024-01-16',
    popularity: 89,
    featured: true
  }
];

// Utility functions for template management
export class TemplateManager {
  static getByCategory(category: TemplateCategory): PromptTemplate[] {
    return templates.filter(t => t.category === category);
  }

  static getByDifficulty(difficulty: DifficultyLevel): PromptTemplate[] {
    return templates.filter(t => t.difficulty === difficulty);
  }

  static getFeatured(): PromptTemplate[] {
    return templates.filter(t => t.featured === true);
  }

  static searchByTags(tags: string[]): PromptTemplate[] {
    return templates.filter(t => 
      tags.some(tag => t.tags.includes(tag.toLowerCase()))
    );
  }

  static getByMode(mode: PromptMode): PromptTemplate[] {
    return templates.filter(t => t.mode === mode);
  }

  static getCompatible(aiModel: string): PromptTemplate[] {
    return templates.filter(t => 
      !t.compatibility || t.compatibility.includes(aiModel)
    );
  }

  static getPopular(limit: number = 10): PromptTemplate[] {
    return templates
      .filter(t => t.popularity !== undefined)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit);
  }
}

// Export categories and utilities for easy access
export { TemplateCategory, DifficultyLevel, TemplateManager, TemplateValidator };