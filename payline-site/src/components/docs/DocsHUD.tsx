import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Code, Terminal, Home, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { SearchPalette } from './SearchPalette';

export function DocsHUD() {
    const location = useLocation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const isActive = (path: string) => location.pathname.includes(path);

    // Global keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <SearchPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 shadow-2xl flex items-center gap-2">

                    <HudItem icon={<Home size={18} />} label="Home" to="/" />
                    <div className="w-px h-4 bg-white/20 mx-2" />
                    <HudItem icon={<Book size={18} />} label="Guide" to="/docs/guide" active={isActive('/docs/guide')} />
                    <HudItem icon={<Terminal size={18} />} label="API" to="/docs/api" active={isActive('/docs/api')} />
                    <HudItem icon={<Code size={18} />} label="Examples" to="/docs/examples" active={isActive('/docs/examples')} />
                    <div className="w-px h-4 bg-white/20 mx-2" />
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-primary transition-colors tooltip relative group"
                        title="Search (Cmd+K)"
                    >
                        <Search size={18} />
                    </button>

                </div>
            </div>
        </>
    );
}

function HudItem({ icon, label, to, active }: { icon: any, label: string, to: string, active?: boolean }) {
    return (
        <Link to={to} className={`relative p-2 rounded-full transition-colors group flex items-center gap-2 ${active ? 'text-primary' : 'text-gray-400 hover:text-white'}`}>
            {icon}
            <span className="text-xs font-mono font-bold hidden group-hover:block whitespace-nowrap overflow-hidden px-1">
                {label}
            </span>
            {active && <motion.div layoutId="hud-active" className="absolute inset-0 bg-white/5 rounded-full -z-10" />}
        </Link>
    )
}
