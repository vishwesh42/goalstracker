import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, AlertCircle, RefreshCw, Save } from 'lucide-react';
import { GoalsDatabase } from '../types';
import { exportDatabaseJson, validateDatabaseJson } from '../utils/storage';
import { INITIAL_DATABASE } from '../data/initialData';

interface JsonDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  database: GoalsDatabase;
  onUpdateDatabase: (newData: GoalsDatabase) => void;
}

export const JsonDatabaseModal: React.FC<JsonDatabaseModalProps> = ({
  isOpen,
  onClose,
  database,
  onUpdateDatabase,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setJsonText(JSON.stringify(database, null, 2));
      setError(null);
      setIsSaved(false);
    }
  }, [isOpen, database]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyChanges = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!validateDatabaseJson(parsed)) {
        setError('Invalid database structure. The JSON must contain a "goals" array.');
        return;
      }
      onUpdateDatabase(parsed);
      setError(null);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON syntax';
      setError(msg);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all goals to the default sample dataset?')) {
      onUpdateDatabase(INITIAL_DATABASE);
      setJsonText(JSON.stringify(INITIAL_DATABASE, null, 2));
      setError(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              JSON Database Engine
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info banner */}
        <div className="px-5 py-2.5 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900 text-xs text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
          <span>
            This frontend project uses <code>.json</code> as its portable database. All modifications auto-sync to local storage!
          </span>
        </div>

        {/* Error message */}
        {error && (
          <div className="px-5 py-2 bg-rose-50 dark:bg-rose-950/60 border-b border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Content / Editor */}
        <div className="flex-1 p-4 overflow-y-auto">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            Database Content (Live editable JSON):
          </label>
          <textarea
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setError(null);
            }}
            rows={14}
            className="w-full font-mono text-xs p-3 bg-slate-950 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            spellCheck={false}
          />
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>

            <button
              type="button"
              onClick={() => exportDatabaseJson(database)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              <span>Download File</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline"
              title="Reset to default sample dataset"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplyChanges}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved!' : 'Apply JSON Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

