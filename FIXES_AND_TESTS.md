# Learnova Fixes — November 2026

This repair was made from the exact `Learnova(1).zip` upload. It intentionally keeps the original five tabs and does not introduce module workspaces, account profiles, or other features from older drafts.

## Corrected files

- `src/screens/FocusScreen.jsx` — actual 25-minute countdown; Start/Pause/Continue/Reset; Finish & save sends actual studied seconds to SQLite.
- `src/screens/ProgressScreen.jsx` — live counts for completed/pending tasks, achieved goals, focus time, and recent sessions.
- `src/screens/DashboardScreen.jsx` — real Tasks/Goals summary and accurate local-storage wording.
- `src/database/database.js` — additive `focus_sessions` table, session/statistic queries, and one-time relative-date conversion for earlier tasks.
- `src/screens/TasksScreen.jsx`, `src/components/TaskCard.jsx`, `src/utils/dates.js` — fixed due dates saved as local dates and displayed relative to the current day; TaskCard checkbox stops the parent card tap.
- `src/utils/time.js` — duration formatting.
- `app.json` — dark appearance.
- `README.md` — project description, features, installation, GitHub workflow and known limits.
- `TESTING.md` — app test checklist.

## Checks completed in this environment

- 17 `.js`/`.jsx` files parsed by TypeScript JavaScript/JSX parser: no syntax errors.
- All relative source imports resolved to files.
- Date/duration helper checks passed (12 cases).
- The `CREATE TABLE` statements and progress aggregate query executed in SQLite with sample existing task/goal records; original values remained intact.

## Not verified here

The complete app has **not** been loaded on an Android phone using Expo Go in this environment, so visual layout and native runtime behavior must still be checked manually. Do not claim physical device testing until completing the checklist in `TESTING.md`.

## Upgrade caution

Older records stored `Today`, `Tomorrow`, or `This week` as text. Their original actual calendar dates cannot be reconstructed. The upgrade converts those records **once**, relative to the upgrade day, and keeps all titles, notes and statuses. New tasks use absolute calendar dates so they won't keep displaying "Today" after a day passes.

## Using with an existing Git repository

Use the **fixes-only** ZIP, copy its contents onto your existing project and keep your existing `.git` folder. Don't unzip another `.git` over your working repository. Check that you're on your feature branch before committing; merge to `main` through a Pull Request after device testing.
