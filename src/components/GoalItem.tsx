import React, { useState } from 'react';
import { Check, Trash2, Edit2, Calendar, FileText } from 'lucide-react';
import { Goal } from '../types';

interface GoalItemProps {
  goal: Goal;
  onToggleComplete: (id: string) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateGoal: (id: string, updates: Partial<Goal>) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Career: { bg: 'bg-indigo-50 dark:bg-indigo-950/60', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
  Health: { bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  Personal: { bg: 'bg-sky-50 dark:bg-sky-950/60', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800' },
  Finance: { bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  Productivity: { bg: 'bg-purple-50 dark:bg-purple-950/60', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  Learning: { bg: 'bg-teal-50 dark:bg-teal-950/60', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800' },
  Other: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' },
};

const PRIORITY_BADGES = {
  high: { label: 'High', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900' },
  medium: { label: 'Medium', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900' },
  low: { label: 'Low', color: 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
};

export const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  onToggleComplete,
  onDeleteGoal,
  onUpdateGoal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(goal.title);
  const [editedNotes, setEditedNotes] = useState(goal.notes || '');

  const catStyle = CATEGORY_COLORS[goal.category] || CATEGORY_COLORS.Other;
  const priorityStyle = PRIORITY_BADGES[goal.priority] || PRIORITY_BADGES.medium;

  const handleSave = () => {
    if (!editedTitle.trim()) return;
    onUpdateGoal(goal.id, {
      title: editedTitle.trim(),
      notes: editedNotes.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(goal.title);
    setEditedNotes(goal.notes || '');
    setIsEditing(false);
  };

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 p-3.5 sm:p-4 ${
        goal.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkbox */}
        <button
          type="button"
          onClick={() => onToggleComplete(goal.id)}
          aria-label={goal.completed ? "Mark goal as incomplete" : "Mark goal as complete"}
          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 ${
            goal.completed
              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
              : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-slate-800'
          }`}
        >
          {goal.completed && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Goal Body */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                autoFocus
                className="w-full text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                rows={2}
                placeholder="Optional notes..."
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-2.5 py-1 rounded text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-2.5 py-1 rounded text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3
                  onClick={() => onToggleComplete(goal.id)}
                  className={`text-sm sm:text-base font-semibold cursor-pointer select-none transition-colors ${
                    goal.completed
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  {goal.title}
                </h3>

                {/* Action buttons */}
                <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit goal"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {goal.notes && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-start gap-1 font-normal">
                  <FileText className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                  <span>{goal.notes}</span>
                </p>
              )}

              {/* Tags & Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                {/* Category tag */}
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                >
                  {goal.category}
                </span>

                {/* Priority badge */}
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${priorityStyle.color}`}
                >
                  {priorityStyle.label}
                </span>

                {/* Target Date */}
                {goal.targetDate && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    <Calendar className="w-2.5 h-2.5 text-slate-400" />
                    {goal.targetDate}
                  </span>
                )}

                {/* Completed timestamp */}
                {goal.completed && goal.completedAt && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Completed {new Date(goal.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
