import modelSpecs from '../model-specs.json';

// Proper typing instead of `any`
export enum PromptMode {
  Image = 'image',
  Video = 'video'
}

export interface ModelSpec {
  name: string;
  token_limit?: number;
  default_resolution?: string;
  default_aspect_ratio?: string;
  max_duration?: number;
  recommended_boosters?: string[];
  prompt_format?: string;
  required_parameters?: string[];
  required_boilerplate?: string;
  negative_prompt_required?: boolean;
  style_keywords?: string[];
  quality_boosters?: string[];
}

export interface TransformOptions {
  resolution?: string;
  aspectRatio?: string;
  duration?: number;
  negativePrompt?: string;
  style?: string;
  quality?: 'low' | 'medium' | 'high';
}

export interface TransformPromptArgs {
  userPrompt: string;
  mode: PromptMode;
  modelKey: string;
  options?: TransformOptions;
}

export interface TransformedPrompt {
  prompt: string;
  params: Record<string, any>;
  metadata: {
    originalLength: number;
    finalLength: number;
    truncated: boolean;
    enhancementsApplied: string[];
  };
}

export interface ValidationResult {
  valid: boolean;
  warnings: string[];
  suggestions: string[];
}

// Better tokenization - approximate tokens more accurately
class TokenCounter {
  private static readonly CHARS_PER_TOKEN = 4; // GPT-style approximation
  
  static estimateTokens(text: string): number {
    return Math.ceil(text.length / this.CHARS_PER_TOKEN);
  }
  
  static truncateByTokens(text: string, maxTokens: number): { text: string; truncated: boolean } {
    const estimatedTokens = this.estimateTokens(text);
    
    if (estimatedTokens <= maxTokens) {
      return { text, truncated: false };
    }
    
    const maxChars = maxTokens * this.CHARS_PER_TOKEN;
    const truncated = text.substring(0, maxChars).trim() + '...';
    
    return { text: truncated, truncated: true };
  }
}

// Model-specific transformation strategies
abstract class ModelTransformer {
  protected spec: ModelSpec;
  
  constructor(spec: ModelSpec) {
    this.spec = spec;
  }
  
  abstract transform(prompt: string, options: TransformOptions): {
    prompt: string;
    enhancements: string[];
  };
  
  protected addQualityBoosters(prompt: string, quality: TransformOptions['quality']): string {
    if (!quality || quality === 'low') return prompt;
    
    const boosters = this.spec.quality_boosters || [];
    const qualityMap = {
      medium: boosters.slice(0, 2),
      high: boosters
    };
    
    const selectedBoosters = qualityMap[quality] || [];
    return selectedBoosters.length > 0 
      ? `${selectedBoosters.join(', ')}, ${prompt}`
      : prompt;
  }
}

class StableDiffusionTransformer extends ModelTransformer {
  transform(prompt: string, options: TransformOptions) {
    const enhancements: string[] = [];
    let enhancedPrompt = prompt;
    
    // Add recommended boosters
    if (this.spec.recommended_boosters?.length) {
      enhancedPrompt = `${this.spec.recommended_boosters.join(', ')}, ${enhancedPrompt}`;
      enhancements.push('Added SD boosters');
    }
    
    // Add quality enhancements
    enhancedPrompt = this.addQualityBoosters(enhancedPrompt, options.quality);
    if (options.quality && options.quality !== 'low') {
      enhancements.push(`Applied ${options.quality} quality boosters`);
    }
    
    // Add boilerplate
    if (this.spec.required_boilerplate) {
      enhancedPrompt = `${enhancedPrompt}, ${this.spec.required_boilerplate}`;
      enhancements.push('Added required boilerplate');
    }
    
    return { prompt: enhancedPrompt, enhancements };
  }
}

class MidjourneyTransformer extends ModelTransformer {
  transform(prompt: string, options: TransformOptions) {
    const enhancements: string[] = [];
    let enhancedPrompt = prompt;
    
    // Apply Midjourney format template
    if (this.spec.prompt_format) {
      enhancedPrompt = this.spec.prompt_format.replace('[scene description]', prompt);
      enhancements.push('Applied Midjourney format template');
    }
    
    // Add required parameters
    if (this.spec.required_parameters?.length) {
      enhancedPrompt = `${enhancedPrompt} ${this.spec.required_parameters.join(' ')}`;
      enhancements.push('Added required parameters');
    }
    
    // Add style keywords if specified
    if (options.style && this.spec.style_keywords?.length) {
      enhancedPrompt = `${enhancedPrompt} --style ${options.style}`;
      enhancements.push('Applied style keywords');
    }
    
    return { prompt: enhancedPrompt, enhancements };
  }
}

class DALLETransformer extends ModelTransformer {
  transform(prompt: string, options: TransformOptions) {
    const enhancements: string[] = [];
    
    // DALL-E 3 has built-in enhancement, so we keep it more natural
    // Only add minimal enhancements
    let enhancedPrompt = this.addQualityBoosters(prompt, options.quality);
    
    if (options.quality && options.quality !== 'low') {
      enhancements.push('Applied subtle quality enhancement');
    }
    
    return { prompt: enhancedPrompt, enhancements };
  }
}

// Factory for creating transformers
class TransformerFactory {
  private static transformers = new Map<string, typeof ModelTransformer>([
    ['sd_xl_turbo', StableDiffusionTransformer],
    ['stable_diffusion', StableDiffusionTransformer],
    ['midjourney_v7', MidjourneyTransformer],
    ['midjourney', MidjourneyTransformer],
    ['dall_e_3', DALLETransformer],
    ['dall_e_2', DALLETransformer],
  ]);
  
  static create(modelKey: string, spec: ModelSpec): ModelTransformer {
    const TransformerClass = this.transformers.get(modelKey) || DALLETransformer;
    return new TransformerClass(spec);
  }
}

// Main transformation function
export const transformPrompt = ({ 
  userPrompt, 
  mode, 
  modelKey, 
  options = {} 
}: TransformPromptArgs): TransformedPrompt => {
  const modeKey = mode === PromptMode.Image ? 'text-to-image' : 'text-to-video';
  const modelSpec: ModelSpec = (modelSpecs as any)[modeKey]?.[modelKey];
  
  if (!modelSpec) {
    throw new Error(`Model specification not found for key: ${modelKey} in mode: ${mode}`);
  }
  
  const originalLength = TokenCounter.estimateTokens(userPrompt);
  const tokenLimit = modelSpec.token_limit || 400;
  
  // Step 1: Truncate if necessary
  const { text: truncatedPrompt, truncated } = TokenCounter.truncateByTokens(
    userPrompt, 
    tokenLimit
  );
  
  // Step 2: Apply model-specific transformations
  const transformer = TransformerFactory.create(modelKey, modelSpec);
  const { prompt: enhancedPrompt, enhancements } = transformer.transform(
    truncatedPrompt, 
    options
  );
  
  // Step 3: Build parameters
  const params: Record<string, any> = {
    engine: modelKey,
    media_type: mode,
    resolution: options.resolution || modelSpec.default_resolution,
  };
  
  if (mode === PromptMode.Video) {
    params.duration_sec = options.duration || modelSpec.max_duration;
  }
  
  if (mode === PromptMode.Image) {
    params.aspect_ratio = options.aspectRatio || modelSpec.default_aspect_ratio;
  }
  
  if (modelSpec.negative_prompt_required) {
    params.negative_prompt = options.negativePrompt || 
      "blurry, low quality, deformed, artifacts, poorly drawn, distorted";
  }
  
  return {
    prompt: enhancedPrompt,
    params,
    metadata: {
      originalLength,
      finalLength: TokenCounter.estimateTokens(enhancedPrompt),
      truncated,
      enhancementsApplied: enhancements,
    },
  };
};

// Improved validation with better suggestions
export const validatePrompt = (
  prompt: string, 
  modelKey: string, 
  mode: PromptMode
): ValidationResult => {
  const modeKey = mode === PromptMode.Image ? 'text-to-image' : 'text-to-video';
  const modelSpec: ModelSpec = (modelSpecs as any)[modeKey]?.[modelKey];
  
  if (!modelSpec) {
    return { 
      valid: false, 
      warnings: ['Model specification not found.'],
      suggestions: ['Please select a valid model.']
    };
  }
  
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  const tokenCount = TokenCounter.estimateTokens(prompt);
  const tokenLimit = modelSpec.token_limit || 400;
  
  // Token limit validation
  if (tokenCount > tokenLimit) {
    warnings.push(
      `Prompt is ~${tokenCount} tokens, exceeding the ~${tokenLimit} token limit for ${modelSpec.name}.`
    );
    suggestions.push('Consider shortening your prompt or being more concise.');
  }
  
  // Model-specific suggestions
  if (modelSpec.negative_prompt_required) {
    suggestions.push(
      `${modelSpec.name} works best with negative prompts to avoid common issues.`
    );
  }
  
  if (mode === PromptMode.Video && modelSpec.max_duration) {
    suggestions.push(
      `${modelSpec.name} can generate videos up to ${modelSpec.max_duration} seconds long.`
    );
  }
  
  // Style suggestions
  if (modelSpec.style_keywords?.length) {
    suggestions.push(
      `Consider adding style keywords: ${modelSpec.style_keywords.slice(0, 3).join(', ')}`
    );
  }
  
  return {
    valid: warnings.length === 0,
    warnings,
    suggestions,
  };
};

// Usage example:
const result = transformPrompt({
  userPrompt: "A beautiful sunset over mountains",
  mode: PromptMode.Image,
  modelKey: "sd_xl_turbo",
  options: {
    quality: "high",
    resolution: "1024x1024",
    negativePrompt: "blurry, distorted"
  }
});

console.log(result);
// Output includes enhanced prompt, params, and metadata about transformations