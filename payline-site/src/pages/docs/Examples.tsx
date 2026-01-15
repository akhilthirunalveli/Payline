import { Code } from 'lucide-react';

export function Examples() {
    return (
        <div className="max-w-4xl mx-auto py-24 px-8">
            <div className="mb-12">
                <div className="text-primary font-mono text-sm mb-4">DOCS / EXAMPLES</div>
                <h1 className="text-5xl font-heading font-bold uppercase mb-6">Cookbook</h1>
                <p className="text-xl text-gray-400 leading-relaxed font-mono">
                    Common patterns and integrations for everyday reconciliation tasks.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExampleCard
                    title="Stripe Integration"
                    desc="Automatically sync and reconcile Stripe payouts."
                    lang="Node.js"
                />
                <ExampleCard
                    title="CSV Bulk Import"
                    desc="Process legacy bank statements via flat file upload."
                    lang="TypeScript"
                />
                <ExampleCard
                    title="Multi-Currency"
                    desc="Handling FX rates and conversion variance."
                    lang="Python"
                />
                <ExampleCard
                    title="Webhooks"
                    desc="Listening for RECONCILED events in your app."
                    lang="Go"
                />
            </div>
        </div>
    );
}

function ExampleCard({ title, desc, lang }: { title: string, desc: string, lang: string }) {
    return (
        <div className="group border border-white/10 p-6 rounded-sm bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 border border-white/10 rounded-sm bg-black">
                    <Code size={20} className="text-primary" />
                </div>
                <span className="text-[10px] font-mono border border-white/20 px-2 py-1 rounded-full text-gray-400">
                    {lang}
                </span>
            </div>
            <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-sm text-gray-400 font-mono leading-relaxed">
                {desc}
            </p>
        </div>
    )
}
