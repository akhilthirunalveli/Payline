import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

export function CodeSection() {
    return (
        <section className="py-24 bg-background relative">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

                {/* Left: Text Content */}
                <div>
                    <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-6">
                        3 Lines of <br /> <span className="text-primary">Code</span>
                    </h2>
                    <p className="text-xl text-gray-400 font-mono mb-8 leading-relaxed">
                        Payline abstracts the complexity of fuzzy matching, currency conversion, and ledger locking into a simple, type-safe API.
                    </p>
                    <div className="flex gap-4">
                        <div className="border border-white/20 p-4 rounded min-w-[120px]">
                            <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                            <div className="text-xs text-gray-500 font-mono uppercase">Accuracy</div>
                        </div>
                        <div className="border border-white/20 p-4 rounded min-w-[120px]">
                            <div className="text-2xl font-bold text-white mb-1">&lt; 50ms</div>
                            <div className="text-xs text-gray-500 font-mono uppercase">Latency</div>
                        </div>
                    </div>
                </div>

                {/* Right: Code Block */}
                <div className="relative">
                    <div className="relative bg-surface border border-white/10 rounded-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20" />
                            <div className="ml-auto flex items-center gap-2 text-xs text-gray-500 font-mono">
                                <Terminal size={12} />
                                <span>server.ts</span>
                            </div>
                        </div>
                        <div className="p-6 font-mono text-sm md:text-base leading-relaxed overflow-x-auto">
                            <div className="text-gray-500 mb-2">// Initialize the engine</div>
                            <div><span className="text-purple-400">const</span> <span className="text-blue-400">payline</span> = <span className="text-purple-400">new</span> <span className="text-yellow-300">Payline</span>(process.env.KEY);</div>
                            <br />
                            <div className="text-gray-500 mb-2">// Reconcile instantly</div>
                            <div><span className="text-purple-400">await</span> <span className="text-blue-400">payline</span>.<span className="text-green-400">reconcile</span>({'{'}</div>
                            <div className="pl-4"><span className="text-orange-300">amount</span>: <span className="text-blue-300">5000</span>,</div>
                            <div className="pl-4"><span className="text-orange-300">currency</span>: <span className="text-green-300">'USD'</span>,</div>
                            <div className="pl-4"><span className="text-orange-300">ref</span>: <span className="text-green-300">'txn_123456'</span></div>
                            <div>{'}'});</div>
                        </div>
                    </div>

                    {/* Success Toast Decoration */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="absolute -bottom-6 -right-6 bg-white text-black px-4 py-3 rounded-sm shadow-xl flex items-center gap-3 border border-primary"
                    >
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Terminal size={14} />
                        </div>
                        <div>
                            <div className="font-bold text-xs uppercase">Event Triggered</div>
                            <div className="font-mono text-[10px]">reconciliation.success</div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
