
import { Database, FileText, Server } from 'lucide-react';

export function FeaturesSection() {
    return (
        <section className="py-24 bg-surface text-secondary relative overflow-hidden ">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16">
                    <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-4">
                        System <span className="text-primary">Architecture</span>
                    </h2>
                    <p className="text-xl text-gray-400 font-mono max-w-2xl">
                        Designed for high-throughput reconciliation pipelines. Matches over 1M+ transactions per minute with 99.99% accuracy.
                    </p>
                </div>

                {/* Schematic Diagram */}
                <div className="relative border border-muted/50 p-8 md:p-12 rounded-sm bg-black/50 backdrop-blur-sm">
                    {/* Blueprint Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:20px_20px] opacity-10 pointer-events-none" />

                    <div className="grid md:grid-cols-3 gap-12 relative z-10">
                        {/* Step 1: Ingest */}
                        <FeatureNode
                            icon={<FileText size={32} />}
                            title="Ingest"
                            description="Parses CSV/JSON statements from any bank or gateway."
                            step="01"
                        />

                        {/* Step 2: Match */}
                        <FeatureNode
                            icon={<Server size={32} />}
                            title="Match Engine"
                            description="Fuzzy matching algorithms pair internal records with bank lines."
                            step="02"
                            highlight
                        />

                        {/* Step 3: Report */}
                        <FeatureNode
                            icon={<Database size={32} />}
                            title="Reconcile"
                            description="Generates audit-proof reports and flags mismatches instantly."
                            step="03"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeatureNode({ icon, title, description, step, highlight = false }: {
    icon: React.ReactNode,
    title: string,
    description: string,
    step: string,
    highlight?: boolean
}) {
    return (
        <div className={`relative p-6 border ${highlight ? 'border-primary bg-primary/5' : 'border-muted bg-black'} rounded-sm`}>
            <div className="absolute -top-3 -left-3 bg-background border border-muted px-2 py-1 text-xs font-mono text-gray-500">
                NOD-{step}
            </div>
            <div className={`mb-4 ${highlight ? 'text-primary' : 'text-white'}`}>
                {icon}
            </div>
            <h3 className="text-xl font-heading font-bold uppercase mb-2">{title}</h3>
            <p className="text-sm text-gray-400 font-mono leading-relaxed">
                {description}
            </p>

        </div>
    )
}
