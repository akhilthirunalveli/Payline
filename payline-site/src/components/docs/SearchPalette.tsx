import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CornerDownLeft, FileText, Terminal, Hash, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SEARCH_ITEMS = [
    { title: 'Installation', path: '/docs/guide', category: 'Guide', icon: FileText },
    { title: 'Configuration', path: '/docs/guide', category: 'Guide', icon: FileText },
    { title: 'Ingest Pipeline', path: '/docs/guide', category: 'Guide', icon: FileText },
    { title: 'payline.reconcile()', path: '/docs/api', category: 'API', icon: Terminal },
    { title: 'payline.match()', path: '/docs/api', category: 'API', icon: Terminal },
    { title: 'Webhooks', path: '/docs/api', category: 'API', icon: Hash },
    { title: 'Stripe Integration', path: '/docs/examples', category: 'Examples', icon: Code },
    { title: 'CSV Parsing', path: '/docs/examples', category: 'Examples', icon: Code },
];

export function SearchPalette({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const filtered = SEARCH_ITEMS.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    // Keyboard navigation handlers
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (isOpen) onClose(); else { /* parent handles open */ }
            }
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSelect = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="w-full max-w-lg bg-surface border border-white/10 rounded-lg shadow-2xl overflow-hidden relative"
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5">
                            <Search className="text-gray-500" size={20} />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search documentation..."
                                className="bg-transparent border-none outline-none text-lg text-white placeholder-gray-600 flex-1 font-mono"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <div className="px-2 py-1 bg-white/10 rounded text-xs text-gray-500 font-mono">ESC</div>
                        </div>

                        {/* Results */}
                        <div className="max-h-[300px] overflow-y-auto p-2" data-lenis-prevent>
                            {filtered.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 font-mono text-sm">
                                    No results found for "{query}"
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {filtered.map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSelect(item.path)}
                                            className="w-full flex items-center justify-between p-3 rounded hover:bg-white/5 transition-colors group text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-black border border-white/10 rounded group-hover:border-primary/50 transition-colors">
                                                    <item.icon size={14} className="text-gray-400 group-hover:text-primary" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-200 group-hover:text-white">{item.title}</div>
                                                    <div className="text-[10px] text-gray-500 font-mono uppercase">{item.category}</div>
                                                </div>
                                            </div>
                                            <CornerDownLeft size={14} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-black/50 px-4 py-2 text-[10px] text-gray-600 font-mono border-t border-white/5 flex justify-between">
                            <span>Search by keyword</span>
                            <div className="flex gap-4">
                                <span>↑↓ Navigate</span>
                                <span>↵ Select</span>
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}


