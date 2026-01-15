export function ApiReference() {
    return (
        <div className="max-w-4xl mx-auto py-24 px-8">
            <div className="mb-12">
                <div className="text-primary font-mono text-sm mb-4">DOCS / API</div>
                <h1 className="text-5xl font-heading font-bold uppercase mb-6">API <br />Reference</h1>
                <p className="text-xl text-gray-400 leading-relaxed font-mono">
                    Programmatic access to the Payline reconciliation engine.
                </p>
            </div>

            <div className="space-y-12">
                <ApiEndpoint
                    method="POST"
                    path="/v1/reconcile"
                    description="Submit a transaction for immediate partial or full reconciliation."
                />

                <ApiEndpoint
                    method="GET"
                    path="/v1/transactions/:id"
                    description="Retrieve detailed status and timeline for a specific transaction ID."
                />

                <ApiEndpoint
                    method="POST"
                    path="/v1/webhooks"
                    description="Register a URL to receive real-time events."
                />
            </div>
        </div>
    );
}

function ApiEndpoint({ method, path, description }: { method: string, path: string, description: string }) {
    const color = method === 'GET' ? 'text-blue-400' : method === 'POST' ? 'text-primary' : 'text-orange-400';

    return (
        <div className="border border-white/10 p-6 rounded-sm bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-3 font-mono text-lg mb-4">
                <span className={`font-bold ${color}`}>{method}</span>
                <span className="text-white">{path}</span>
            </div>
            <p className="text-gray-400 text-sm font-mono leading-relaxed">
                {description}
            </p>
            <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                <div className="px-2 py-1 bg-black/50 border border-white/10 rounded text-[10px] text-gray-500 font-mono">REQ</div>
                <div className="px-2 py-1 bg-black/50 border border-white/10 rounded text-[10px] text-gray-500 font-mono">RES</div>
            </div>
        </div>
    )
}
