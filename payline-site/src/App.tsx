import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HeroSection } from './components/landing/HeroSection';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { Footer } from './components/layout/Footer';
import { CodeSection } from './components/landing/CodeSection';


function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-secondary selection:bg-primary selection:text-black">
      <header className="fixed top-0 w-full z-50 mix-blend-difference text-white">
        <div className=" max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
          <div className="text-2xl font-heading font-bold tracking-tighter z-10">PAYLINE</div>

          <nav className="hidden md:flex gap-8 text-sm font-medium opacity-80 absolute left-1/2 -translate-x-1/2">
            <a href="/docs/guide" className="hover:opacity-100 transition-opacity">DOCUMENTATION</a>
            <a href="/status" className="hover:opacity-100 transition-opacity">RELIABILITY</a>
            <a href="https://github.com/akhilthirunalveli/Payline" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity">GITHUB</a>
          </nav>

          <div className="flex gap-4 z-10">
            <a href="/docs/guide" className="bg-white text-black px-4 py-2 text-sm font-bold uppercase hover:bg-primary transition-colors">
              Read the Docs
            </a>
          </div>
        </div>
      </header>

      <main>
        <HeroSection />
        <FeaturesSection />
        <CodeSection />
      </main>
      <Footer />
    </div>
  );
}


import { DocsPage } from './pages/DocsPage';
import { StatusPage } from './pages/StatusPage';

import { SmoothScroll } from './components/layout/SmoothScroll';

function App() {
  return (
    <Router>
      <SmoothScroll />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/docs/*" element={<DocsPage />} />
      </Routes>
    </Router>
  );
}


export default App;
