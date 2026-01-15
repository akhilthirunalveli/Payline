

export function Footer() {
    return (
        <footer className="bg-surface text-secondary py-12">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
                <div className="col-span-2">
                    <div className="text-2xl font-heading font-bold tracking-tighter mb-4">PAYLINE</div>
                    <p className="text-gray-400 font-mono text-sm max-w-sm">
                        The next-generation reconciliation engine for high-growth fintech companies.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold uppercase mb-4 text-sm">Resources</h4>
                    <ul className="space-y-2 text-sm text-gray-400 font-mono">
                        <li><a href="/docs/guide" className="hover:text-primary transition-colors">Documentation</a></li>
                        <li><a href="/docs/api" className="hover:text-primary transition-colors">API Reference</a></li>
                        <li><a href="/status" className="hover:text-primary transition-colors">System Status</a></li>
                    </ul>
                </div>

            </div>
        </footer>
    );
}
