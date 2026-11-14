# Learnova — Students Productivity Tracker

**Plan smart. Study better. Achieve more.**

Learnova is a mobile application designed to help students organize academic responsibilities, set learning goals, stay focused while studying, and monitor their progress. Built with **React Native and Expo**, the application uses a clean **dark navy-blue interface** and stores its data **locally with SQLite**.

This project was developed as an **individual React Native academic project**. Its main focus is a straightforward, user-friendly study workflow without requiring an account, internet-based API, or cloud database.

## Project objectives

- Help students keep track of academic tasks and their due dates.
- Allow students to create and monitor personal and academic goals.
- Encourage focused study sessions using a simple countdown timer.
- Display progress calculated from actual locally saved records.
- Keep essential data accessible without an internet connection after the app is loaded.

## Main features

The application contains **five main screens**, accessible through a bottom navigation bar.

| Screen | Description |
| --- | --- |
| **Home** | Welcoming dashboard, shortcuts to the main features, and dynamic counts of pending tasks and active goals. |
| **Tasks** | Add tasks with a title, subject, priority, due-date choice, and notes; search tasks; filter by completion status; view details; and mark tasks as completed. |
| **Goals** | Create goals with a category and notes; search and filter goals; view details; mark goals as achieved; and delete goals. |
| **Focus** | Use a fixed **25-minute study timer** with Start, Pause, Continue, Reset, and **Finish & Save**. The actual time studied is saved locally when the user chooses to save a session. |
| **Progress** | View completed and pending task counts, achieved goals, task/goal completion percentages, total recorded focus time, and recent saved study sessions. |

### Task due dates

The Tasks screen offers **Today**, **Tomorrow**, **In 7 days**, and **Anytime** choices. Dates are stored as local calendar dates rather than permanent relative labels, so a task marked *Today* does not incorrectly remain *Today* on subsequent days.

### Offline data

- The app creates an original starter dataset of example tasks and goals **once** when the corresponding database records are first initialized.
- Additional tasks, goals, status changes, and saved focus sessions are stored on the device.
- The app loads these records dynamically from SQLite rather than depending on hard-coded display values.
- No public API, online authentication, or cloud database is required for its core features.

## Technologies used

| Technology | Purpose |
| --- | --- |
| **React Native** | Cross-platform mobile user interface |
| **Expo SDK 58** | Development environment and testing with Expo Go |
| **JavaScript / JSX** | Screen components and application logic |
| **React Navigation** | Bottom-tab navigation between five screens |
| **Expo SQLite** | On-device database and persistent records |
| **React Hooks** | State management and screen lifecycle handling |
| **React Native StyleSheet** | Dark-themed styling and layout |
| **Expo Vector Icons (Ionicons)** | Icons throughout the interface |
| **Git and GitHub** | Version control, branches, and Pull Requests |

The supplied project uses **React 19.3.0**, **React Native 0.88.1**, and **Expo `~58.0.23`** in `package.json`.

## Project structure

```text
Learnova/
├── App.jsx                     # App providers and navigation container
├── app.json                    # Expo application configuration
├── index.js                    # Application entry point
├── assets/                     # App icons and other image assets
├── src/
│   ├── components/             # Reusable task, goal, and intro components
│   ├── data/                   # Original task and goal starter records
│   ├── database/
│   │   └── database.js         # SQLite initialization and queries
│   ├── navigation/
│   │   └── AppNavigator.jsx    # Five bottom tabs
│   ├── screens/
│   │   ├── DashboardScreen.jsx
│   │   ├── TasksScreen.jsx
│   │   ├── GoalsScreen.jsx
│   │   ├── FocusScreen.jsx
│   │   └── ProgressScreen.jsx
│   ├── theme/                  # Shared colours
│   └── utils/                  # Date and study-duration helpers
├── package.json
├── package-lock.json
└── README.md
```

## Database design

Learnova uses a local SQLite database named **`learnova.db`**. It is initialized when the application starts through Expo's `SQLiteProvider`.

| Table | Stored information |
| --- | --- |
| `tasks` | Task ID, title, subject, due date, priority, note, completion status, creation time |
| `goals` | Goal ID, title, category, note, achieved status, creation time |
| `focus_sessions` | Session ID, actual study duration in seconds, creation time |
| `app_meta` | Flags for one-time starter data insertion and database migrations |

Database access is handled by functions in `src/database/database.js`, using parameterized queries for user-provided values. The Progress screen uses database queries to calculate its statistics from saved records.

## Installation and setup

### Requirements

- **Node.js** and **npm** installed on your computer
- **Visual Studio Code** (or another code editor)
- **Expo Go** installed on an Android device, compatible with **Expo SDK 58**
- A local copy of this repository

### 1. Get the project

Clone the repository through **GitHub Desktop** (*File → Clone repository*) or download the repository ZIP from GitHub. Open the **Learnova project folder** in VS Code.

If using the command line to clone, copy the HTTPS clone URL from your GitHub repository and run:

```bash
git clone <YOUR_REPOSITORY_HTTPS_URL>
cd Learnova
```

> If the downloaded or cloned folder has a different name, open that folder instead.

### 2. Install dependencies

In the project root (where `package.json` is located), run:

```bash
npm ci
```

### 3. Start the application

```bash
npx expo start -c
```

This starts the Expo/Metro development server and clears its cache. Scan the QR code using **Expo Go**. For normal local development, connect the phone and computer to the same Wi-Fi network.

If local network connectivity prevents the phone from reaching Metro, try:

```bash
npx expo start --tunnel
```

Tunnel mode requires internet access during development.

## How to use Learnova

1. **Home:** View your pending tasks, active goals, and shortcuts.
2. **Tasks:** Add an academic task, choose its priority and due date, then mark it complete when finished. Use the search field or status filters to find tasks.
3. **Goals:** Create a learning goal, view its information, and mark it achieved when completed.
4. **Focus:** Start the 25-minute timer, pause or continue if needed, and select **Finish & Save** to record the actual studied time. **Reset** discards the unsaved session.
5. **Progress:** Review your completion statistics and the recent focus-session history.

## Testing checklist

Before presentation or submission, verify the following in Expo Go:

- [ ] All five tabs open and navigation works.
- [ ] Initial sample tasks and goals appear.
- [ ] A task can be created, searched for, filtered, and marked complete.
- [ ] Task due-date labels update appropriately with the calendar date.
- [ ] A goal can be created, filtered, marked achieved, and deleted.
- [ ] The Focus timer starts, pauses, continues, and resets correctly.
- [ ] **Finish & Save** records the time actually studied.
- [ ] Progress statistics update after saving tasks, goals, or study sessions.
- [ ] Saved records remain after closing and reopening the app **without clearing Expo Go storage**.
- [ ] The dark theme remains readable and usable on the test device.

## GitHub development workflow

This project is maintained using GitHub Desktop and a feature-branch workflow:

1. Make code changes in VS Code while working on a development branch (for example, `feat/learnova-implement`).
2. Test the completed change in Expo Go.
3. Review the changed files under **Changes** in GitHub Desktop.
4. Create a descriptive commit for that completed development step.
5. Select **Push origin** to publish the branch.
6. Create a **Pull Request** with `main` as the base branch and the development branch as the compare branch.
7. Review and merge the Pull Request into `main`.

This workflow keeps the commit history, branch usage, and integration of updates visible for project evaluation.

## Limitations and scope

- Designed for **one user on one device**; there is no login, profile synchronization, or cloud backup.
- Core records are stored offline, but **Expo Go may require the Metro server to load the app's JavaScript bundle**. A standalone installable build would be required to verify fully offline cold-launch behavior independently of Expo Go.
- Tasks use simple due-date presets; there is no full calendar/time scheduling interface.
- The Focus timer uses a fixed 25-minute duration rather than customizable session lengths.
- Goals use **In Progress** and **Achieved** states; individual multi-step goal percentages are not implemented.
- Deleting the app or clearing its local storage may delete the SQLite data.

## Academic project information

- **Application name:** Learnova
- **Registered project title:** Students Productivity Tracker
- **Project type:** Individual React Native mobile application
- **Primary purpose:** Offline academic task, goal, and focus-session management for students

---

*Learnova — a simple space to plan, focus, and make progress.*
