/**
 * App — Main application layout with ARIA landmarks.
 *
 * Accessibility features:
 *   - role="banner" on header
 *   - <nav aria-label="Main navigation">
 *   - id="main-content" tabIndex={-1} as skip-link target
 *   - role="contentinfo" on footer
 *   - Error boundary wraps the entire app
 */

import { useEffect } from 'react';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { SkipLink } from './components/shared/SkipLink';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { CarbonForm } from './components/Calculator/CarbonForm';
import { ResultsDisplay } from './components/Calculator/ResultsDisplay';
import { InsightsList } from './components/Insights/InsightsList';
import { HistoryChart } from './components/History/HistoryChart';
import { HistoryTable } from './components/History/HistoryTable';
import { useCarbonStore } from './store/carbonStore';

const NavLink = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
    className={`
      px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
      ${
        active
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 active:scale-95'
          : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
      }
    `}
  >
    <span>{label}</span>
  </button>
);

function AppContent() {
  const step = useCarbonStore(s => s.step);
  const setStep = useCarbonStore(s => s.setStep);
  const result = useCarbonStore(s => s.result);
  const insights = useCarbonStore(s => s.insights);
  const history = useCarbonStore(s => s.history);
  const isLoadingHistory = useCarbonStore(s => s.isLoadingHistory);
  const fetchHistory = useCarbonStore(s => s.fetchHistory);
  const reset = useCarbonStore(s => s.reset);

  const handleHistoryClick = () => {
    setStep('history');
    fetchHistory();
  };

  // Focus main content area on step change (for keyboard/screen reader users)
  useEffect(() => {
    const main = document.getElementById('main-content');
    if (main) main.focus();
  }, [step]);

  return (
    <div className="relative min-h-screen bg-slate-50/50 overflow-hidden" translate="no">
      {/* Premium Decorative Blobs */}
      <div className="absolute top-24 left-[-10%] w-[40rem] h-[40rem] rounded-full bg-emerald-100/40 blur-3xl pointer-events-none animate-blob-slow" />
      <div className="absolute bottom-10 right-[-10%] w-[50rem] h-[50rem] rounded-full bg-teal-100/30 blur-3xl pointer-events-none animate-blob-delayed" />

      {/* Skip Link */}
      <SkipLink />

      {/* ------------------------------------------------------------------ */}
      {/* Header / Navigation                                                  */}
      {/* ------------------------------------------------------------------ */}
      <header
        role="banner"
        className="sticky top-0 z-40 bg-white/75 backdrop-blur-md border-b border-slate-100 shadow-sm"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={reset}
            aria-label="Carbon Footprint Platform — return to calculator"
            className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl p-1 transition-all duration-150 active:scale-95"
          >
            <span className="text-2xl filter drop-shadow-sm" aria-hidden="true">
              🌍
            </span>
            <div className="text-left">
              <span className="block text-sm font-extrabold text-slate-800 leading-tight tracking-tight">
                <span>Carbon Platform</span>
              </span>
              <span className="block text-[10px] font-semibold text-emerald-600 uppercase tracking-wider leading-tight">
                <span>Understand · Track · Reduce</span>
              </span>
            </div>
          </button>

          {/* Navigation */}
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-2 list-none m-0 p-0">
              <li>
                <NavLink
                  label="Calculate"
                  active={step === 'form' || step === 'results'}
                  onClick={() => setStep(result ? 'results' : 'form')}
                />
              </li>
              <li>
                <NavLink label="History" active={step === 'history'} onClick={handleHistoryClick} />
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Hero Banner (only on form step)                                      */}
      {/* ------------------------------------------------------------------ */}
      {step === 'form' && (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-emerald-900 text-white py-14 px-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_50%)]" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-100">
              <span>What's Your Carbon Footprint?</span>
            </h1>
            <p className="text-emerald-100/90 text-base sm:text-lg max-w-2xl mx-auto font-medium">
              <span>Enter your lifestyle data below to calculate your annual CO₂e emissions, compare to
              global benchmarks, and receive AI-powered personalised actions.</span>
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <span className="flex items-center gap-2 bg-emerald-950/50 px-3.5 py-1.5 rounded-full border border-emerald-500/20 backdrop-blur-sm">
                <span aria-hidden="true">📊</span><span> Science-backed factors</span>
              </span>
              <span className="flex items-center gap-2 bg-emerald-950/50 px-3.5 py-1.5 rounded-full border border-emerald-500/20 backdrop-blur-sm">
                <span aria-hidden="true">✨</span><span> Gemini AI insights</span>
              </span>
              <span className="flex items-center gap-2 bg-emerald-950/50 px-3.5 py-1.5 rounded-full border border-emerald-500/20 backdrop-blur-sm">
                <span aria-hidden="true">🔒</span><span> Anonymous & private</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Main Content                                                         */}
      {/* ------------------------------------------------------------------ */}
      <main
        id="main-content"
        tabIndex={-1}
        aria-label="Main content"
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8 focus:outline-none"
      >
        {step === 'form' && <CarbonForm />}

        {step === 'results' && result && (
          <div className="space-y-8">
            {/* Back button */}
            <button
              onClick={() => setStep('form')}
              aria-label="Back to calculator form"
              className="
                flex items-center gap-2 text-sm text-gray-500 hover:text-primary-700
                focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-2 py-1
                transition-colors duration-150
              "
            >
              <span aria-hidden="true">←</span><span> Back to Calculator</span>
            </button>
            <ResultsDisplay result={result} />
            {insights && <InsightsList insightsResponse={insights} />}
          </div>
        )}

        {step === 'history' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1"><span>Your Carbon History</span></h1>
              <p className="text-gray-500 text-sm">
                <span>Track your footprint over time to see the impact of your changes.</span>
              </p>
            </div>
            {isLoadingHistory ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner label="Loading your history..." size="lg" />
              </div>
            ) : (
              <>
                <HistoryChart history={history} />
                <HistoryTable history={history} />
              </>
            )}
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                               */}
      {/* ------------------------------------------------------------------ */}
      <footer role="contentinfo" className="border-t border-gray-100 bg-white mt-16 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Data Sources</h2>
              <ul className="text-xs text-gray-500 space-y-1 list-none">
                <li><span>UK DEFRA 2023 — Transport & Home Energy factors</span></li>
                <li><span>US EPA 2023 — Electricity grid emissions</span></li>
                <li><span>ICAO Carbon Calculator — Aviation emissions</span></li>
                <li><span>Our World in Data 2023 — Diet emissions & global average</span></li>
                <li><span>IPCC AR6 / SR1.5 — Consumption & Paris target</span></li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">About</h2>
              <p className="text-xs text-gray-500">
                <span>This tool provides estimates for educational purposes based on peer-reviewed
                emission factors. Individual results may vary based on local grid mix, vehicle
                efficiency, and personal circumstances.</span>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
            <span><span>© 2024 Carbon Footprint Awareness Platform</span></span>
            <span className="flex items-center gap-1">
              <span>Powered by</span>{' '}
              <span aria-label="Google Gemini AI" className="font-medium text-gray-500">
                <span>Google Gemini</span>
              </span>{' '}
              <span>·</span>{' '}
              <span aria-label="Google Cloud" className="font-medium text-gray-500">
                <span>Google Cloud</span>
              </span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
