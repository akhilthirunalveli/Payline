import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check } from 'lucide-react';

const TRANSACTIONS = Array.from({ length: 20 }).map((_, i) => ({
    id: `TXN-${1000 + i}`,
    amount: (Math.random() * 1000).toFixed(2),
    merchant: ['AWS', 'GitHub', 'Stripe', 'Uber', 'Slack', 'Vercel', 'Supabase'][Math.floor(Math.random() * 7)],
    status: 'pending',
    date: new Date().toISOString(),
}));

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const receiptY = useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]);

    return (
        <div ref={containerRef} className="h-[250vh] relative bg-background">
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

                {/* Background Grid */}
                <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

                {/* Hero Text Layer - Fixed in background */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none text-white opacity-30 select-none">
                    <h1 className="text-[10vw] font-heading font-bold uppercase leading-[0.8] tracking-tighter text-center">
                        Reconcile<br />Everything
                    </h1>
                    <p className="mt-8 text-xl font-mono text-gray-300 max-w-md text-center">
                        The open-source backend engine for payment reconciliation.
                    </p>
                </div>

                {/* The Infinite Receipt */}
                <motion.div
                    style={{ y: receiptY }}
                    className="relative w-full max-w-md bg-white text-black shadow-2xl z-10 font-mono text-xs md:text-sm origin-top"
                >
                    {/* Receipt Header */}
                    <div className="border-b-2 border-dashed border-black p-4 text-center">
                        <div className="text-2xl font-bold font-heading uppercase mb-2">Statement</div>
                        <div className="text-gray-500">BATCH: #882910-X</div>
                        <div className="text-gray-500">{new Date().toLocaleDateString()}</div>
                    </div>

                    {/* Transaction List */}
                    <div className="p-6 space-y-4">
                        {TRANSACTIONS.map((txn, i) => (
                            <ReceiptItem
                                key={txn.id}
                                txn={txn}
                                index={i}
                                total={TRANSACTIONS.length}
                                scrollYProgress={scrollYProgress}
                            />
                        ))}
                        {/* Infinite fade at bottom */}
                        <div className="h-8 bg-gradient-to-b from-transparent to-white/90" />
                    </div>

                    {/* Jagged Bottom Edge */}
                    <div className="absolute bottom-0 left-0 w-full h-4 bg-white" style={{
                        clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)'
                    }} />
                </motion.div>

                {/* The Scanner Bar (Overlay) */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary z-30" />
                <div className="absolute top-1/2 bg-primary text-black text-xs font-bold px-2 py-1 transform -translate-y-1/2 z-30 right-10 md:right-1/4">
                    LIVE SCANNING
                </div>

            </div>
        </div>
    );
}

function ReceiptItem({ txn, index, total, scrollYProgress }: { txn: any, index: number, total: number, scrollYProgress: any }) {
    // Calculate the threshold where this item crosses the center line.
    // Scroll 0 -> 1 (mapped to 100% -> -100% receipt Y roughly).
    // Center crossing happens when receiptY passes visual center.
    // Heuristic: Uniform distribution of items along the middle portion of the scroll range.
    // Calibrated Intersection Points:
    // Item 0 (Top) passes scanner around p=0.25
    // Item 49 (Bottom) passes scanner around p=0.75
    const startOffset = 0.25;
    const endOffset = 0.75;
    const step = (endOffset - startOffset) / total;
    const threshold = startOffset + (index * step);

    // Checkmark opacity: 0 before threshold, 1 after.
    const opacity = useTransform(scrollYProgress, [threshold - 0.02, threshold], [0, 1]);

    return (
        <div className="flex items-center justify-between group">
            <div className="flex gap-3 items-center">
                <div className="w-4 h-4 flex items-center justify-center rounded-full border border-black overflow-hidden relative">
                    <motion.div style={{ opacity }} className="absolute inset-0 bg-black flex items-center justify-center text-primary">
                        <Check size={10} strokeWidth={4} />
                    </motion.div>
                </div>
                <div>
                    <div className="font-bold">{txn.merchant.toUpperCase()}</div>
                    <div className="text-gray-500">{txn.id}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="font-bold">${txn.amount}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider relative h-3 w-16">
                    {/* Overlap PENDING and RECONCILED with opacity transition */}
                    <motion.span style={{ opacity: useTransform(opacity, [0, 1], [1, 0]) }} className="absolute right-0">PENDING</motion.span>
                    <motion.span style={{ opacity }} className="absolute right-0 font-bold text-black">RECONCILED</motion.span>
                </div>
            </div>
        </div>
    )
}
