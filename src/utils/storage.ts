import { GoalsDatabase } from '../types';
import { INITIAL_DATABASE } from '../data/initialData';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'goalflow_database_v1';

export async function loadDatabase(): Promise<GoalsDatabase> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.goals)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse goals from localStorage:', err);
  }

  // Attempt to load from public/goals.json
  try {
    const res = await fetch('/goals.json');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.goals)) {
        saveDatabase(data);
        return data;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch /goals.json:', err);
  }

  // Fallback to embedded initial data
  saveDatabase(INITIAL_DATABASE);
  return INITIAL_DATABASE;
}

export function saveDatabase(data: GoalsDatabase): void {
  try {
    const updated = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated, null, 2));
  } catch (err) {
    console.error('Failed to save goals to localStorage:', err);
  }
}

export function exportDatabaseJson(data: GoalsDatabase): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `goals-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function validateDatabaseJson(data: unknown): data is GoalsDatabase {
  if (!data || typeof data !== 'object') return false;
  const d = data as Partial<GoalsDatabase>;
  if (!Array.isArray(d.goals)) return false;
  return true;
}

export function triggerCelebration(): void {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6']
    });
  } catch (e) {
    // Canvas confetti might not be available in non-browser context
  }
}

