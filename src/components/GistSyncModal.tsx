import React, { useState } from 'react';
import { X, Cloud, Key, ExternalLink, Check, AlertCircle, Loader2, Sparkles, Unlink } from 'lucide-react';
import { GistSyncConfig, GoalsDatabase } from '../types';
import { createGistDatabase, fetchGistDatabase, saveGistConfig, clearGistConfig } from '../utils/gist';

interface GistSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GistSyncConfig;
  onSaveConfig: (newConfig: GistSyncConfig, fetchedData?: GoalsDatabase) => void;
  currentDatabase: GoalsDatabase;
}

export const GistSyncModal: React.FC<GistSyncModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  currentDatabase,
}) => {
  const [token, setToken] = useState(config.token || '');
  const [gistId, setGistId] = useState(config.gistId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Extract ID if user pastes full Gist URL like https://gist.github.com/user/123abc456
  const extractGistId = (input: string) => {
    const trimmed = input.trim();
    if (trimmed.includes('gist.github.com')) {
      const parts = trimmed.split('/');
      return parts[parts.length - 1];
    }
    return trimmed;
  };

  const handleAutoCreate = async () => {
    if (!token.trim()) {
      setError('Please paste your GitHub Personal Access Token first.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const result = await createGistDatabase(token.trim(), currentDatabase);
      const newConfig: GistSyncConfig = {
        enabled: true,
        token: token.trim(),
        gistId: result.gistId,
        gistUrl: result.gistUrl,
        lastSyncedAt: new Date().toISOString(),
      };
      saveGistConfig(newConfig);
      onSaveConfig(newConfig);
      setGistId(result.gistId);
      setSuccessMsg(`Successfully created secret Gist! Your goals.json is now live in the cloud.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create Gist';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectExisting = async () => {
    const cleanId = extractGistId(gistId);
    if (!token.trim()) {
      setError('Please provide your GitHub Personal Access Token.');
      return;
    }
    if (!cleanId) {
      setError('Please enter your Gist ID or Gist URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const result = await fetchGistDatabase(token.trim(), cleanId);
      const newConfig: GistSyncConfig = {
        enabled: true,
        token: token.trim(),
        gistId: cleanId,
        gistUrl: result.gistUrl,
        lastSyncedAt: new Date().toISOString(),
      };
      saveGistConfig(newConfig);
      onSaveConfig(newConfig, result.database);
      setSuccessMsg(`Connected successfully! Loaded ${result.database.goals.length} goals from Gist.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Disconnect from GitHub Gist? Your app will switch back to local browser storage.')) {
      clearGistConfig();
      onSaveConfig({ enabled: false, token: '', gistId: '' });
      setToken('');
      setGistId('');
      setSuccessMsg('Disconnected. Now using local browser storage.');
      setError(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                GitHub Gist Cloud Database
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Option A: 100% frontend sync to a live <code className="font-mono text-indigo-500">goals.json</code>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Callout if connected */}
        {config.enabled && config.gistId && (
          <div className="px-5 py-3 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Connected to Gist <strong>#{config.gistId.slice(0, 8)}...</strong>
              </span>
            </div>
            {config.gistUrl && (
              <a
                href={config.gistUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Error or Success notification */}
        {error && (
          <div className="px-5 py-2.5 bg-rose-50 dark:bg-rose-950/50 border-b border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-950/50 border-b border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Step 1: Token */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-500" />
                Step 1: GitHub Personal Access Token
              </label>
              <a
                href="https://github.com/settings/tokens/new?scopes=gist&description=GoalFlow%20JSON%20Database"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Generate Token (1-click)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full text-xs font-mono p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Only requires the <strong className="text-slate-700 dark:text-slate-300">`gist`</strong> scope. Saved only in your browser's private local storage.
            </p>
          </div>

          {/* Action Choice */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Step 2: Choose Setup Mode
            </label>

            {/* Quick Option 1: Auto create */}
            <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Recommended: Automatic Gist Creation
                </span>
              </div>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                Click below to instantly create a new secret Gist on your GitHub containing your current goals.
              </p>
              <button
                type="button"
                disabled={loading || !token.trim()}
                onClick={handleAutoCreate}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Auto-Create Gist & Connect</span>
              </button>
            </div>

            {/* Quick Option 2: Connect existing */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Or Connect Existing Gist ID:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={gistId}
                  onChange={(e) => setGistId(e.target.value)}
                  placeholder="e.g. 8a3f... or full Gist URL"
                  className="flex-1 text-xs font-mono p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  disabled={loading || !token.trim() || !gistId.trim()}
                  onClick={handleConnectExisting}
                  className="py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 transition-colors shrink-0"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          {config.enabled ? (
            <button
              type="button"
              onClick={handleDisconnect}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>Disconnect Gist</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-400">Currently in Local Mode</span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

