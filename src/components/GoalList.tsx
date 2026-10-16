import React, { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle2 } from 'lucide-react';
import { Goal, FilterStatus, Category } from '../types';
import { GoalItem } from './GoalItem';

interface GoalListProps {
  goals: Goal[];
  activeFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
  onToggleComplete: (id: string) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void;
  onClearCompleted: () => void;
}

export const GoalList: React.FC<GoalListProps> = ({
  goals,
  activeFilter,
  onSelectFilter,
  onToggleComplete,
  onDeleteGoal,
  onUpdateGoal,
  onClearCompleted,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      // Filter status
      if (activeFilter === 'active' && g.completed) return false;
      if (activeFilter === 'completed' && !g.completed) return false;

      // Filter category
      if (selectedCategory !== 'all' && g.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = g.title.toLowerCase().includes(query);
        const matchesNotes = g.notes?.toLowerCase().includes(query);
        const matchesCategory = g.category.toLowerCase().includes(query);
        return matchesTitle || matchesNotes || matchesCategory;
      }

      return true;
    });
  }, [goals, activeFilter, selectedCategory, searchQuery]);

  const completedCount = goals.filter((g) => g.completed).length;

  return (
    <div className="space-y-4">
      {/* Search and Filters toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search goals..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          {(['all', 'active', 'completed'] as FilterStatus[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onSelectFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeFilter === tab
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab === 'active' ? 'In Progress' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills & Clear Completed action */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
          {(['all', 'Career', 'Health', 'Personal', 'Finance', 'Productivity', 'Learning'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat as Category | 'all')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {completedCount > 0 && activeFilter === 'completed' && (
          <button
            type="button"
            onClick={onClearCompleted}
            className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline shrink-0"
          >
            Clear completed
          </button>
        )}
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {searchQuery
              ? 'No goals match your search'
              : activeFilter === 'completed'
              ? 'No completed goals yet'
              : activeFilter === 'active'
              ? 'All caught up! No pending goals'
              : 'No goals found'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search terms or filter settings.'
              : activeFilter === 'completed'
              ? 'Mark off your active goals to see them listed here with your achievements!'
              : 'Add your first goal using the form above to start tracking your progress.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredGoals.map((goal) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              onToggleComplete={onToggleComplete}
              onDeleteGoal={onDeleteGoal}
              onUpdateGoal={onUpdateGoal}
            />
          ))}
        </div>
      )}
    </div>
  );
};

