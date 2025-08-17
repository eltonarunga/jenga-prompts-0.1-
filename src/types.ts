// Core Modes
export enum PromptMode {
  Text = 'text',
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  Code = 'code',
  Multimodal = 'multimodal', // New: Combined modes
}

// === GENERAL TYPES ===

export enum OutputStructure {
  Paragraph = 'descriptive_paragraph',
  BulletPoints = 'bullet_points',
  SimpleJSON = 'simple_json',
  DetailedJSON = 'detailed_json',
  StructuredData = 'structured_data',
  StepByStep = 'step_by_step',
}

export enum ContentTone {
  Neutral = 'neutral',
  Professional = 'professional',
  Casual = 'casual',
  Humorous = 'humorous',
  Dramatic = 'dramatic',
  Whimsical = 'whimsical',
  Serious = 'serious',
  Suspenseful = 'suspenseful',
  Adventurous = 'adventurous',
  Tension = 'tension',
  Offbeat = 'offbeat',
  Surreal = 'surreal',
  Inspirational = 'inspirational',
  Educational = 'educational',
}

export enum Quality {
  Draft = 'draft',
  Standard = 'standard',
  High = 'high',
  Premium = 'premium',
  Production = 'production',
}

// === VISUAL TYPES (IMAGE & VIDEO) ===

export enum AspectRatio {
  Square = '1:1',
  Landscape = '16:9',
  Portrait = '9:16',
  Wide = '4:3',
  Tall = '3:4',
  Photo = '4:5',
  UltraWide = '21:9',
  Mobile = '19.5:9',
  Instagram = '4:5',
  Story = '9:16',
  Custom = 'custom',
}

export enum ImageStyle {
  // Realistic
  Hyperrealistic = 'hyperrealistic',
  Photorealistic = 'photorealistic',
  _35mmFilm = '35mm_film',
  Polaroid = 'polaroid',
  FilmNoir = 'film_noir',
  
  // Artistic
  DigitalArt = 'digital_art',
  ConceptArt = 'concept_art',
  OilPainting = 'oil_painting',
  Watercolor = 'watercolor',
  Sketch = 'sketch',
  LineArt = 'line_art',
  
  // Stylized
  Cinematic = 'cinematic',
  ClassicAnimation = 'classic_animation',
  AnimeStyle = 'anime_style',
  PixelArt = 'pixel_art',
  LowPoly = 'low_poly',
  
  // Modern
  Minimalist = 'minimalist',
  Cyberpunk = 'cyberpunk',
  Synthwave = 'synthwave',
  Vaporwave = 'vaporwave',
  
  // Vintage
  Vintage = 'vintage',
  Retro = 'retro',
  ArtDeco = 'art_deco',
  PopArt = 'pop_art',
}

export enum Lighting {
  // Natural
  NaturalLight = 'natural_light',
  GoldenHour = 'golden_hour',
  BlueHour = 'blue_hour',
  Overcast = 'overcast',
  
  // Studio
  SoftStudio = 'soft_studio',
  HardStudio = 'hard_studio',
  RingLight = 'ring_light',
  Spotlight = 'spotlight',
  
  // Dramatic
  DramaticBacklight = 'dramatic_backlight',
  Silhouette = 'silhouette',
  Chiaroscuro = 'chiaroscuro',
  HighContrast = 'high_contrast',
  
  // Artificial
  HarshDirectFlash = 'harsh_direct_flash',
  NeonGlow = 'neon_glow',
  LedLighting = 'led_lighting',
  Candlelight = 'candlelight',
  
  // Environmental
  Volumetric = 'volumetric',
  Atmospheric = 'atmospheric',
  Underwater = 'underwater',
}

export enum Framing {
  // Distance
  ExtremeCloseUp = 'extreme_close_up',
  CloseUp = 'close_up',
  TightShot = 'tight_shot',
  MediumShot = 'medium_shot',
  MediumWide = 'medium_wide',
  WideShot = 'wide_shot',
  FullBodyShot = 'full_body_shot',
  EstablishingShot = 'establishing_shot',
  
  // Composition
  Centered = 'centered',
  RuleOfThirds = 'rule_of_thirds',
  Cropped = 'cropped',
  Symmetrical = 'symmetrical',
  OffCenter = 'off_center',
  
  // Style
  Cinematic = 'cinematic',
  Documentary = 'documentary',
  Portrait = 'portrait',
}

export enum CameraAngle {
  // Horizontal
  Frontal = 'frontal',
  Profile = 'profile',
  ThreeQuarter = 'three_quarter',
  
  // Vertical
  EyeLevel = 'eye_level',
  LowAngle = 'low_angle',
  HighAngle = 'high_angle',
  WormsEye = 'worms_eye',
  BirdsEyeView = 'birds_eye_view',
  TopDown = 'top_down',
  
  // Dynamic
  DutchAngle = 'dutch_angle',
  DiagonalAngle = 'diagonal_angle',
  OverShoulder = 'over_shoulder',
}

export enum CameraResolution {
  Standard = 'standard',
  HD = 'hd_720p',
  FullHD = 'full_hd_1080p',
  TwoK = '2k_1440p',
  FourK = '4k_2160p',
  EightK = '8k_4320p',
  Hyperdetailed = 'hyperdetailed',
  Raw = 'raw',
}

// === VIDEO-SPECIFIC TYPES ===

export enum PointOfView {
  // Camera Movement
  StaticShot = 'static_shot',
  Pan = 'pan',
  Tilt = 'tilt',
  Zoom = 'zoom',
  Dolly = 'dolly',
  TrackingShot = 'tracking_shot',
  Handheld = 'handheld',
  Steadicam = 'steadicam',
  
  // Perspective
  FirstPerson = 'first_person_pov',
  ThirdPerson = 'third_person',
  OverShoulder = 'over_shoulder',
  Aerial = 'aerial',
  Drone = 'drone',
  
  // Special
  TimeRemap = 'time_remap',
  SlowMotion = 'slow_motion',
  FastForward = 'fast_forward',
  Freeze = 'freeze_frame',
}

export enum VideoDuration {
  Short = '3-5 seconds',
  Medium = '10-15 seconds',
  Long = '30-60 seconds',
  Extended = '2+ minutes',
  Custom = 'custom',
}

// === AUDIO TYPES ===

export enum AudioType {
  Music = 'music',
  Speech = 'speech',
  SoundEffect = 'sound_effect',
  Ambient = 'ambient',
  Voiceover = 'voiceover',
  Podcast = 'podcast',
}

export enum AudioVibe {
  // Energy
  Upbeat = 'upbeat',
  Energetic = 'energetic',
  Calm = 'calm',
  Relaxing = 'relaxing',
  
  // Emotion
  Melancholy = 'melancholy',
  Joyful = 'joyful',
  Nostalgic = 'nostalgic',
  Romantic = 'romantic',
  
  // Atmosphere
  Atmospheric = 'atmospheric',
  Cinematic = 'cinematic_audio',
  Suspenseful = 'suspenseful',
  Epic = 'epic',
  Dark = 'dark',
  
  // Style
  Minimalist = 'minimalist',
  Electronic = 'electronic',
  Orchestral = 'orchestral',
  Acoustic = 'acoustic',
}

export enum AudioFormat {
  MP3 = 'mp3',
  WAV = 'wav',
  FLAC = 'flac',
  AAC = 'aac',
  OGG = 'ogg',
}

// === CODE TYPES ===

export enum CodeLanguage {
  // Web Development
  JavaScript = 'javascript',
  TypeScript = 'typescript',
  HTML = 'html',
  CSS = 'css',
  React = 'react',
  Vue = 'vue',
  
  // Backend
  Python = 'python',
  Java = 'java',
  CSharp = 'csharp',
  Go = 'go',
  Rust = 'rust',
  PHP = 'php',
  Ruby = 'ruby',
  
  // Systems
  C = 'c',
  CPlusPlus = 'cpp',
  Shell = 'shell',
  PowerShell = 'powershell',
  
  // Data
  SQL = 'sql',
  R = 'r',
  Matlab = 'matlab',
  
  // Mobile
  Swift = 'swift',
  Kotlin = 'kotlin',
  Dart = 'dart',
  
  // Other
  JSON = 'json',
  YAML = 'yaml',
  Markdown = 'markdown',
}

export enum CodeTask {
  Generate = 'generate_code',
  Debug = 'debug_code',
  Refactor = 'refactor_code',
  Optimize = 'optimize_code',
  Explain = 'explain_code',
  Document = 'document_code',
  Test = 'write_tests',
  Review = 'code_review',
  Convert = 'convert_language',
  Migrate = 'migrate_code',
}

export enum CodeComplexity {
  Simple = 'simple',
  Intermediate = 'intermediate',
  Complex = 'complex',
  Expert = 'expert',
}

// === TEXT TYPES ===

export enum TextType {
  Article = 'article',
  BlogPost = 'blog_post',
  Essay = 'essay',
  Story = 'story',
  Poem = 'poem',
  Script = 'script',
  Email = 'email',
  Letter = 'letter',
  Report = 'report',
  Summary = 'summary',
  Review = 'review',
  Tutorial = 'tutorial',
  Documentation = 'documentation',
}

export enum WritingStyle {
  Academic = 'academic',
  Conversational = 'conversational',
  Technical = 'technical',
  Creative = 'creative',
  Journalistic = 'journalistic',
  Marketing = 'marketing',
  Storytelling = 'storytelling',
  Instructional = 'instructional',
}

// === ENHANCED INTERFACES ===

export interface EnhancedPromptResult {
  id: string;
  primaryResult: string;
  jsonResult?: string;
  metadata: ResultMetadata;
  alternatives?: string[];
  confidence: number; // 0-1 scale
  processingTime: number; // milliseconds
  tokensUsed?: number;
}

export interface ResultMetadata {
  model: string;
  version: string;
  parameters: Record<string, any>;
  generatedAt: string;
  modality: PromptMode;
  quality: Quality;
}

// Mode-specific option interfaces for better type safety
export interface ImageOptions {
  aspectRatio: AspectRatio;
  imageStyle: ImageStyle;
  lighting: Lighting;
  framing: Framing;
  cameraAngle: CameraAngle;
  resolution: CameraResolution;
  quality: Quality;
  negativePrompt?: string;
  seed?: number;
  steps?: number;
}

export interface VideoOptions {
  aspectRatio: AspectRatio;
  pov: PointOfView;
  duration: VideoDuration;
  resolution: CameraResolution;
  fps?: number;
  quality: Quality;
  loop?: boolean;
  motionIntensity?: 'low' | 'medium' | 'high';
}

export interface AudioOptions {
  audioType: AudioType;
  audioVibe: AudioVibe;
  format: AudioFormat;
  duration?: number; // seconds
  quality: Quality;
  tempo?: number; // BPM
  key?: string; // Musical key
  instruments?: string[];
}

export interface CodeOptions {
  language: CodeLanguage;
  task: CodeTask;
  complexity: CodeComplexity;
  style?: 'clean' | 'verbose' | 'minimal';
  includeComments: boolean;
  includeTests: boolean;
  framework?: string;
  version?: string;
}

export interface TextOptions {
  textType: TextType;
  writingStyle: WritingStyle;
  wordCount?: number;
  targetAudience?: string;
  keywords?: string[];
  includeOutline: boolean;
  citations?: boolean;
}

// Union type for all options
export type ModeSpecificOptions = 
  | ImageOptions 
  | VideoOptions 
  | AudioOptions 
  | CodeOptions 
  | TextOptions;

// Enhanced history item with better type safety
export interface PromptHistoryItem {
  id: string;
  timestamp: number;
  mode: PromptMode;
  userPrompt: string;
  result: EnhancedPromptResult;
  options: {
    contentTone: ContentTone;
    outputStructure: OutputStructure;
    additionalDetails?: string;
    modeSpecific: ModeSpecificOptions;
  };
  tags?: string[];
  favorite?: boolean;
  shared?: boolean;
  rating?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

// Utility types for better development experience
export type ModeOptionsMap = {
  [PromptMode.Image]: ImageOptions;
  [PromptMode.Video]: VideoOptions;
  [PromptMode.Audio]: AudioOptions;
  [PromptMode.Code]: CodeOptions;
  [PromptMode.Text]: TextOptions;
  [PromptMode.Multimodal]: Partial<ImageOptions & VideoOptions & AudioOptions>;
};

// Type guards for runtime type checking
export function isImageOptions(options: ModeSpecificOptions): options is ImageOptions {
  return 'aspectRatio' in options && 'imageStyle' in options;
}

export function isVideoOptions(options: ModeSpecificOptions): options is VideoOptions {
  return 'pov' in options && 'duration' in options;
}

export function isAudioOptions(options: ModeSpecificOptions): options is AudioOptions {
  return 'audioType' in options && 'audioVibe' in options;
}

export function isCodeOptions(options: ModeSpecificOptions): options is CodeOptions {
  return 'language' in options && 'task' in options;
}

export function isTextOptions(options: ModeSpecificOptions): options is TextOptions {
  return 'textType' in options && 'writingStyle' in options;
}

// Constants for default values
export const DEFAULT_OPTIONS = {
  [PromptMode.Image]: {
    aspectRatio: AspectRatio.Square,
    imageStyle: ImageStyle.Hyperrealistic,
    lighting: Lighting.NaturalLight,
    framing: Framing.MediumShot,
    cameraAngle: CameraAngle.EyeLevel,
    resolution: CameraResolution.FourK,
    quality: Quality.High,
  } as ImageOptions,
  
  [PromptMode.Video]: {
    aspectRatio: AspectRatio.Landscape,
    pov: PointOfView.ThirdPerson,
    duration: VideoDuration.Medium,
    resolution: CameraResolution.FourK,
    quality: Quality.High,
  } as VideoOptions,
  
  [PromptMode.Audio]: {
    audioType: AudioType.Music,
    audioVibe: AudioVibe.Upbeat,
    format: AudioFormat.MP3,
    quality: Quality.High,
  } as AudioOptions,
  
  [PromptMode.Code]: {
    language: CodeLanguage.JavaScript,
    task: CodeTask.Generate,
    complexity: CodeComplexity.Intermediate,
    includeComments: true,
    includeTests: false,
  } as CodeOptions,
  
  [PromptMode.Text]: {
    textType: TextType.Article,
    writingStyle: WritingStyle.Conversational,
    includeOutline: false,
  } as TextOptions,
} as const;

// Export everything for easy importing
export * from './types';