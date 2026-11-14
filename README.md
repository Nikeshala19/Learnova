# Learnova — Students Productivity Tracker

A lightweight **offline React Native student productivity app** built with **Expo SDK 58**, **JavaScript/JSX**, and **SQLite**. It uses a dark navy-blue interface and has five tabs: Home, Tasks, Goals, Focus, and Progress.

## Features

- **Home:** friendly welcome, quick navigation, real pending-task and active-goal counts.
- **Tasks:** create tasks with a subject, notes, priority, and a quick due-date choice; search and filter by completion; mark tasks complete; view task details.
- **Goals:** create academic or personal goals with notes; search, filter, mark achieved, and delete.
- **Focus:** a 25-minute countdown with Start, Pause, Continue, Reset, and **Finish & save**. Actual time studied is recorded locally.
- **Progress:** task completion, achieved goals, total focus time, and the five most recent saved focus sessions. It refreshes when opened.
- **Offline data:** seeded example tasks and goals are added once and then stored in SQLite. New records survive app restarts.

## Technology

- React Native and Expo SDK 58 (Expo Go compatible)
- JavaScript and JSX (`App.jsx` and files in `src/`)
- React Navigation (five bottom tabs)
- Expo SQLite (local database `learnova.db`)
- React Native StyleSheet and Ionicons

There is **no user login, online backend, or cloud sync**.

## Getting started on Windows

1. Install Node.js and Git, and install **Expo Go** on your Android phone.
2. Open the `Learnova` folder in VS Code, not its parent folder.
3. Install dependencies:

   ```powershell
   npm ci
   ```

4. Run the Expo development server:

   ```powershell
   npx expo start -c
   ```

5. Connect your phone and PC to the same Wi-Fi. Open Expo Go and scan the QR code.
6. If your phone cannot reach Metro, try `npx expo start --tunnel` (requires internet during development).

SQLite data operations work offline. **Expo Go may still need Metro to load the development bundle**, so a standalone build is more appropriate for validating completely offline cold launches.

## What to test

1. Confirm that Home, Tasks, Goals, Focus and Progress all open.
2. Create a task due Today; complete it, then check the updated Home and Progress counts.
3. Create a goal, mark it achieved, and check Progress.
4. Run Focus for a few seconds, tap **Finish & save**, then view Focus history on Progress.
5. Close and reopen Learnova without clearing the app's storage. Check that tasks, goals, and saved focus time remain.
6. Search and filter Tasks and Goals, and check that the navy-blue interface is readable.

## Folder structure

```text
Learnova/
├── App.jsx
├── app.json
├── index.js
├── assets/
├── src/
│   ├── components/        # Reusable task and goal cards
│   ├── data/              # Original local sample data
│   ├── database/          # SQLite schema and queries
│   ├── navigation/        # Five-tab navigation
│   ├── screens/           # Home, Tasks, Goals, Focus, Progress
│   ├── theme/             # Colours
│   └── utils/             # Date and duration helpers
└── package.json
```

## Database summary

- `tasks`: title, subject, due date, priority, note, completed status.
- `goals`: title, category, note, achieved status.
- `focus_sessions`: seconds studied and creation timestamp.
- `app_meta`: one-time seed and migration flags.

Due dates are saved as local `YYYY-MM-DD` calendar dates, or `Anytime`. Quick choices are Today, Tomorrow and In 7 days. Older relative labels are converted **once on upgrade**, anchored to the installation day because the older records did not contain an absolute due date.

## GitHub workflow

Use your feature branch rather than pushing development changes directly into `main`:

```powershell
git branch --show-current
git add .
git commit -m "fix: complete focus progress and offline dates"
git push origin feat/learnova-implement
```

Once tested, open a Pull Request from `feat/learnova-implement` into `main`. Review the changes and merge it.

## Known limits

- Single-device offline app; no account or synchronization.
- Task date choices are quick presets, not a full calendar/time picker.
- Focus uses a fixed 25-minute session. To save actual time, tap Finish & save; Reset discards the unsaved session.
- Deleting the app or clearing its local storage can remove saved data.
