/**
 * InsightCard — Single carbon reduction action card.
 *
 * Accessibility features:
 *   - <article> with descriptive aria-label
 *   - Priority badge is visually prominent and screen-reader legible
 *   - Category icon decorative (aria-hidden)
 */

import type { InsightItem } from '../../types';
import { formatKg, getCategoryIcon, formatCategory } from '../../utils/formatters';

interface InsightCardProps {
  insight: InsightItem;
  index: number;
}

const priorityGradients = [
  'from-emerald-600 to-teal-500 shadow-emerald-500/20',
  'from-teal-500 to-cyan-500 shadow-teal-500/20',
  'from-sky-500 to-blue-500 shadow-sky-500/20',
];

export const InsightCard = ({ insight, index }: InsightCardProps) => {
  const icon = getCategoryIcon(insight.category);
  const categoryLabel = formatCategory(insight.category);
  const saving = formatKg(insight.estimated_saving_kg);
  const badgeGradient = priorityGradients[index] ?? priorityGradients[2];

  return (
    <article
      aria-label={`Insight ${index + 1}: ${categoryLabel} — ${insight.action}`}
      className="
        bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6
        hover:shadow-lg hover:border-emerald-250/30 hover:-translate-y-0.5 transition-all duration-300
        animate-fade-in relative overflow-hidden group
      "
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-400 opacity-80" />
      <div className="flex items-start gap-4">
        {/* Priority Badge */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <span
            className={`
              bg-gradient-to-br ${badgeGradient} text-white text-xs font-extrabold
              w-8 h-8 rounded-full flex items-center justify-center
              shadow-md
            `}
            aria-label={`Priority ${insight.priority}`}
          >
            {insight.priority}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Category header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl filter drop-shadow-sm" aria-hidden="true">
              {icon}
            </span>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              {categoryLabel}
            </span>
          </div>

          {/* Action text */}
          <p className="text-sm font-medium text-slate-700 leading-relaxed mb-4">{insight.action}</p>

          {/* Metrics row */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Saving */}
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100/50 text-emerald-800 rounded-xl px-3 py-1.5">
              <span aria-hidden="true">💚</span>
              <span className="text-xs font-bold"><span>Save ~{saving} CO₂e/year</span></span>
            </div>

            {/* Timeframe */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-650 rounded-xl px-3 py-1.5">
              <span aria-hidden="true">⏱</span>
              <span className="text-xs font-semibold"><span>{insight.timeframe}</span></span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
