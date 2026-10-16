import { useState, useEffect, useCallback } from 'react';
import { GoalsDatabase, Goal, FilterStatus, GistSyncConfig, SyncState } from './types';
import { INITIAL_DATABASE } from './data/initialData';
import { loadDatabase, saveDatabase, triggerCelebration } from './utils/storage';
import { loadGistConfig, fetchGistDatabase, saveGistDatabase } from './utils/gist';
import { Navbar } from './components/Navbar';
import { MotivationalHeader } from './components/MotivationalHeader';
import { GoalStats } from './components/GoalStats';
import { GoalForm } from './components/GoalForm';
import { GoalList } from './components/GoalList';
import { JsonDatabaseModal } from './components/JsonDatabaseModal';
import { GistSyncModal } from './components/GistSyncModal';
import { Rocket, ExternalLink, ShieldCheck, Heart, Cloud, Sparkles } from 'lucide-react';

export default function App() {
  const [database, setDatabase] = useState<GoalsDatabase>(INITIAL_DATABASE);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isGistModalOpen, setIsGistModalOpen] = useState(false);
  const [gistConfig, setGistConfig] = useState<GistSyncConfig>(loadGistConfig);
  const [syncState, setSyncState] = useState<SyncState>('local');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('goalflow_theme');
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    return true; // Default to dark mode
  });

  // Sync to Gist helper
  const syncToGist = useCallback(async (data: GoalsDatabase, config: GistSyncConfig) => {
    if (!config.enabled || !config.token || !config.gistId) {
      setSyncState('local');
      return;
    }

    try {
      setSyncState('syncing');
      await saveGistDatabase(config.token, config.gistId, data);
      setSyncState('synced');
    } catch (err) {
      console.error('Failed to sync changes to GitHub Gist:', err);
      setSyncState('error');
    }
  }, []);

  // Initial load: prefer GitHub Gist if configured, fallback to local storage
  useEffect(() => {
    async function initData() {
      if (gistConfig.enabled && gistConfig.token && gistConfig.gistId) {
        setSyncState('syncing');
        try {
          const res = await fetchGistDatabase(gistConfig.token, gistConfig.gistId);
          setDatabase(res.database);
          saveDatabase(res.database); // Cache locally
          setSyncState('synced');
          return;
        } catch (err) {
          console.warn('Could not load from Gist, falling back to local database:', err);
          setSyncState('error');
        }
      }

      // Fallback
      const local = await loadDatabase();
      setDatabase(local);
      setSyncState('local');
    }

    initData();
  }, [gistConfig.enabled, gistConfig.token, gistConfig.gistId]);

  // Update dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('goalflow_theme', 'dark');
      localStorage.setItem('goalflow_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('goalflow_theme', 'light');
      localStorage.setItem('goalflow_dark_mode', 'false');
    }
  }, [darkMode]);

  // Main state updater: updates React state, saves locally, and syncs to Gist
  const updateDatabaseState = (newData: GoalsDatabase) => {
    setDatabase(newData);
    saveDatabase(newData);
    if (gistConfig.enabled) {
      syncToGist(newData, gistConfig);
    }
  };

  // Add goal
  const handleAddGoal = (newGoalData: Omit<Goal, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => {
    const newGoal: Goal = {
      ...newGoalData,
      id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    const updatedGoals = [newGoal, ...database.goals];
    updateDatabaseState({
      ...database,
      goals: updatedGoals,
    });
  };

  // Toggle complete
  const handleToggleComplete = (id: string) => {
    let nowCompleted = false;
    const updatedGoals = database.goals.map((g) => {
      if (g.id === id) {
        const nextState = !g.completed;
        if (nextState) nowCompleted = true;
        return {
          ...g,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : null,
        };
      }
      return g;
    });

    if (nowCompleted) {
      triggerCelebration();
    }

    updateDatabaseState({
      ...database,
      goals: updatedGoals,
    });
  };

  // Delete goal
  const handleDeleteGoal = (id: string) => {
    const updatedGoals = database.goals.filter((g) => g.id !== id);
    updateDatabaseState({
      ...database,
      goals: updatedGoals,
    });
  };

  // Update goal
  const handleUpdateGoal = (id: string, updates: Partial<Goal>) => {
    const updatedGoals = database.goals.map((g) => {
      if (g.id === id) {
        return { ...g, ...updates };
      }
      return g;
    });

    updateDatabaseState({
      ...database,
      goals: updatedGoals,
    });
  };

  // Clear completed goals
  const handleClearCompleted = () => {
    if (window.confirm('Are you sure you want to delete all completed goals?')) {
      const updatedGoals = database.goals.filter((g) => !g.completed);
      updateDatabaseState({
        ...database,
        goals: updatedGoals,
      });
    }
  };

  // Update motivational heading
  const handleUpdateHeading = (newHeading: string, newAuthor?: string) => {
    updateDatabaseState({
      ...database,
      motivationalHeading: newHeading,
      motivationalAuthor: newAuthor,
    });
  };

  // Handle Gist configuration save
  const handleSaveGistConfig = (newConfig: GistSyncConfig, fetchedData?: GoalsDatabase) => {
    setGistConfig(newConfig);
    if (fetchedData) {
      setDatabase(fetchedData);
      saveDatabase(fetchedData);
      setSyncState('synced');
    } else if (newConfig.enabled) {
      setSyncState('synced');
    } else {
      setSyncState('local');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        database={database}
        onImportJson={updateDatabaseState}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onOpenGistModal={() => setIsGistModalOpen(true)}
        gistConfig={gistConfig}
        syncState={syncState}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Always Visible Motivational Header */}
      <MotivationalHeader
        heading={database.motivationalHeading}
        author={database.motivationalAuthor}
        onUpdateHeading={handleUpdateHeading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Cloud Sync Announcement banner if not connected */}
        {!gistConfig.enabled && (
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Want your goals.json in the cloud automatically?
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Connect GitHub Gist to auto-save every add/delete to your live <code className="font-mono text-indigo-600 dark:text-indigo-400">goals.json</code> file!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsGistModalOpen(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-sm"
            >
              Connect Gist (1-Click)
            </button>
          </div>
        )}

        {/* Progress & Quick Metrics */}
        <GoalStats
          goals={database.goals}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        {/* Add Goal Form */}
        <GoalForm onAddGoal={handleAddGoal} />

        {/* Goal List with Filters and Search */}
        <GoalList
          goals={database.goals}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          onToggleComplete={handleToggleComplete}
          onDeleteGoal={handleDeleteGoal}
          onUpdateGoal={handleUpdateGoal}
          onClearCompleted={handleClearCompleted}
        />

        {/* Vercel Free Deployment Guide Card */}
        <div className="mt-10 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 sm:p-6 shadow-md border border-indigo-800/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-indigo-400" />
                <h4 className="font-bold text-sm sm:text-base text-white">Deploy for Free on Vercel</h4>
              </div>
              <p className="text-xs text-indigo-200/90 leading-relaxed max-w-xl">
                This project is 100% frontend with zero backend dependencies. Push to GitHub and import into Vercel, or run <code className="text-emerald-300 font-mono">vercel</code> in your terminal. It will be live with instant HTTPS!
              </p>
            </div>
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
            >
              <span>Deploy to Vercel</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-800/80 flex flex-wrap items-center gap-4 text-[11px] text-indigo-300">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Free Tier: 100% Free Hosting
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              JSON Database: Persistent & Portable
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Cloud Gist Sync Ready
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p className="flex items-center justify-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> • Powered by Vite, React, Tailwind & JSON
        </p>
      </footer>

      {/* Raw JSON Database Modal */}
      <JsonDatabaseModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        database={database}
        onUpdateDatabase={updateDatabaseState}
      />

      {/* GitHub Gist Cloud Sync Modal */}
      <GistSyncModal
        isOpen={isGistModalOpen}
        onClose={() => setIsGistModalOpen(false)}
        config={gistConfig}
        onSaveConfig={handleSaveGistConfig}
        currentDatabase={database}
      />
    </div>
  );
}
