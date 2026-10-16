import { useState, useEffect } from 'react';
import { GoalsDatabase, Goal, FilterStatus } from './types';
import { INITIAL_DATABASE } from './data/initialData';
import { loadDatabase, saveDatabase, triggerCelebration } from './utils/storage';
import { Navbar } from './components/Navbar';
import { MotivationalHeader } from './components/MotivationalHeader';
import { GoalStats } from './components/GoalStats';
import { GoalForm } from './components/GoalForm';
import { GoalList } from './components/GoalList';
import { JsonDatabaseModal } from './components/JsonDatabaseModal';
import { Rocket, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [database, setDatabase] = useState<GoalsDatabase>(INITIAL_DATABASE);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('goalflow_dark_mode') === 'true';
  });

  // Load database on mount
  useEffect(() => {
    loadDatabase().then((data) => {
      setDatabase(data);
    });
  }, []);

  // Update dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('goalflow_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('goalflow_dark_mode', 'false');
    }
  }, [darkMode]);

  // Sync database updates
  const updateDatabaseState = (newData: GoalsDatabase) => {
    setDatabase(newData);
    saveDatabase(newData);
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        database={database}
        onImportJson={updateDatabaseState}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
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
              Automatic PWA / Mobile Friendly
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
    </div>
  );
}

