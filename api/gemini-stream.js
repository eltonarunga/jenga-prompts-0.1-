import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

// Constants
const CORS_ORIGIN = 'https://jenga-prompts-0-1.vercel.app';
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const STREAM_HEADERS = {
    'Content-Type': 'text/plain; charset=utf-8',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
};

const GEMINI_CONFIG = {
    model: 'gemini-2.5-flash',
    temperature: 0.7,
    topP: 0.95,
    topK: 40
};

// Main handler
export default async function handler(req, res) {
    // Set CORS headers
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
        res.setHeader(key, value);
    });
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Validate request method
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Validate authorization
    if (req.headers.authorization !== process.env.CLIENT_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const { userPrompt, mode, options } = req.body;
        
        if (!userPrompt?.trim()) {
            return res.status(400).json({ error: 'Missing or empty userPrompt' });
        }

        console.log(`Processing ${mode} prompt enhancement request`);
        
        await streamGeminiResponse(res, userPrompt, mode, options);
        
    } catch (error) {
        console.error('Streaming error:', error);
        handleStreamError(res, error);
    }
}

// Stream Gemini response
async function streamGeminiResponse(res, userPrompt, mode, options) {
    // Set streaming headers
    res.writeHead(200, STREAM_HEADERS);
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const systemInstruction = buildSystemInstruction(mode, options);
    
    const response = await ai.models.generateContentStream({
        ...GEMINI_CONFIG,
        contents: userPrompt,
        config: { systemInstruction, ...GEMINI_CONFIG }
    });

    // Stream chunks
    for await (const chunk of response.stream) {
        const text = chunk.text();
        if (text) {
            res.write(text);
        }
    }
    
    res.end();
}

// Handle streaming errors
function handleStreamError(res, error) {
    if (!res.headersSent) {
        res.status(500).json({ 
            error: 'Failed to generate content',
            details: error.message 
        });
    } else if (!res.writableEnded) {
        res.write(`\n\nError: ${error.message}`);
        res.end();
    }
}

// Build system instruction based on mode
function buildSystemInstruction(mode, options = {}) {
    const baseInstruction = `You are a world-class prompt engineer. Transform the user's simple idea into a rich, detailed, and highly effective prompt for generative AI.`;
    
    // Add output format instruction
    const outputInstruction = options.outputStructure === 'Descriptive Paragraph' 
        ? ' Output only the final prompt without explanations.' 
        : '';
    
    const modeInstructions = {
        'Image': () => {
            const framework = loadFramework('image-prompt-framework.md');
            const params = buildImageParams(options);
            return framework || getImageFallback() + params;
        },
        'Video': () => {
            const framework = loadFramework('video-prompt-framework.md');
            const params = buildVideoParams(options);
            return framework || getVideoFallback() + params;
        },
        'Text': () => {
            const params = buildTextParams(options);
            return `Target: Large language model. Create crystal-clear text generation prompts.${params}`;
        },
        'Audio': () => {
            const params = buildAudioParams(options);
            return `Target: AI audio/music generator. Describe sound in detail - instrumentation, tempo, emotion.${params}`;
        },
        'Code': () => {
            const params = buildCodeParams(options);
            return `Target: Code generation AI. Create precise, unambiguous technical prompts.${params}`;
        }
    };
    
    const modeInstruction = modeInstructions[mode]?.() || 'Generate a high-quality, general-purpose prompt.';
    
    return `${baseInstruction}${outputInstruction}\n\n### Task\n${modeInstruction}`;
}

// Load framework files with error handling
function loadFramework(filename) {
    try {
        const frameworkPath = path.join(process.cwd(), 'src', filename);
        return fs.readFileSync(frameworkPath, 'utf-8');
    } catch (error) {
        console.warn(`Framework file ${filename} not found, using fallback`);
        return null;
    }
}

// Parameter builders
function buildImageParams(options) {
    return buildParamString([
        ['Style', options.imageStyle],
        ['Mood/Tone', options.contentTone],
        ['Lighting', options.lighting],
        ['Framing', options.framing],
        ['Camera Angle', options.cameraAngle],
        ['Detail Level', options.resolution],
        ['Aspect Ratio', options.aspectRatio],
        ['Additional Specifics', options.additionalDetails]
    ]);
}

function buildVideoParams(options) {
    return buildParamString([
        ['Tone', options.contentTone],
        ['Point of View', options.pov],
        ['Detail Level', options.resolution]
    ]);
}

function buildTextParams(options) {
    return buildParamString([
        ['Tone of Voice', options.contentTone],
        ['Output Format', options.outputFormat]
    ]);
}

function buildAudioParams(options) {
    return buildParamString([
        ['Audio Type', options.audioType],
        ['Vibe/Mood', options.audioVibe],
        ['Tone', options.contentTone]
    ]);
}

function buildCodeParams(options) {
    return buildParamString([
        ['Language', options.codeLanguage],
        ['Task', options.codeTask]
    ]);
}

// Helper to build parameter strings
function buildParamString(params) {
    const validParams = params.filter(([_, value]) => value?.trim());
    
    if (validParams.length === 0) return '';
    
    const paramList = validParams.map(([label, value]) => `- ${label}: ${value}`).join('\n');
    return `\n\n### Parameters to Incorporate\n${paramList}`;
}

// Fallback instructions
function getImageFallback() {
    return 'Target: AI image generator. Create vivid, descriptive prompts that paint a clear picture.';
}

function getVideoFallback() {
    return 'Target: AI video generator. Describe continuous scenes focusing on motion, atmosphere, and visual storytelling.';
}