import { Routes, Route, Navigate } from 'react-router-dom';
import { DocsHUD } from '../components/docs/DocsHUD';
import { Guide } from './docs/Guide';
import { ApiReference } from './docs/ApiReference';
import { Examples } from './docs/Examples';

export function DocsPage() {
    return (
        <div className="min-h-screen bg-surface font-sans text-secondary">
            {/* HUD Navigation */}
            <DocsHUD />

            <div className="flex">
                <div className="flex-1">
                    <Routes>
                        <Route index element={<Navigate to="guide" replace />} />
                        <Route path="guide" element={<Guide />} />
                        <Route path="api" element={<ApiReference />} />
                        <Route path="examples" element={<Examples />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
