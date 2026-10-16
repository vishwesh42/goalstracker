import { GoalsDatabase } from '../types';

export const INITIAL_DATABASE: GoalsDatabase = {
  version: 1,
  updatedAt: new Date().toISOString(),
  motivationalHeading: "Every small step today builds the extraordinary tomorrow. Stay relentless.",
  motivationalAuthor: "Daily Focus",
  goals: [
    {
      id: "goal-1",
      title: "Deploy Goal Tracker frontend to Vercel for free",
      category: "Career",
      priority: "high",
      completed: false,
      createdAt: new Date().toISOString(),
      targetDate: "Today",
      notes: "Follow Vercel's zero-config deployment using GitHub or Vercel CLI."
    },
    {
      id: "goal-2",
      title: "Complete 45 minutes of deep focus without distractions",
      category: "Productivity",
      priority: "high",
      completed: false,
      createdAt: new Date().toISOString(),
      targetDate: "Today",
      notes: "Phone on silent, close unrelated browser tabs."
    },
    {
      id: "goal-3",
      title: "Drink 2.5 Liters of water & stay hydrated",
      category: "Health",
      priority: "medium",
      completed: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: new Date().toISOString(),
      notes: "Keep water bottle at the desk."
    },
    {
      id: "goal-4",
      title: "Review daily wins and plan top 3 priorities for tomorrow",
      category: "Personal",
      priority: "low",
      completed: false,
      createdAt: new Date().toISOString(),
      notes: "Spend 5 minutes reflecting at end of day."
    }
  ]
};

