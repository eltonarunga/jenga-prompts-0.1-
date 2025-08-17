import React, { memo, useCallback, useMemo } from 'react';
import { PromptHistoryItem, PromptMode } from '../types';

interface PromptHistoryDisplayProps {
    history: PromptHistoryItem[];
    onReuse: (item: PromptHistoryItem) => void;
    onDelete: (id: number) => void;
    onClear: () => void;
    maxItems?: number;
    className?: string;
}

// Icon components using SVG instead of FontAwesome
const Icons = {
    Text: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 4h6v2H7V7zm0 4h6v2H7v-2z"/>
        </svg>
    ),
    Image: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
        </svg>
    ),
    Video: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
        </svg>
    ),
    Audio: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
        </svg>
    ),
    Code: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
        </svg>
    ),
    History: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
        </svg>
    ),
    Trash: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
            <path fillRule="evenodd" d="M10 5a2 2 0 00-2 2v6a2 2 0 002 2h0a2 2 0 002-2V7a2 2 0 00-2-2H10zM8 7v6h4V7H8zm-5-2a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
        </svg>
    ),
    Reuse: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
        </svg>
    )
};

const HistoryItem = memo(({ item, onReuse, onDelete }: {
    item: PromptHistoryItem;
    onReuse: (item: PromptHistoryItem) => void;
    onDelete: (id: number) => void;
}) => {
    const handleReuse = useCallback(() => onReuse(item), [item, onReuse]);
    const handleDelete = useCallback(() => onDelete(item.id), [item.id, onDelete]);

    const ModeIcon = Icons[item.mode as keyof typeof Icons] || Icons.Text;
    const formattedDate = useMemo(() => 
        new Date(item.timestamp).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }), [item.timestamp]
    );

    return (
        <article className="bg-slate-100 dark:bg-gray-800/50 p-4 rounded-xl transition-all duration-200 hover:bg-slate-200 dark:hover:bg-gray-800/70 border border-slate-200 dark:border-gray-700">
            <header className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400">
                    <ModeIcon />
                    <span>{item.mode}</span>
                </div>
                <time 
                    className="text-xs text-slate-500 dark:text-gray-400"
                    dateTime={new Date(item.timestamp).toISOString()}
                    title={new Date(item.timestamp).toLocaleString()}
                >
                    {formattedDate}
                </time>
            </header>
            
            <p 
                className="text-sm text-slate-700 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed" 
                title={item.primaryResult}
            >
                {item.primaryResult}
            </p>
            
            <footer className="flex items-center justify-end gap-2">
                <button 
                    onClick={handleDelete}
                    className="text-xs bg-slate-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 text-slate-600 dark:text-gray-300 font-medium py-1.5 px-3 rounded-full transition-all duration-200 flex items-center gap-1"
                    aria-label={`Delete prompt from ${formattedDate}`}
                >
                    <Icons.Trash />
                    Delete
                </button>
                <button 
                    onClick={handleReuse}
                    className="text-xs bg-purple-500/90 hover:bg-purple-600 active:bg-purple-700 text-white font-medium py-1.5 px-3 rounded-full transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md"
                    aria-label={`Reuse prompt from ${formattedDate}`}
                >
                    <Icons.Reuse />
                    Reuse
                </button>
            </footer>
        </article>
    );
});

const PromptHistoryDisplay: React.FC<PromptHistoryDisplayProps> = ({ 
    history, 
    onReuse, 
    onDelete, 
    onClear, 
    maxItems = 50,
    className = ""
}) => {
    const displayHistory = useMemo(() => 
        history.slice(0, maxItems), [history, maxItems]
    );

    const handleClearAll = useCallback(() => {
        const confirmed = window.confirm(
            `Are you sure you want to clear all ${history.length} prompt${history.length === 1 ? '' : 's'} from your history? This action cannot be undone.`
        );
        if (confirmed) {
            onClear();
        }
    }, [history.length, onClear]);

    // Don't render if no history
    if (history.length === 0) {
        return null;
    }

    return (
        <section 
            className={`lg:col-span-2 glass rounded-2xl p-6 sm:p-8 mt-8 sm:mt-12 fade-in ${className}`}
            style={{ animationDelay: '0.8s' }}
            aria-labelledby="history-heading"
            role="region"
        >
            <header className="flex items-center justify-between mb-6">
                <h2 
                    id="history-heading" 
                    className="text-2xl sm:text-3xl font-bold gradient-text flex items-center gap-3"
                >
                    <Icons.History />
                    Prompt History
                    <span className="text-sm font-normal text-slate-500 dark:text-gray-400 ml-2">
                        ({history.length})
                    </span>
                </h2>
                
                <button
                    onClick={handleClearAll}
                    className="text-xs bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 text-red-600 dark:text-red-400 font-semibold px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-2 border border-red-500/30 hover:border-red-500/50"
                    aria-label={`Clear all ${history.length} prompts from history`}
                    type="button"
                >
                    <Icons.Trash />
                    Clear All
                </button>
            </header>
            
            <div 
                className="max-h-96 overflow-y-auto space-y-4 pr-2 -mr-2 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent"
                role="list"
                aria-label="Prompt history items"
            >
                {displayHistory.map((item) => (
                    <div key={item.id} role="listitem">
                        <HistoryItem 
                            item={item}
                            onReuse={onReuse}
                            onDelete={onDelete}
                        />
                    </div>
                ))}
                
                {history.length > maxItems && (
                    <div className="text-center py-4 text-sm text-slate-500 dark:text-gray-400">
                        Showing {maxItems} of {history.length} items
                    </div>
                )}
            </div>
        </section>
    );
};

HistoryItem.displayName = 'HistoryItem';

export default PromptHistoryDisplay;