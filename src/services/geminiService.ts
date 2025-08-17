// Types for better type safety
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface StreamCallbacks {
  onChunk?: (text: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

interface PromptRequest {
  userPrompt: string;
  mode: string;
  options: Record<string, any>;
}

// Configuration
const API_CONFIG = {
  GEMINI_STREAM: '/api/gemini-stream',
  GEMINI_NON_STREAM: '/api/gemini-non-stream',
  HUGGINGFACE: '/api/huggingface',
  TIMEOUT: 30000, // 30 seconds
} as const;

// Utility function for making requests
async function makeRequest<T>(
  url: string, 
  options: RequestInit & { timeout?: number } = {}
): Promise<T> {
  const { timeout = API_CONFIG.TIMEOUT, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        errorData.error || 
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    
    throw error instanceof Error 
      ? error 
      : new Error('Unknown request error');
  }
}

// Enhanced prompt - non-streaming version
export async function getEnhancedPrompt(
  request: PromptRequest
): Promise<ApiResponse> {
  try {
    const result = await makeRequest<ApiResponse>(
      API_CONFIG.GEMINI_NON_STREAM,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
    
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to enhance prompt';
    return {
      success: false,
      error: message,
    };
  }
}

// Enhanced prompt - streaming version
export async function getEnhancedPromptStream(
  request: PromptRequest,
  callbacks: StreamCallbacks = {}
): Promise<ApiResponse<string>> {
  const { onChunk, onComplete, onError } = callbacks;
  
  try {
    const response = await fetch(API_CONFIG.GEMINI_STREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('No response body available for streaming');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        
        onChunk?.(chunk);
      }

      onComplete?.(fullText);
      
      return {
        success: true,
        data: fullText,
      };

    } finally {
      reader.releaseLock();
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Streaming failed';
    const apiError = new Error(errorMessage);
    
    onError?.(apiError);
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Hugging Face completion
export async function getHuggingFaceCompletion(
  prompt: string
): Promise<ApiResponse> {
  try {
    const result = await makeRequest<any>(
      API_CONFIG.HUGGINGFACE,
      {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      }
    );
    
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Hugging Face request failed';
    return {
      success: false,
      error: message,
    };
  }
}

// Usage examples:

// Non-streaming
const result = await getEnhancedPrompt({
  userPrompt: "Hello world",
  mode: "creative",
  options: { temperature: 0.7 }
});

if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}

// Streaming with callbacks
await getEnhancedPromptStream(
  {
    userPrompt: "Tell me a story",
    mode: "narrative", 
    options: {}
  },
  {
    onChunk: (text) => console.log('Chunk:', text),
    onComplete: (fullText) => console.log('Complete:', fullText),
    onError: (error) => console.error('Error:', error.message)
  }
);