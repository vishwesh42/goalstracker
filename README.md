# 🎯 GoalFlow — Motivational Goal Tracker (Frontend-Only)

> A modern, responsive, frontend-only goal tracker powered by a **portable `.json` database** and an **always-visible motivational heading**. Built with React 18, Vite, TypeScript, and Tailwind CSS.

---

## ✨ Features

- 🌟 **Always-Visible Top Motivational Heading**:
  - Sticky at the top of the screen so your core focus or daily mantra is never lost as you scroll.
  - One-click editable with live save or instant shuffle from curated inspirational presets.
- 🎯 **Full Goal Management**:
  - Add new goals with title, category (*Career, Health, Personal, Finance, Productivity, Learning, Other*), priority (*High, Medium, Low*), target deadline, and optional notes.
  - Mark goals as completed or active with a single click.
  - **Confetti celebrations 🎉** when completing a goal!
  - Edit or delete goals anytime.
- 📊 **Progress & Insights**:
  - Dynamic progress bar showing your completion percentage.
  - Quick filter cards for *Total*, *In Progress*, and *Completed*.
  - Category filter pills and live search bar.
- 💾 **`.json` Database Engine**:
  - Initial seed data loaded from `public/goals.json`.
  - Automatically syncs all changes to browser `localStorage` so data persists across refreshes.
  - **One-click Export**: Download your updated `goals.json` anytime as a backup or portable file.
  - **One-click Import**: Upload any `.json` file to restore or load external goal datasets.
  - **Live Raw JSON Editor**: View and modify your JSON database directly within the app.
- 🌙 **Dark & Light Mode**:
  - Built-in theme switcher saved to preferences.
- ⚡ **Zero-Backend Architecture**:
  - No server, database, or API keys required.
  - 100% free hosting forever on Vercel, Netlify, or GitHub Pages.

---

## 🚀 How to Deploy for Free on Vercel

### Option 1: Via GitHub (Recommended - Automatic Continuous Deployment)

1. **Initialize Git & push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit of GoalFlow"
   git branch -M main
   # Create a repository on github.com, then run:
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com) and log in (free account).
   - Click **"Add New Project"** -> **"Import Git Repository"**.
   - Select your goals repository.
   - Framework preset: Vercel will automatically detect **Vite**.
   - Click **"Deploy"**.
   - In ~20 seconds, your site is live with a free `https://your-project.vercel.app` domain and free SSL!

---

### Option 2: Via Vercel CLI (Deploy in 60 seconds from terminal)

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Run inside the project directory:
   ```bash
   vercel
   ```
   - Follow the simple CLI prompts (press Enter for defaults).
   - Done! Your app is live.

---

## 💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start local dev server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. Build production bundle:
   ```bash
   npm run build
   ```

---

## 🗄️ JSON Database Structure

Your goals and motivational heading are stored with the following clean schema in `public/goals.json`:

```json
{
  "version": 1,
  "updatedAt": "2026-10-16T01:40:00.000Z",
  "motivationalHeading": "Every small step today builds the extraordinary tomorrow. Stay relentless.",
  "motivationalAuthor": "Daily Focus",
  "goals": [
    {
      "id": "goal-1",
      "title": "Deploy Goal Tracker frontend to Vercel for free",
      "category": "Career",
      "priority": "high",
      "completed": false,
      "createdAt": "2026-10-16T01:00:00.000Z",
      "completedAt": null,
      "targetDate": "Today",
      "notes": "Follow Vercel's zero-config deployment"
    }
  ]
}
```

---

## 📄 License
MIT — Free to use, customize, and deploy.

