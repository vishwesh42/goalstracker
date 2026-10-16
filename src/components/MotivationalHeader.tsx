import React, { useState } from 'react';
import { Sparkles, Edit3, Check, X, Quote, Shuffle } from 'lucide-react';

interface MotivationalHeaderProps {
  heading: string;
  author?: string;
  onUpdateHeading: (newHeading: string, newAuthor?: string) => void;
}

const INSPIRATIONAL_PRESETS = [
  "Every small step today builds the extraordinary tomorrow. Stay relentless.",
  "Discipline will take you places where motivation cannot.",
  "You don't have to be extreme, just consistent.",
  "Focus on progress, not perfection.",
  "Win the morning, win the day.",
  "The secret of getting ahead is getting started.",
  "Small daily improvements over time lead to stunning results."
];

export const MotivationalHeader: React.FC<MotivationalHeaderProps> = ({
  heading,
  author,
  onUpdateHeading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(heading);
  const [authorText, setAuthorText] = useState(author || '');

  const handleStartEdit = () => {
    setText(heading);
    setAuthorText(author || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (text.trim()) {
      onUpdateHeading(text.trim(), authorText.trim() || undefined);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setText(heading);
    setAuthorText(author || '');
    setIsEditing(false);
  };

  const handleRandomize = () => {
    const remaining = INSPIRATIONAL_PRESETS.filter(p => p !== text);
    const random = remaining[Math.floor(Math.random() * remaining.length)];
    setText(random);
    onUpdateHeading(random, "Inspiration");
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-indigo-100 dark:border-indigo-950/60 shadow-sm transition-all duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5">
        {isEditing ? (
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-3 animate-slide-down">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Customize Always-Visible Motivational Heading
              </span>
              <button
                type="button"
                onClick={handleRandomize}
                className="text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors"
                title="Get random inspirational quote"
              >
                <Shuffle className="w-3 h-3" />
                Randomize
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              autoFocus
              placeholder="Enter your motivational mantra or focus goal..."
              className="w-full text-base sm:text-lg font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
              <input
                type="text"
                value={authorText}
                onChange={(e) => setAuthorText(e.target.value)}
                placeholder="Optional tag / author (e.g. Daily Focus, James Clear)"
                className="w-full sm:w-72 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Heading
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 group">
            <div className="flex items-start sm:items-center gap-3 overflow-hidden">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm shrink-0">
                <Quote className="w-4 h-4 fill-white/20" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
                    Daily Motivation
                  </span>
                  {author && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      — {author}
                    </span>
                  )}
                </div>
                <h1 
                  onClick={handleStartEdit}
                  className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2 sm:line-clamp-1"
                  title="Click to edit motivational heading"
                >
                  &ldquo;{heading}&rdquo;
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleRandomize}
                className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                title="Shuffle motivation quote"
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleStartEdit}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 transition-all"
                title="Edit motivational heading"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit Heading</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

