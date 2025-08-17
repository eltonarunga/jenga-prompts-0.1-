import React from 'react';

interface SuspenseLoaderProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
    className?: string;
    fullHeight?: boolean;
}

// Loading animations using pure CSS
const LoadingSpinner = ({ size = 'md' }: { size: string }) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className={`${sizeClasses[size as keyof typeof sizeClasses]} relative`}>
            <div className="absolute inset-0 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 dark:border-t-purple-400 rounded-full animate-spin"></div>
        </div>
    );
};

const LoadingDots = ({ size = 'md' }: { size: string }) => {
    const dotSizes = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    };

    const dotSize = dotSizes[size as keyof typeof dotSizes];

    return (
        <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={`${dotSize} bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce`}
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </div>
    );
};

const LoadingPulse = ({ size = 'md' }: { size: string }) => {
    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-20 h-20',
        lg: 'w-24 h-24'
    };

    return (
        <div className={`${sizeClasses[size as keyof typeof sizeClasses]} relative`}>
            {/* Outer pulse ring */}
            <div className="absolute inset-0 bg-purple-500/20 dark:bg-purple-400/20 rounded-full animate-ping"></div>
            {/* Middle pulse ring */}
            <div 
                className="absolute inset-2 bg-purple-500/30 dark:bg-purple-400/30 rounded-full animate-ping"
                style={{ animationDelay: '0.5s' }}
            ></div>
            {/* Inner core */}
            <div className="absolute inset-4 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse"></div>
        </div>
    );
};

const LoadingSkeleton = () => (
    <div className="w-full space-y-4 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
            <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded-lg w-48"></div>
            <div className="h-6 bg-slate-200 dark:bg-gray-700 rounded-full w-24"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
        
        {/* Card skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="p-4 border border-slate-200 dark:border-gray-700 rounded-lg space-y-3">
                    <div className="h-6 bg-slate-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                    <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded w-full mt-4"></div>
                </div>
            ))}
        </div>
    </div>
);

const loadingMessages = [
    "Loading awesome content...",
    "Preparing your experience...",
    "Getting things ready...",
    "Almost there...",
    "Loading magic...",
    "Crafting something special...",
    "Organizing content...",
    "Setting up your workspace..."
];

const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({
    message,
    size = 'md',
    variant = 'spinner',
    className = "",
    fullHeight = false
}) => {
    // Use random loading message if none provided
    const displayMessage = message || loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

    const renderLoadingAnimation = () => {
        switch (variant) {
            case 'dots':
                return <LoadingDots size={size} />;
            case 'pulse':
                return <LoadingPulse size={size} />;
            case 'skeleton':
                return <LoadingSkeleton />;
            default:
                return <LoadingSpinner size={size} />;
        }
    };

    const containerClasses = fullHeight 
        ? "min-h-screen flex items-center justify-center"
        : "min-h-[200px] flex items-center justify-center";

    if (variant === 'skeleton') {
        return (
            <div className={`lg:col-span-2 glass rounded-2xl p-6 sm:p-8 mt-8 sm:mt-12 ${className}`}>
                <LoadingSkeleton />
            </div>
        );
    }

    return (
        <div 
            className={`lg:col-span-2 glass rounded-2xl p-6 sm:p-8 mt-8 sm:mt-12 ${containerClasses} ${className}`}
            role="status"
            aria-live="polite"
            aria-label={displayMessage}
        >
            <div className="text-center">
                {/* Loading animation */}
                <div className="flex justify-center mb-4">
                    {renderLoadingAnimation()}
                </div>
                
                {/* Loading message */}
                <p className="text-slate-600 dark:text-gray-400 font-medium animate-pulse">
                    {displayMessage}
                </p>
                
                {/* Progress indicator */}
                <div className="mt-6 w-48 mx-auto">
                    <div className="h-1 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 rounded-full animate-pulse loading-bar"></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .loading-bar {
                    animation: loading-bar 2s ease-in-out infinite;
                }
                
                @keyframes loading-bar {
                    0% {
                        width: 0%;
                        margin-left: 0%;
                    }
                    50% {
                        width: 60%;
                        margin-left: 20%;
                    }
                    100% {
                        width: 0%;
                        margin-left: 100%;
                    }
                }
                
                @media (prefers-reduced-motion: reduce) {
                    .animate-spin,
                    .animate-bounce,
                    .animate-pulse,
                    .animate-ping,
                    .loading-bar {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
};

// Preset variants for common use cases
export const QuickLoader = () => (
    <SuspenseLoader variant="dots" size="sm" message="Loading..." />
);

export const FullPageLoader = () => (
    <SuspenseLoader 
        variant="pulse" 
        size="lg" 
        message="Setting up your workspace..." 
        fullHeight 
        className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50"
    />
);

export const SkeletonLoader = () => (
    <SuspenseLoader variant="skeleton" />
);

export const ContentLoader = ({ message = "Loading content..." }: { message?: string }) => (
    <SuspenseLoader variant="spinner" size="md" message={message} />
);

export default SuspenseLoader;