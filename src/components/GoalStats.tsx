import React from 'react';
import { CheckCircle2, Clock, Flame, Trophy } from 'lucide-react';
import { Goal, FilterStatus } from '../types';

interface GoalStatsProps {
  goals: Goal[];
  activeFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
}

export const GoalStats: React.FC<GoalStatsProps> = ({
  goals,
  activeFilter,
  onSelectFilter,
}) => {
  const total = goals.length;
  const completed = goals.filter((g) => g.completed).length;
  const active = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  let message = "Set your goals and let's get to work!";
  if (total > 0) {
    if (percentage === 100) message = "🎉 Outstanding! All goals achieved! Take a bow.";
    else if (percentage >= 75) message = "🔥 Almost at the finish line! Keep the momentum!";
    else if (percentage >= 50) message = "⚡ Halfway there! Great discipline!";
    else if (percentage > 0) message = "🚀 First steps taken! Consistency compounds.";
    else message = "Ready to conquer your day? Start with your first task!";
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Progress header & bar */}
      <div>
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
          <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            Overall Goal Progress
          </span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm sm:text-base">
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
          {message}
        </p>
      </div>

      {/* Metric Cards / Filter Toggles */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
        <button
          type="button"
          onClick={() => onSelectFilter('all')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeFilter === 'all'
              ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/20'
              : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total</span>
            <Flame className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{total}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectFilter('active')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeFilter === 'active'
              ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 ring-2 ring-amber-500/20'
              : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">In Progress</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{active}</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectFilter('completed')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeFilter === 'completed'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20'
              : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{completed}</span>
        </button>
      </div>
    </div>
  );
};

