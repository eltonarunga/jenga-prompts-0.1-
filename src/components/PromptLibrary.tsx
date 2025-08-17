import React, { useState, useMemo, useCallback } from 'react';
import { PromptMode } from '../types';
import { PromptTemplate, templates } from '../templates';

interface PromptLibraryProps {
    onUseTemplate: (template: PromptTemplate) => void;
    className?: string;
    showSearch?: boolean;
    maxTemplatesPerPage?: number;
}

// SVG Icons
const Icons = {
    Image: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
        </svg>
    ),
    Video: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
        </svg>
    ),
    Text: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 4h6v2H7V7zm0 4h6v2H7v-2z"/>
        </svg>
    ),
    Audio: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
        </svg>
    ),
    Code: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
        </svg>
    ),
    Magic: () => (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd"/>
        </svg>
    ),
    Search: () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
        </svg>
    ),
    Library: () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V4.804z"/>
        </svg>
    )
};

const TabButton = React.memo(({ mode, isActive, onClick, children }: {
    mode: PromptMode;
    isActive: boolean;
    onClick: (mode: PromptMode) => void;
    children: React.ReactNode;
}) => {
    const handleClick = useCallback(() => onClick(mode), [mode, onClick]);
    
    return (
        <button
            onClick={handleClick}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                isActive 
                    ? 'bg-purple-600 text-white shadow-md transform scale-105' 
                    : 'text-slate-600 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-gray-700 hover:scale-105'
            }`}
            aria-pressed={isActive}
            role="tab"
            aria-selected={isActive}
        >
            {children}
        </button>
    );
});

const TemplateCard = React.memo(({ template, onUse }: {
    template: PromptTemplate;
    onUse: (template: PromptTemplate) => void;
}) => {
    const handleUse = useCallback(() => onUse(template), [template, onUse]);

    return (
        <article className="bg-slate-100 dark:bg-gray-800/50 hover:bg-slate-200 dark:hover:bg-gray-800/70 p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg flex flex-col group border border-slate-200 dark:border-gray-700">
            <header className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {template.title}
                </h3>
                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 flex-grow">
                    {template.description}
                </p>
            </header>
            
            {template.tags && (
                <div className="mb-4 flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag, index) => (
                        <span 
                            key={index}
                            className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                    {template.tags.length > 3 && (
                        <span className="text-xs text-slate-500 dark:text-gray-400">
                            +{template.tags.length - 3} more
                        </span>
                    )}
                </div>
            )}
            
            <footer className="mt-auto">
                <button 
                    onClick={handleUse}
                    className="w-full bg-purple-500/90 hover:bg-purple-600 active:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:scale-105"
                    aria-label={`Use template: ${template.title}`}
                >
                    <Icons.Magic />
                    Use Template
                </button>
            </footer>
        </article>
    );
});

const PromptLibrary: React.FC<PromptLibraryProps> = ({ 
    onUseTemplate, 
    className = "",
    showSearch = true,
    maxTemplatesPerPage = 12
}) => {
    const [activeTab, setActiveTab] = useState<PromptMode>(PromptMode.Image);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Get available modes from templates
    const availableModes = useMemo(() => {
        const modes = new Set(templates.map(t => t.mode));
        return Array.from(modes).sort();
    }, []);

    // Tab options with dynamic icons
    const tabOptions = useMemo(() => 
        availableModes.map(mode => ({
            mode,
            icon: Icons[mode as keyof typeof Icons] || Icons.Text,
            label: `${mode} Prompts`
        })), [availableModes]
    );

    // Filtered and searched templates
    const filteredTemplates = useMemo(() => {
        let filtered = templates.filter(t => t.mode === activeTab);
        
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(t => 
                t.title.toLowerCase().includes(query) ||
                t.description.toLowerCase().includes(query) ||
                t.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }
        
        return filtered;
    }, [activeTab, searchQuery]);

    // Paginated templates
    const paginatedTemplates = useMemo(() => {
        const startIndex = (currentPage - 1) * maxTemplatesPerPage;
        return filteredTemplates.slice(startIndex, startIndex + maxTemplatesPerPage);
    }, [filteredTemplates, currentPage, maxTemplatesPerPage]);

    const totalPages = Math.ceil(filteredTemplates.length / maxTemplatesPerPage);

    const handleTabChange = useCallback((mode: PromptMode) => {
        setActiveTab(mode);
        setCurrentPage(1);
        setSearchQuery('');
    }, []);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        // Smooth scroll to top
        document.querySelector('#library-heading')?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // Don't render if no templates
    if (templates.length === 0) {
        return null;
    }

    return (
        <section 
            className={`lg:col-span-2 glass rounded-2xl p-6 sm:p-8 mt-8 sm:mt-12 fade-in ${className}`}
            style={{ animationDelay: '1s' }}
            aria-labelledby="library-heading"
            role="region"
        >
            <header className="mb-8">
                <h2 id="library-heading" className="text-2xl sm:text-3xl font-bold mb-6 text-center gradient-text flex items-center justify-center gap-3">
                    <Icons.Library />
                    Prompt Library
                    <span className="text-sm font-normal text-slate-500 dark:text-gray-400">
                        ({templates.length} templates)
                    </span>
                </h2>

                {/* Search Bar */}
                {showSearch && (
                    <div className="max-w-md mx-auto mb-6 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icons.Search />
                        </div>
                        <input
                            type="search"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-gray-800 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                            aria-label="Search prompt templates"
                        />
                    </div>
                )}

                {/* Tabs */}
                <nav className="flex justify-center">
                    <div 
                        className="p-1 bg-slate-200 dark:bg-gray-800 rounded-xl flex flex-wrap gap-1 shadow-inner"
                        role="tablist"
                        aria-label="Template categories"
                    >
                        {tabOptions.map(({ mode, icon: IconComponent, label }) => (
                            <TabButton
                                key={mode}
                                mode={mode}
                                isActive={activeTab === mode}
                                onClick={handleTabChange}
                            >
                                <IconComponent />
                                <span className="hidden sm:inline">{label}</span>
                                <span className="sm:hidden">{mode}</span>
                            </TabButton>
                        ))}
                    </div>
                </nav>
            </header>

            {/* Results Info */}
            <div className="mb-6 text-center">
                <p className="text-sm text-slate-600 dark:text-gray-400">
                    {searchQuery ? (
                        <>Showing {filteredTemplates.length} result{filteredTemplates.length !== 1 ? 's' : ''} for "{searchQuery}"</>
                    ) : (
                        <>Showing {filteredTemplates.length} {activeTab.toLowerCase()} template{filteredTemplates.length !== 1 ? 's' : ''}</>
                    )}
                </p>
            </div>

            {/* Template Grid */}
            {paginatedTemplates.length > 0 ? (
                <div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    role="grid"
                    aria-label={`${activeTab} prompt templates`}
                >
                    {paginatedTemplates.map((template, index) => (
                        <div key={`${template.title}-${index}`} role="gridcell">
                            <TemplateCard 
                                template={template}
                                onUse={onUseTemplate}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-slate-400 dark:text-gray-500 mb-4">
                        <Icons.Search />
                    </div>
                    <h3 className="text-lg font-medium text-slate-600 dark:text-gray-400 mb-2">
                        No templates found
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-gray-500">
                        {searchQuery ? (
                            <>Try adjusting your search terms or <button 
                                onClick={() => setSearchQuery('')}
                                className="text-purple-600 hover:text-purple-700 underline"
                            >
                                clear search
                            </button></>
                        ) : (
                            `No ${activeTab.toLowerCase()} templates available yet.`
                        )}
                    </p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <nav 
                    className="mt-8 flex justify-center items-center gap-2"
                    aria-label="Template pagination"
                >
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm bg-slate-200 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-lg hover:bg-slate-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        aria-label="Previous page"
                    >
                        Previous
                    </button>

                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-2 text-sm rounded-lg transition-all ${
                                        currentPage === page
                                            ? 'bg-purple-600 text-white shadow-md'
                                            : 'bg-slate-200 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-gray-600'
                                    }`}
                                    aria-label={`Page ${page}`}
                                    aria-current={currentPage === page ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm bg-slate-200 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-lg hover:bg-slate-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        aria-label="Next page"
                    >
                        Next
                    </button>
                </nav>
            )}
        </section>
    );
};

TabButton.displayName = 'TabButton';
TemplateCard.displayName = 'TemplateCard';

export default PromptLibrary;