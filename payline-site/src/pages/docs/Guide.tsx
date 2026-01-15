import { Copy, Terminal, CheckCircle2 } from 'lucide-react';

export function Guide() {
    return (
        <div className="max-w-4xl mx-auto py-24 px-8">
            <header className="mb-20">
                <div className="text-primary font-mono text-sm mb-4 tracking-widest">DOCS / GUIDE</div>
                <h1 className="text-5xl md:text-7xl font-heading font-bold uppercase mb-8 tracking-tighter">
                    The Manual
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed font-mono max-w-2xl border-l-2 border-primary pl-6">
                    Payline is an opinionated reconciliation engine. It takes two streams of messy financial data and returns a single stream of truth.
                </p>
            </header>

            <div className="space-y-20">

                {/* SECTION 1: INSTALLATION */}
                <section>
                    <h2 className="text-3xl font-heading font-bold uppercase mb-6 flex items-center gap-3">
                        <span className="text-primary">01.</span> Installation
                    </h2>
                    <p className="text-gray-400 font-mono mb-6">Install the core SDK and the CLI tools for your environment.</p>

                    <div className="bg-black border border-white/10 rounded-sm overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                                <Terminal size={14} />
                                <span>Terminal</span>
                            </div>
                            <Copy size={14} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
                        </div>
                        <div className="p-4 font-mono text-sm text-white">
                            npm install <span className="text-primary">@payline/sdk</span> @payline/cli
                        </div>
                    </div>
                </section>

                {/* SECTION 2: CONFIGURATION */}
                <section>
                    <h2 className="text-3xl font-heading font-bold uppercase mb-6 flex items-center gap-3">
                        <span className="text-primary">02.</span> Configuration
                    </h2>
                    <p className="text-gray-400 font-mono mb-6">
                        Payline requires a connection to your primary ledger (e.g., PostgreSQL, internal API) and your payment gateways.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-surface border border-white/10 p-6 rounded-sm">
                            <h3 className="font-bold text-white mb-2 font-heading uppercase">Environment Variables</h3>
                            <p className="text-xs text-gray-500 font-mono mb-4">Set these in your .env file</p>
                            <div className="space-y-3 font-mono text-xs text-gray-300">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>PAYLINE_SECRET_KEY</span>
                                    <span className="text-primary">sk_live_...</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>LEDGER_DB_URL</span>
                                    <span className="text-gray-500">postgres://...</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>WEBHOOK_SECRET</span>
                                    <span className="text-gray-500">whsec_...</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface border border-white/10 p-6 rounded-sm flex flex-col justify-center">
                            <div className="flex items-start gap-4 mb-4">
                                <CheckCircle2 className="text-primary shrink-0" size={20} />
                                <div className="text-sm text-gray-400 font-mono">
                                    <strong className="text-white block mb-1">Auto-Discovery</strong>
                                    Payline automatically detects supported gateways (Stripe, Adyen, PayPal) based on transaction metadata.
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: CORE WORKFLOW */}
                <section>
                    <h2 className="text-3xl font-heading font-bold uppercase mb-6 flex items-center gap-3">
                        <span className="text-primary">03.</span> The Pipeline
                    </h2>
                    <p className="text-gray-400 font-mono mb-8">
                        Reconciliation happens in three distinct phases. You can hook into any phase via webhooks.
                    </p>

                    <div className="border-l border-white/10 pl-8 space-y-12 relative">
                        {/* Step 1 */}
                        <div className="relative">
                            <div className="absolute -left-[39px] top-0 w-5 h-5 bg-black border border-primary rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-primary rounded-full" />
                            </div>
                            <h3 className="text-xl font-bold text-white uppercase font-heading mb-2">Ingest</h3>
                            <p className="text-gray-500 font-mono text-sm max-w-lg mb-4">
                                Raw settlement files (CSV, MT940) or API events are ingested into a temporary <span className="text-white">staging ledger</span>.
                            </p>
                            <CodeSnippet code={`await payline.ingest(fileBuffer, { source: 'stripe_payouts' });`} />
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <div className="absolute -left-[39px] top-0 w-5 h-5 bg-black border border-gray-700 rounded-full" />
                            <h3 className="text-xl font-bold text-white uppercase font-heading mb-2">Match</h3>
                            <p className="text-gray-500 font-mono text-sm max-w-lg mb-4">
                                The <span className="text-white">Matching Engine</span> runs heuristic rules to pair staging items with your internal ledger.
                            </p>
                            <CodeSnippet code={`// Returns a MatchResult object with confidence scores
const report = await payline.match({ window: '24h' });`} />
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <div className="absolute -left-[39px] top-0 w-5 h-5 bg-black border border-gray-700 rounded-full" />
                            <h3 className="text-xl font-bold text-white uppercase font-heading mb-2">Reconcile</h3>
                            <p className="text-gray-500 font-mono text-sm max-w-lg mb-4">
                                Confirmed matches are locked. Mismatches generate exception reports for manual review.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: CLI */}
                <section>
                    <div className="bg-primary/5 border border-primary/20 p-8 rounded-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-black border border-primary rounded text-primary">
                                <Terminal size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-heading font-bold uppercase text-white">Manual Override</h3>
                                <p className="text-gray-400 font-mono text-sm">Sometimes you need to brute-force a reconciliation.</p>
                            </div>
                        </div>
                        <div className="font-mono text-sm bg-black p-4 rounded text-gray-300">
                            $ payline reconcile --force --id=txn_88291 --amount=500.00
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}

function CodeSnippet({ code }: { code: string }) {
    return (
        <div className="bg-black border border-white/10 p-4 rounded-sm font-mono text-xs md:text-sm text-blue-300 overflow-x-auto">
            {code}
        </div>
    )
}
