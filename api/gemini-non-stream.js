import { GoogleGenAI } from "@google/genai";
import { promises as fs } from 'fs';
import path from 'path';

// Configuration
const CONFIG = {
  CORS_ORIGIN: 'https://jenga-prompts-0-1.vercel.app',
  MODEL: 'gemini-1.5-flash',
  GENERATION_CONFIG: {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
  },
  FRAMEWORK_DIR: path.join(process.cwd(), 'src'),
};

// Cache for framework files to avoid repeated file reads
const frameworkCache = new Map();

// Enhanced error class
class APIError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Main API handler for prompt enhancement
 */
export default async function handler(req, res) {
  try {
    // Handle CORS
    setCORSHeaders(res);
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Validate request
    validateRequest(req);
    
    // Authenticate
    authenticate(req);

    const { userPrompt, mode, options } = req.body;
    
    // Validate required fields
    if (!userPrompt?.trim()) {
      throw new APIError('Missing or empty userPrompt', 400);
    }

    // Generate enhanced prompt
    const enhancedPrompt = await generateEnhancedPrompt(userPrompt, mode, options);
    
    // Format response
    const response = formatResponse(enhancedPrompt, mode, options);
    
    res.status(200).json(response);

  } catch (error) {
    handleError(error, res);
  }
}

/**
 * Set CORS headers
 */
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', CONFIG.CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Validate request method
 */
function validateRequest(req) {
  if (req.method !== 'POST') {
    throw new APIError('Method not allowed', 405);
  }
}

/**
 * Authenticate request
 */
function authenticate(req) {
  const clientApiKey = req.headers.authorization;
  if (clientApiKey !== process.env.CLIENT_API_KEY) {
    throw new APIError('Unauthorized', 401);
  }
}

/**
 * Generate enhanced prompt using Gemini AI
 */
async function generateEnhancedPrompt(userPrompt, mode, options) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new APIError('API key not configured', 500);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const finalPrompt = await buildFinalPrompt(mode, options, userPrompt);

    const request = {
      model: CONFIG.MODEL,
      contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
      systemInstruction: {
        role: "system",
        parts: [{ text: "You are a world-class prompt engineer, specialist in crafting detailed, effective prompts for AI models." }]
      },
      generationConfig: CONFIG.GENERATION_CONFIG
    };

    const result = await ai.models.generateContent(request);
    
    return validateAndExtractResponse(result);

  } catch (error) {
    console.error('Error generating content:', error);
    throw new APIError('Failed to generate enhanced prompt', 500, error.message);
  }
}

/**
 * Validate and extract response from Gemini API
 */
function validateAndExtractResponse(result) {
  if (!result?.candidates?.length) {
    if (result?.promptFeedback?.blockReason) {
      throw new APIError(`Request blocked: ${result.promptFeedback.blockReason}`, 400);
    }
    throw new APIError('Invalid response from AI service', 500);
  }

  const rawText = result.candidates[0]?.content?.parts?.[0]?.text;
  if (!rawText?.trim()) {
    throw new APIError('Empty response from AI service', 500);
  }

  return rawText.trim();
}

/**
 * Format response based on output structure preference
 */
function formatResponse(enhancedPrompt, mode, options) {
  const isSimpleJson = options?.outputStructure === 'Simple JSON';
  const isDetailedJson = options?.outputStructure === 'Detailed JSON';

  if (isDetailedJson) {
    const parameters = { mode, ...options };
    // Clean up empty additional details
    if (parameters.additionalDetails === '') {
      delete parameters.additionalDetails;
    }
    return { prompt: enhancedPrompt, parameters };
  }
  
  return { prompt: enhancedPrompt };
}

/**
 * Load framework file with caching
 */
async function loadFramework(filename) {
  if (frameworkCache.has(filename)) {
    return frameworkCache.get(filename);
  }

  try {
    const filePath = path.join(CONFIG.FRAMEWORK_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    frameworkCache.set(filename, content);
    return content;
  } catch (error) {
    console.warn(`Failed to load framework file ${filename}:`, error.message);
    return null;
  }
}

/**
 * Build final prompt based on mode and options
 */
async function buildFinalPrompt(mode, options, userPrompt) {
  const baseInstruction = `Your task is to take the user's basic idea and transform it into a "master prompt" optimized for a specific AI modality. The final output should ONLY be the enhanced prompt itself, with no additional text, commentary, or markdown formatting unless specified by the output format.`;

  let finalPrompt = `${baseInstruction}\n\n**Core Idea:** "${userPrompt}"\n\n`;

  const promptBuilders = {
    Video: () => buildVideoPrompt(options, userPrompt),
    Image: () => buildImagePrompt(options, userPrompt),
    Text: () => buildTextPrompt(options),
    Audio: () => buildAudioPrompt(options),
    Code: () => buildCodePrompt(options)
  };

  const builder = promptBuilders[mode];
  if (builder) {
    const modePrompt = await builder();
    finalPrompt = modePrompt || finalPrompt + `Please enhance this prompt for ${mode.toLowerCase()} generation.`;
  } else {
    finalPrompt += `Please enhance this prompt to be more effective.`;
  }

  return finalPrompt;
}

/**
 * Build video-specific prompt
 */
async function buildVideoPrompt(options, userPrompt) {
  const framework = await loadFramework('video-prompt-framework.md');
  
  if (framework) {
    return `${framework}\n\n**Core Idea:** "${userPrompt}"\n\n**Directives:**\n- Content Tone: ${options.contentTone}\n- Point of View: ${options.pov}\n- Quality: ${options.resolution}`;
  }
  
  // Fallback if framework file not found
  return `**Modality: Video Generation**
**Task:** Write a detailed screenplay shot description for an 8-second video (150-250 words).
**Directives:**
- Content Tone: ${options.contentTone}
- Point of View: ${options.pov}  
- Quality: ${options.resolution}
**Requirements:** Create a complete narrative arc with visual details about subjects, actions, environment, and cinematography.
**Core Idea:** "${userPrompt}"`;
}

/**
 * Build image-specific prompt
 */
async function buildImagePrompt(options, userPrompt) {
  const framework = await loadFramework('image-prompt-framework.md');
  
  if (framework) {
    return `${framework}\n\n**Core Idea:** "${userPrompt}"\n\n**Directives:**
- Style: ${options.imageStyle}
- Tone & Mood: ${options.contentTone}
- Lighting: ${options.lighting}
- Framing: ${options.framing}
- Camera Angle: ${options.cameraAngle}
- Quality: ${options.resolution}
- Aspect Ratio: ${options.aspectRatio}
- Additional Details: "${options.additionalDetails}"`;
  }

  // Fallback
  return `**Modality: Image Generation**
**Task:** Transform concept into dense, comma-separated keywords and phrases.
**Directives:**
- Style: ${options.imageStyle}
- Tone & Mood: ${options.contentTone}
- Lighting: ${options.lighting}
- Framing: ${options.framing}
- Camera Angle: ${options.cameraAngle}
- Quality: ${options.resolution}
- Aspect Ratio: ${options.aspectRatio}
- Additional Details: "${options.additionalDetails}"
**Core Idea:** "${userPrompt}"`;
}

/**
 * Build text-specific prompt
 */
function buildTextPrompt(options) {
  return `**Modality: Text Generation**
**Task:** Refine prompt for better LLM responses with clear structure and constraints.
**Directives:**
- Tone: ${options.contentTone}
- Output Format: ${options.outputFormat}
**Requirements:** Add context, specify AI persona, provide examples if needed, set clear boundaries.`;
}

/**
 * Build audio-specific prompt
 */
function buildAudioPrompt(options) {
  return `**Modality: Audio Generation**
**Task:** Create rich, descriptive audio generation prompt.
**Directives:**
- Audio Type: ${options.audioType}
- Vibe/Mood: ${options.audioVibe}
- Tone: ${options.contentTone}
**Requirements:** Describe genre, tempo, instrumentation, vocals (music) or voice characteristics (speech) or sound environment (SFX).`;
}

/**
 * Build code-specific prompt
 */
function buildCodePrompt(options) {
  return `**Modality: Code Generation**
**Task:** Convert natural language to precise coding instruction.
**Directives:**
- Language: ${options.codeLanguage}
- Task: ${options.codeTask}
**Requirements:** Be unambiguous. Specify functions, parameters, return values, and logic clearly.`;
}

/**
 * Centralized error handling
 */
function handleError(error, res) {
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return res.status(error.statusCode).json({
      error: error.message,
      ...(error.details && { details: error.details })
    });
  }

  // Generic server error
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
}