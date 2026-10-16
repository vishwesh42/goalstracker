import React, { useState } from 'react';
import { Plus, Tag, Flag, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Category, Priority, Goal } from '../types';

interface GoalFormProps {
  onAddGoal: (newGoal: Omit<Goal, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => void;
}

const CATEGORIES: Category[] = [
  'Career',
  'Health',
  'Personal',
  'Finance',
  'Productivity',
  'Learning',
  'Other'
];

export const GoalForm: React.FC<GoalFormProps> = ({ onAddGoal }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Career');
  const [priority, setPriority] = useState<Priority>('medium');
  const [targetDate, setTargetDate] = useState('Today');
  const [notes, setNotes] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddGoal({
      title: title.trim(),
      category,
      priority,
      targetDate: targetDate.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setNotes('');
    setShowDetails(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3"
    >
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What goal do you want to accomplish?"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm sm:text-base transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={!title.trim()}
          className="px-5 py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Toggle options button */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            <Tag className="w-3 h-3 text-indigo-500" />
            {category}
          </span>
          <span className="inline-flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md capitalize">
            <Flag className={`w-3 h-3 ${
              priority === 'high' ? 'text-rose-500' : priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
            }`} />
            {priority} Priority
          </span>
          {targetDate && (
            <span className="hidden sm:inline-flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              <Calendar className="w-3 h-3 text-emerald-500" />
              {targetDate}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          {showDetails ? (
            <>
              <span>Less options</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>More options</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Expandable detailed options */}
      {showDetails && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
          {/* Category Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          {/* Target Timeline */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Target Deadline
            </label>
            <input
              type="text"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              placeholder="e.g. Today, Tomorrow, Dec 31"
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Notes */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Additional Notes or Action Steps (optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add key notes, links, or habits to track..."
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}
    </form>
  );
};

