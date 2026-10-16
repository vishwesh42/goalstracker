import React, { useRef } from 'react';
import { Target, Download, Upload, FileCode, Moon, Sun } from 'lucide-react';
import { GoalsDatabase } from '../types';
import { exportDatabaseJson } from '../utils/storage';

interface NavbarProps {
  database: GoalsDatabase;
  onImportJson: (data: GoalsDatabase) => void;
  onOpenJsonModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  database,
  onImportJson,
  onOpenJsonModal,
  darkMode,
  onToggleDarkMode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.goals)) {
          onImportJson(parsed);
        } else {
          alert('Invalid JSON file format. Expected a database structure with a "goals" array.');
        }
      } catch (err) {
        alert('Failed to parse JSON file. Please verify syntax.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <nav className="w-full bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">GoalFlow</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                .json Database Connected
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Frontend-only • Zero-config Vercel deployment</p>
          </div>
        </div>

        {/* Database actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors"
            title="Import database from a local .json file"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Import .json</span>
          </button>

          <button
            type="button"
            onClick={() => exportDatabaseJson(database)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors"
            title="Download goals.json database backup"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Export .json</span>
          </button>

          <button
            type="button"
            onClick={onOpenJsonModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 transition-colors"
            title="Inspect or edit raw JSON database"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span className="text-xs">Raw JSON</span>
          </button>

          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

