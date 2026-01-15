import { Link } from 'react-router-dom';
import { ShieldCheck, Server, Globe2, Lock, Zap, Gauge, ArrowLeft } from 'lucide-react';

export function StatusPage() {
    return (
        <div className="min-h-screen bg-surface font-sans text-secondary flex flex-col items-center py-24 px-8 relative">
            <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-mono text-sm group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Home</span>
            </Link>
            <div className="max-w-4xl w-full">

                {/* Page Header */}
                <div className="mb-12">
                    <div className="text-primary font-mono text-sm mb-4">INFRASTRUCTURE / RELIABILITY</div>
                    <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter mb-4">
                        Platform <span className="text-primary">Standards</span>
                    </h1>
                    <p className="text-gray-400 font-mono text-lg max-w-xl">
                        Engineered for mission-critical financial workloads.
                    </p>
                </div>

                {/* Top Banner (SLA) */}
                <div className="bg-black/40 border border-white/10 p-8 rounded-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
                            <ShieldCheck size={32} className="text-primary" />
                        </div>
                        <div>
                            <h2 className="text- white text-xl font-bold uppercase font-heading">99.99% Uptime SLA</h2>
                            <p className="text-gray-400 text-sm font-mono">Guaranteed availability for Enterprise customers.</p>
                        </div>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-3xl font-bold text-white font-mono">24/7</div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Support Coverage</div>
                    </div>
                </div>

                {/* Performance Benchmarks */}
                <h3 className="text-gray-500 font-mono text-xs font-bold uppercase mb-6 tracking-widest px-1">Performance Benchmarks</h3>
                <div className="grid md:grid-cols-2 gap-px bg-white/10 mb-16 rounded-sm overflow-hidden border border-white/5">
                    <ReliabilityItem
                        icon={<Zap size={20} />}
                        label="Processing Latency"
                        value="< 50ms"
                        sub="P99 Latency for Reconciliation"
                    />
                    <ReliabilityItem
                        icon={<Gauge size={20} />}
                        label="Throughput Capacity"
                        value="10k tps"
                        sub="Transactions Per Second"
                    />
                    <ReliabilityItem
                        icon={<Server size={20} />}
                        label="Data Retention"
                        value="7 Years"
                        sub="Immutable Ledger Storage"
                    />
                    <ReliabilityItem
                        icon={<Globe2 size={20} />}
                        label="Global Regions"
                        value="12"
                        sub="Multi-Region Redundancy"
                    />
                </div>

                {/* Security & Compliance */}
                <h3 className="text-gray-500 font-mono text-xs font-bold uppercase mb-6 tracking-widest px-1">Security & Compliance</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <ComplianceCard
                        title="SOC 2 Type II"
                        desc="Audited annually for security, availability, and confidentiality."
                    />
                    <ComplianceCard
                        title="PCI-DSS Level 1"
                        desc="Highest level of certification for payment data security."
                    />
                    <ComplianceCard
                        title="GDPR / CCPA"
                        desc="Full compliance with global data privacy regulations."
                    />
                </div>

            </div>
        </div>
    );
}

function ReliabilityItem({ icon, label, value, sub }: { icon: any, label: string, value: string, sub: string }) {
    return (
        <div className="p-8 bg-surface hover:bg-white/5 transition-colors flex items-start justify-between group">
            <div className="flex flex-col h-full justify-between gap-4">
                <div className="flex items-center gap-3 text-gray-400 group-hover:text-primary transition-colors">
                    {icon}
                    <span className="font-mono text-xs uppercase tracking-wider">{label}</span>
                </div>
                <div>
                    <div className="text-3xl font-bold text-white mb-1 font-heading tracking-wide">{value}</div>
                    <div className="text-gray-500 text-xs">{sub}</div>
                </div>
            </div>
        </div>
    )
}

function ComplianceCard({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="border border-white/10 p-6 bg-black/50 rounded-sm">
            <div className="flex items-center gap-3 mb-4">
                <Lock size={18} className="text-primary" />
                <h4 className="font-bold text-white uppercase tracking-wider text-sm">{title}</h4>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
                {desc}
            </p>
        </div>
    )
}
