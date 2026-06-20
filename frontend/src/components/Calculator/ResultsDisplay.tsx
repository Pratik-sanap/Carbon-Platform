/**
 * ResultsDisplay — Carbon calculation results with comparisons and chart.
 *
 * Accessibility features:
 *   - <section aria-labelledby="results-heading">
 *   - aria-live="polite" so screen readers announce new results
 *   - Progress bars have aria-label with percentage and comparison target
 *   - "Get Personalized Insights" button triggers AI insights flow
 */

import { useCarbonStore } from '../../store/carbonStore';
import type { CarbonResult } from '../../types';
import { formatKg, getFootprintLabel } from '../../utils/formatters';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { CategoryChart } from './CategoryChart';

interface ResultsDisplayProps {
  result: CarbonResult;
}

const ComparisonBar = ({
  id,
  label,
  pct,
  benchmark,
  benchmarkKg,
}: {
  id: string;
  label: string;
  pct: number;
  benchmark: string;
  benchmarkKg: number;
}) => {
  const clampedPct = Math.min(pct, 200);
  const barWidth = Math.min(clampedPct / 2, 100); // 200% maps to full bar width
  const isGood = pct <= 100;
  const isWarning = pct > 100 && pct <= 150;

  const barColor = isGood
    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
    : isWarning
      ? 'bg-gradient-to-r from-amber-500 to-orange-400'
      : 'bg-gradient-to-r from-rose-500 to-red-600';

  const badgeText = isGood
    ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
    : isWarning
      ? 'text-amber-700 bg-amber-50 border-amber-100'
      : 'text-rose-700 bg-rose-50 border-rose-100';

  return (
    <div className="space-y-2.5 p-4 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50/55 transition-all duration-200">
      <div className="flex justify-between items-center text-sm">
        <span className="font-bold text-slate-700">{label}</span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeText}`}>
          {pct.toFixed(0)}%{' '}
          <span className="font-medium opacity-85">of {formatKg(benchmarkKg)}</span>
        </span>
      </div>
      <div
        className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={200}
        aria-label={`${label}: your footprint is ${pct.toFixed(0)}% of the ${benchmark} (${formatKg(benchmarkKg)}/year)`}
        id={id}
      >
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${barWidth}%` }}
        />
        {/* 100% marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-slate-350 opacity-80"
          style={{ left: '50%' }}
          aria-hidden="true"
        />
      </div>
      <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
        {pct <= 100 ? (
          <span className="text-emerald-600">{`🌿 Below the ${benchmark}`}</span>
        ) : (
          <span className="text-rose-600">{`⚠️ ${(pct - 100).toFixed(0)}% above the ${benchmark}`}</span>
        )}
      </p>
    </div>
  );
};

export const ResultsDisplay = ({ result }: ResultsDisplayProps) => {
  const fetchInsights = useCarbonStore(s => s.fetchInsights);
  const isLoadingInsights = useCarbonStore(s => s.isLoadingInsights);
  const insights = useCarbonStore(s => s.insights);

  const { label } = getFootprintLabel(result.vs_global_average_pct);

  let labelColor = '';
  if (result.vs_global_average_pct <= 50) {
    labelColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  } else if (result.vs_global_average_pct <= 100) {
    labelColor = 'bg-green-500/20 text-green-300 border-green-500/30';
  } else if (result.vs_global_average_pct <= 150) {
    labelColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  } else {
    labelColor = 'bg-red-500/20 text-red-300 border-red-500/30';
  }

  return (
    <section
      aria-labelledby="results-heading"
      aria-live="polite"
      aria-atomic="true"
      className="space-y-6 animate-slide-up"
    >
      {/* Total Footprint Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-emerald-900 rounded-3xl p-8 text-center shadow-xl shadow-emerald-950/15 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_40%)]" />
        <h2
          id="results-heading"
          className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 relative z-10"
        >
          <span>Your Annual Carbon Footprint</span>
        </h2>
        <div className="flex items-baseline justify-center gap-2 mb-4 relative z-10">
          <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-200 tabular-nums">
            {formatKg(result.total_kg)}
          </span>
          <span className="text-xl text-emerald-350 font-semibold"><span>CO₂e</span></span>
        </div>
        <div className="relative z-10 flex justify-center">
          <span
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${labelColor}`}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Benchmark Comparisons */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span aria-hidden="true">📊</span><span> How You Compare</span>
        </h3>
        <ComparisonBar
          id="global-average-bar"
          label="vs Global Average"
          pct={result.vs_global_average_pct}
          benchmark="global average"
          benchmarkKg={4000}
        />
        <ComparisonBar
          id="paris-target-bar"
          label="vs Paris 1.5°C Target"
          pct={result.vs_paris_target_pct}
          benchmark="Paris climate target"
          benchmarkKg={2000}
        />
        <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-50">
          <span>Sources: Our World in Data 2023 (global avg) · IPCC SR1.5 (Paris target)</span>
        </p>
      </div>

      {/* Category Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span aria-hidden="true">🔍</span><span> Breakdown by Category</span>
        </h3>
        <CategoryChart breakdown={result.breakdown} ranked_categories={result.ranked_categories} />
      </div>

      {/* Get Insights CTA */}
      {!insights && (
        <div className="flex justify-center">
          <button
            onClick={fetchInsights}
            disabled={isLoadingInsights}
            aria-busy={isLoadingInsights}
            aria-label={
              isLoadingInsights
                ? 'Loading your personalised reduction plan...'
                : 'Get personalised carbon reduction insights powered by Google Gemini AI'
            }
            className="
              flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600
              text-white px-8 py-4 rounded-2xl text-base font-semibold
              hover:from-emerald-700 hover:to-teal-700 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
              disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
              transition-all duration-200 shadow-lg shadow-emerald-600/25 min-w-[260px] justify-center
            "
          >
            {isLoadingInsights ? (
              <LoadingSpinner label="Generating insights..." size="sm" />
            ) : (
              <>
                <span aria-hidden="true">✨</span>
                <span>Get Personalised Insights</span>
                <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                  <span>Gemini AI</span>
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};
