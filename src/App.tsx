import React, { useState, useCallback, useReducer, Suspense } from 'react';

// Types (would normally be in separate files)
enum PromptMode {
  Text = 'Text',
  Image = 'Image', 
  Video = 'Video',
  Audio = 'Audio',
  Code = 'Code'
}

interface PromptState {
  mode: PromptMode;
  userPrompt: string;
  options: Record<string, any>;
}

interface AppState {
  prompt: PromptState;
  ui: {
    theme: 'light' | 'dark';
    isLoading: boolean;
    error: string;
    loadingMessage: string;
    copyStatus: 'idle' | 'copied' | 'error';
    activeTab: 'result' | 'json';
  };
  results: {
    primary: string;
    json?: string;
  };
  history: any[];
}

// Action types
type AppAction = 
  | { type: 'SET_PROMPT_MODE'; payload: PromptMode }
  | { type: 'SET_USER_PROMPT'; payload: string }
  | { type: 'SET_OPTION'; payload: { key: string; value: any } }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean; message?: string } }
  | { type: 'SET_RESULTS'; payload: { primary: string; json?: string } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_COPY_STATUS'; payload: 'idle' | 'copied' | 'error' }
  | { type: 'SET_ACTIVE_TAB'; payload: 'result' | 'json' };

// Reducer for state management
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_PROMPT_MODE':
      return {
        ...state,
        prompt: { ...state.prompt, mode: action.payload }
      };
    case 'SET_USER_PROMPT':
      return {
        ...state,
        prompt: { ...state.prompt, userPrompt: action.payload }
      };
    case 'SET_OPTION':
      return {
        ...state,
        prompt: {
          ...state.prompt,
          options: { ...state.prompt.options, [action.payload.key]: action.payload.value }
        }
      };
    case 'SET_LOADING':
      return {
        ...state,
        ui: {
          ...state.ui,
          isLoading: action.payload.isLoading,
          loadingMessage: action.payload.message || ''
        }
      };
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload,
        ui: { ...state.ui, error: '' }
      };
    case 'SET_ERROR':
      return {
        ...state,
        ui: { ...state.ui, error: action.payload }
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        ui: { ...state.ui, theme: state.ui.theme === 'light' ? 'dark' : 'light' }
      };
    case 'SET_COPY_STATUS':
      return {
        ...state,
        ui: { ...state.ui, copyStatus: action.payload }
      };
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        ui: { ...state.ui, activeTab: action.payload }
      };
    default:
      return state;
  }
};

// Theme Toggle Component
const ThemeToggle = ({ theme, onToggle }: { theme: string; onToggle: () => void }) => (
  <div className="fixed top-4 right-4 z-50">
    <button
      onClick={onToggle}
      className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  </div>
);

// Mode Selector Component
const ModeSelector = ({ 
  currentMode, 
  onModeChange 
}: { 
  currentMode: PromptMode; 
  onModeChange: (mode: PromptMode) => void;
}) => {
  const modes = [
    { mode: PromptMode.Text, icon: '📝', label: 'Text' },
    { mode: PromptMode.Image, icon: '🖼️', label: 'Image' },
    { mode: PromptMode.Video, icon: '🎥', label: 'Video' },
    { mode: PromptMode.Audio, icon: '🎵', label: 'Audio' },
    { mode: PromptMode.Code, icon: '💻', label: 'Code' },
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Mode
      </label>
      <div className="grid grid-cols-5 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {modes.map(({ mode, icon, label }) => (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
              currentMode === mode
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-2xl mb-1">{icon}</span>
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Options Panel Component
const OptionsPanel = ({ 
  mode, 
  options, 
  onOptionChange 
}: { 
  mode: PromptMode; 
  options: Record<string, any>;
  onOptionChange: (key: string, value: any) => void;
}) => {
  const renderSelect = (key: string, label: string, optionsList: string[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        value={options[key] || optionsList[0]}
        onChange={(e) => onOptionChange(key, e.target.value)}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        {optionsList.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );

  const getModeOptions = () => {
    switch (mode) {
      case PromptMode.Text:
        return (
          <div className="grid grid-cols-2 gap-4">
            {renderSelect('tone', 'Tone', ['Professional', 'Casual', 'Creative', 'Technical'])}
            {renderSelect('length', 'Length', ['Short', 'Medium', 'Long', 'Very Long'])}
          </div>
        );
      
      case PromptMode.Image:
        return (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {renderSelect('style', 'Style', ['Realistic', 'Artistic', 'Cartoon', 'Abstract'])}
            {renderSelect('lighting', 'Lighting', ['Natural', 'Dramatic', 'Soft', 'Neon'])}
            {renderSelect('aspect', 'Aspect Ratio', ['1:1', '16:9', '4:3', '3:2'])}
          </div>
        );
      
      case PromptMode.Video:
        return (
          <div className="grid grid-cols-2 gap-4">
            {renderSelect('duration', 'Duration', ['5s', '10s', '15s', '30s'])}
            {renderSelect('quality', 'Quality', ['720p', '1080p', '4K'])}
          </div>
        );
      
      case PromptMode.Audio:
        return (
          <div className="grid grid-cols-2 gap-4">
            {renderSelect('genre', 'Genre', ['Classical', 'Electronic', 'Ambient', 'Rock'])}
            {renderSelect('mood', 'Mood', ['Calm', 'Energetic', 'Dark', 'Happy'])}
          </div>
        );
      
      case PromptMode.Code:
        return (
          <div className="grid grid-cols-2 gap-4">
            {renderSelect('language', 'Language', ['JavaScript', 'Python', 'React', 'TypeScript'])}
            {renderSelect('complexity', 'Complexity', ['Simple', 'Intermediate', 'Advanced'])}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Options
      </h3>
      {getModeOptions()}
    </div>
  );
};

// Results Display Component
const ResultsDisplay = ({ 
  results, 
  isLoading, 
  loadingMessage, 
  activeTab, 
  onTabChange,
  onCopy,
  copyStatus 
}: {
  results: { primary: string; json?: string };
  isLoading: boolean;
  loadingMessage: string;
  activeTab: 'result' | 'json';
  onTabChange: (tab: 'result' | 'json') => void;
  onCopy: () => void;
  copyStatus: 'idle' | 'copied' | 'error';
}) => {
  const currentContent = activeTab === 'json' ? results.json : results.primary;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          ✨ Enhanced Prompt
        </h2>
        
        {results.primary && (
          <div className="flex items-center space-x-2">
            {results.json && (
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => onTabChange('result')}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    activeTab === 'result' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Result
                </button>
                <button
                  onClick={() => onTabChange('json')}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    activeTab === 'json' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  JSON
                </button>
              </div>
            )}
            
            <button
              onClick={onCopy}
              disabled={!currentContent || copyStatus !== 'idle'}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm transition-all disabled:opacity-50"
            >
              {copyStatus === 'copied' ? '✓ Copied' : copyStatus === 'error' ? '✗ Failed' : '📋 Copy'}
            </button>
          </div>
        )}
      </div>

      <div className="relative bg-gray-50 dark:bg-gray-900 rounded-lg min-h-[300px] overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">🧠</div>
              <p className="text-gray-500">{loadingMessage}</p>
            </div>
          </div>
        ) : currentContent ? (
          <textarea
            value={currentContent}
            readOnly
            className="w-full h-full min-h-[300px] bg-transparent border-0 p-4 text-gray-800 dark:text-gray-200 font-mono text-sm resize-none focus:outline-none"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Your enhanced prompt will appear here...
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [state, dispatch] = useReducer(appReducer, {
    prompt: {
      mode: PromptMode.Text,
      userPrompt: '',
      options: {}
    },
    ui: {
      theme: 'light',
      isLoading: false,
      error: '',
      loadingMessage: '',
      copyStatus: 'idle',
      activeTab: 'result'
    },
    results: {
      primary: '',
      json: undefined
    },
    history: []
  });

  // Mock enhancement function (replace with your actual API call)
  const enhancePrompt = useCallback(async () => {
    if (!state.prompt.userPrompt.trim()) return;

    dispatch({ type: 'SET_LOADING', payload: { isLoading: true, message: 'Enhancing your prompt...' } });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const enhanced = `Enhanced ${state.prompt.mode.toLowerCase()} prompt: ${state.prompt.userPrompt} with options: ${JSON.stringify(state.prompt.options, null, 2)}`;
      const jsonResult = JSON.stringify({
        mode: state.prompt.mode,
        original: state.prompt.userPrompt,
        enhanced,
        options: state.prompt.options,
        timestamp: new Date().toISOString()
      }, null, 2);
      
      dispatch({ 
        type: 'SET_RESULTS', 
        payload: { primary: enhanced, json: jsonResult } 
      });
      
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Enhancement failed' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
    }
  }, [state.prompt]);

  const handleCopy = useCallback(async () => {
    const content = state.ui.activeTab === 'json' ? state.results.json : state.results.primary;
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      dispatch({ type: 'SET_COPY_STATUS', payload: 'copied' });
      setTimeout(() => dispatch({ type: 'SET_COPY_STATUS', payload: 'idle' }), 2000);
    } catch {
      dispatch({ type: 'SET_COPY_STATUS', payload: 'error' });
      setTimeout(() => dispatch({ type: 'SET_COPY_STATUS', payload: 'idle' }), 2000);
    }
  }, [state.results, state.ui.activeTab]);

  return (
    <div className={`min-h-screen p-4 transition-all ${state.ui.theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <ThemeToggle 
        theme={state.ui.theme} 
        onToggle={() => dispatch({ type: 'TOGGLE_THEME' })} 
      />
      
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            🚀 AI Prompt Enhancer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transform your ideas into powerful AI prompts
          </p>
        </header>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📝 Create Your Prompt
          </h2>
          
          {state.ui.error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 rounded-lg text-red-700 dark:text-red-300">
              {state.ui.error}
            </div>
          )}

          <ModeSelector 
            currentMode={state.prompt.mode}
            onModeChange={(mode) => dispatch({ type: 'SET_PROMPT_MODE', payload: mode })}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Idea
            </label>
            <textarea
              value={state.prompt.userPrompt}
              onChange={(e) => dispatch({ type: 'SET_USER_PROMPT', payload: e.target.value })}
              placeholder="Describe your concept..."
              className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <OptionsPanel
              mode={state.prompt.mode}
              options={state.prompt.options}
              onOptionChange={(key, value) => 
                dispatch({ type: 'SET_OPTION', payload: { key, value } })
              }
            />
          </div>

          <button
            onClick={enhancePrompt}
            disabled={state.ui.isLoading || !state.prompt.userPrompt.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.ui.isLoading ? '⏳ Enhancing...' : '✨ Enhance Prompt'}
          </button>
        </div>

        {/* Results Section */}
        <ResultsDisplay
          results={state.results}
          isLoading={state.ui.isLoading}
          loadingMessage={state.ui.loadingMessage}
          activeTab={state.ui.activeTab}
          onTabChange={(tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })}
          onCopy={handleCopy}
          copyStatus={state.ui.copyStatus}
        />
      </div>
    </div>
  );
};

export default App;