import { 
  ContentTone, 
  PointOfView, 
  AspectRatio, 
  ImageStyle, 
  Lighting, 
  Framing, 
  CameraAngle, 
  CameraResolution, 
  AudioType, 
  AudioVibe, 
  CodeLanguage, 
  CodeTask, 
  OutputStructure,
  PromptMode 
} from './types';

// Base interface for option items
interface OptionItem {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
  group?: string;
}

// Enhanced option creation helpers
const createOption = (value: string, label?: string, description?: string): OptionItem => ({
  value,
  label: label || value,
  description
});

const createOptionsFromEnum = <T extends Record<string, string>>(
  enumObject: T,
  labelOverrides: Partial<Record<keyof T, string>> = {},
  descriptions: Partial<Record<keyof T, string>> = {}
): OptionItem[] => {
  return Object.entries(enumObject).map(([key, value]) => ({
    value: value as string,
    label: labelOverrides[key as keyof T] || value,
    description: descriptions[key as keyof T]
  }));
};

// Content & Structure Options
export const TONE_OPTIONS = createOptionsFromEnum(ContentTone, {
  [ContentTone.Professional]: 'Professional',
  [ContentTone.Casual]: 'Casual & Friendly',
  [ContentTone.Creative]: 'Creative & Artistic',
  [ContentTone.Technical]: 'Technical & Precise'
}, {
  [ContentTone.Professional]: 'Formal, business-appropriate tone',
  [ContentTone.Casual]: 'Relaxed, conversational style',
  [ContentTone.Creative]: 'Imaginative and expressive',
  [ContentTone.Technical]: 'Detailed, specification-focused'
});

export const OUTPUT_STRUCTURE_OPTIONS = createOptionsFromEnum(OutputStructure, {
  [OutputStructure.Paragraph]: 'Paragraph',
  [OutputStructure.List]: 'Bulleted List',
  [OutputStructure.Structured]: 'Structured Format'
}, {
  [OutputStructure.Paragraph]: 'Continuous prose format',
  [OutputStructure.List]: 'Easy-to-scan bullet points',
  [OutputStructure.Structured]: 'Organized sections with headers'
});

export const POV_OPTIONS = createOptionsFromEnum(PointOfView, {
  [PointOfView.FirstPerson]: 'First Person (I/We)',
  [PointOfView.SecondPerson]: 'Second Person (You)',
  [PointOfView.ThirdPerson]: 'Third Person (They/It)'
}, {
  [PointOfView.FirstPerson]: 'Personal perspective',
  [PointOfView.SecondPerson]: 'Direct address to viewer',
  [PointOfView.ThirdPerson]: 'Objective, external view'
});

// Image-specific Options
export const ASPECT_RATIO_OPTIONS: OptionItem[] = [
  { label: 'Square (1:1)', value: AspectRatio.Square, description: 'Perfect for social media posts' },
  { label: 'Landscape (16:9)', value: AspectRatio.Landscape, description: 'Widescreen format, great for backgrounds' },
  { label: 'Portrait (9:16)', value: AspectRatio.Portrait, description: 'Mobile-friendly vertical format' },
  { label: 'Photo (4:5)', value: AspectRatio.Photo, description: 'Instagram-style photo ratio' },
  { label: 'Wide (4:3)', value: AspectRatio.Wide, description: 'Classic photography format' },
  { label: 'Tall (3:4)', value: AspectRatio.Tall, description: 'Vertical orientation for prints' },
];

export const IMAGE_STYLE_OPTIONS = createOptionsFromEnum(ImageStyle, {
  [ImageStyle.Photorealistic]: 'Photorealistic',
  [ImageStyle.Cinematic]: 'Cinematic',
  [ImageStyle.Artistic]: 'Artistic',
  [ImageStyle.Cartoon]: 'Cartoon/Animated'
}, {
  [ImageStyle.Photorealistic]: 'Lifelike, camera-quality images',
  [ImageStyle.Cinematic]: 'Movie-like dramatic styling',
  [ImageStyle.Artistic]: 'Painterly, creative interpretation',
  [ImageStyle.Cartoon]: 'Stylized, animated appearance'
});

export const LIGHTING_OPTIONS = createOptionsFromEnum(Lighting, {
  [Lighting.Natural]: 'Natural Light',
  [Lighting.GoldenHour]: 'Golden Hour',
  [Lighting.Dramatic]: 'Dramatic',
  [Lighting.Soft]: 'Soft Lighting'
}, {
  [Lighting.Natural]: 'Even, daylight illumination',
  [Lighting.GoldenHour]: 'Warm, sunset-like glow',
  [Lighting.Dramatic]: 'High contrast with strong shadows',
  [Lighting.Soft]: 'Gentle, diffused lighting'
});

export const FRAMING_OPTIONS = createOptionsFromEnum(Framing, {
  [Framing.CloseUp]: 'Close-up',
  [Framing.MediumShot]: 'Medium Shot',
  [Framing.WideShot]: 'Wide Shot',
  [Framing.Extreme]: 'Extreme Wide'
}, {
  [Framing.CloseUp]: 'Focus on details and expressions',
  [Framing.MediumShot]: 'Balanced view of subject and context',
  [Framing.WideShot]: 'Full scene with environmental context',
  [Framing.Extreme]: 'Vast, panoramic perspective'
});

export const CAMERA_ANGLE_OPTIONS = createOptionsFromEnum(CameraAngle, {
  [CameraAngle.Frontal]: 'Frontal',
  [CameraAngle.Profile]: 'Profile/Side',
  [CameraAngle.LowAngle]: 'Low Angle',
  [CameraAngle.HighAngle]: 'High Angle'
}, {
  [CameraAngle.Frontal]: 'Straight-on, eye-level view',
  [CameraAngle.Profile]: 'Side perspective',
  [CameraAngle.LowAngle]: 'Looking up, dramatic effect',
  [CameraAngle.HighAngle]: 'Looking down, overview perspective'
});

export const CAMERA_RESOLUTION_OPTIONS = createOptionsFromEnum(CameraResolution, {
  [CameraResolution.Standard]: 'Standard Quality',
  [CameraResolution.HD]: 'High Definition',
  [CameraResolution.FourK]: '4K Ultra HD',
  [CameraResolution.Hyperdetailed]: 'Hyper-detailed'
}, {
  [CameraResolution.Standard]: 'Good quality for most uses',
  [CameraResolution.HD]: 'Sharp, clear details',
  [CameraResolution.FourK]: 'Ultra-high resolution',
  [CameraResolution.Hyperdetailed]: 'Maximum detail and clarity'
});

// Video-specific Options
export const VIDEO_DURATION_OPTIONS: OptionItem[] = [
  { label: 'Quick (3-6 seconds)', value: '6', description: 'Short clips, perfect for loops' },
  { label: 'Standard (10-15 seconds)', value: '15', description: 'Most versatile length' },
  { label: 'Extended (20-30 seconds)', value: '30', description: 'Longer narrative content' },
];

// Text-specific Options
export const TEXT_FORMAT_OPTIONS: OptionItem[] = [
  { label: 'Plain Text', value: 'plain', description: 'Simple, unformatted text' },
  { label: 'Markdown', value: 'markdown', description: 'Formatted with markdown syntax' },
  { label: 'JSON', value: 'json', description: 'Structured data format' },
  { label: 'HTML', value: 'html', description: 'Web-ready markup' },
];

export const WORD_COUNT_OPTIONS: OptionItem[] = [
  { label: 'Brief (50-100 words)', value: '100', description: 'Concise, to-the-point' },
  { label: 'Standard (200-300 words)', value: '250', description: 'Balanced detail and brevity' },
  { label: 'Detailed (400-600 words)', value: '500', description: 'Comprehensive coverage' },
  { label: 'Extensive (800+ words)', value: '1000', description: 'In-depth, thorough exploration' },
];

// Audio-specific Options
export const AUDIO_TYPE_OPTIONS = createOptionsFromEnum(AudioType, {
  [AudioType.Music]: 'Music',
  [AudioType.Ambient]: 'Ambient/Background',
  [AudioType.Voice]: 'Voice/Speech',
  [AudioType.Effects]: 'Sound Effects'
}, {
  [AudioType.Music]: 'Musical compositions and melodies',
  [AudioType.Ambient]: 'Atmospheric background sounds',
  [AudioType.Voice]: 'Spoken content and narration',
  [AudioType.Effects]: 'Sound effects and audio elements'
});

export const AUDIO_VIBE_OPTIONS = createOptionsFromEnum(AudioVibe, {
  [AudioVibe.Calm]: 'Calm & Peaceful',
  [AudioVibe.Energetic]: 'Energetic & Upbeat',
  [AudioVibe.Atmospheric]: 'Atmospheric',
  [AudioVibe.Dark]: 'Dark & Moody'
}, {
  [AudioVibe.Calm]: 'Relaxing, meditative qualities',
  [AudioVibe.Energetic]: 'High-energy, motivating',
  [AudioVibe.Atmospheric]: 'Immersive, environmental',
  [AudioVibe.Dark]: 'Mysterious, dramatic tension'
});

// Code-specific Options
export const CODE_LANGUAGE_OPTIONS = createOptionsFromEnum(CodeLanguage, {
  [CodeLanguage.JavaScript]: 'JavaScript',
  [CodeLanguage.TypeScript]: 'TypeScript',
  [CodeLanguage.Python]: 'Python',
  [CodeLanguage.React]: 'React/JSX'
}, {
  [CodeLanguage.JavaScript]: 'Versatile web scripting language',
  [CodeLanguage.TypeScript]: 'Type-safe JavaScript superset',
  [CodeLanguage.Python]: 'Readable, general-purpose language',
  [CodeLanguage.React]: 'Component-based UI library'
});

export const CODE_TASK_OPTIONS = createOptionsFromEnum(CodeTask, {
  [CodeTask.Generate]: 'Generate New Code',
  [CodeTask.Optimize]: 'Optimize Existing',
  [CodeTask.Debug]: 'Debug & Fix',
  [CodeTask.Explain]: 'Explain & Document'
}, {
  [CodeTask.Generate]: 'Create new functionality from scratch',
  [CodeTask.Optimize]: 'Improve performance and efficiency',
  [CodeTask.Debug]: 'Find and fix issues',
  [CodeTask.Explain]: 'Add documentation and explanations'
});

// Mode-specific option groups for easy filtering
export const MODE_OPTION_GROUPS = {
  [PromptMode.Text]: {
    primary: [TONE_OPTIONS, OUTPUT_STRUCTURE_OPTIONS, WORD_COUNT_OPTIONS],
    secondary: [TEXT_FORMAT_OPTIONS]
  },
  [PromptMode.Image]: {
    primary: [IMAGE_STYLE_OPTIONS, LIGHTING_OPTIONS, ASPECT_RATIO_OPTIONS],
    secondary: [FRAMING_OPTIONS, CAMERA_ANGLE_OPTIONS, CAMERA_RESOLUTION_OPTIONS]
  },
  [PromptMode.Video]: {
    primary: [POV_OPTIONS, VIDEO_DURATION_OPTIONS, CAMERA_RESOLUTION_OPTIONS],
    secondary: [TONE_OPTIONS, OUTPUT_STRUCTURE_OPTIONS]
  },
  [PromptMode.Audio]: {
    primary: [AUDIO_TYPE_OPTIONS, AUDIO_VIBE_OPTIONS, TONE_OPTIONS],
    secondary: [WORD_COUNT_OPTIONS, OUTPUT_STRUCTURE_OPTIONS]
  },
  [PromptMode.Code]: {
    primary: [CODE_LANGUAGE_OPTIONS, CODE_TASK_OPTIONS],
    secondary: [OUTPUT_STRUCTURE_OPTIONS]
  }
} as const;

// Utility functions for working with options
export const getOptionsForMode = (mode: PromptMode) => {
  return MODE_OPTION_GROUPS[mode] || { primary: [], secondary: [] };
};

export const findOptionByValue = (options: OptionItem[], value: string): OptionItem | undefined => {
  return options.find(option => option.value === value);
};

export const getOptionLabel = (options: OptionItem[], value: string): string => {
  const option = findOptionByValue(options, value);
  return option?.label || value;
};

// Default values for each mode
export const MODE_DEFAULTS = {
  [PromptMode.Text]: {
    contentTone: ContentTone.Professional,
    outputStructure: OutputStructure.Paragraph,
    wordCount: '250',
    outputFormat: 'plain'
  },
  [PromptMode.Image]: {
    contentTone: ContentTone.Creative,
    imageStyle: ImageStyle.Cinematic,
    lighting: Lighting.Natural,
    aspectRatio: AspectRatio.Landscape,
    framing: Framing.MediumShot,
    cameraAngle: CameraAngle.Frontal,
    resolution: CameraResolution.HD
  },
  [PromptMode.Video]: {
    contentTone: ContentTone.Creative,
    pov: PointOfView.ThirdPerson,
    duration: '15',
    resolution: CameraResolution.FourK
  },
  [PromptMode.Audio]: {
    contentTone: ContentTone.Neutral,
    audioType: AudioType.Music,
    audioVibe: AudioVibe.Atmospheric
  },
  [PromptMode.Code]: {
    language: CodeLanguage.JavaScript,
    task: CodeTask.Generate,
    outputStructure: OutputStructure.Structured
  }
} as const;

// Export commonly used combinations
export const QUICK_PRESETS = {
  socialMedia: {
    aspectRatio: AspectRatio.Square,
    imageStyle: ImageStyle.Photorealistic,
    lighting: Lighting.Natural,
    wordCount: '100'
  },
  cinematic: {
    imageStyle: ImageStyle.Cinematic,
    lighting: Lighting.Dramatic,
    framing: Framing.WideShot,
    aspectRatio: AspectRatio.Landscape
  },
  portrait: {
    aspectRatio: AspectRatio.Portrait,
    framing: Framing.CloseUp,
    lighting: Lighting.Soft,
    cameraAngle: CameraAngle.Frontal
  }
} as const;