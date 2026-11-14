# Learnova 📚

**A simple and organized space for student productivity.**

Learnova is a mobile application designed to help students manage their daily academic tasks, set personal goals, and build productive study habits. It brings essential planning tools together in a clean, easy-to-use interface, helping students stay organized and work towards their goals one step at a time.

The application is developed with **React Native and Expo** and uses **SQLite** to store tasks and goals locally on the device.

## Features

### ✅ Task Management
- Create tasks with a title, subject, due-date label, priority level, and optional notes.
- Mark tasks as completed or pending.
- Search tasks by title, subject, or notes.
- Filter tasks by all, pending, or completed status.
- View task completion progress as a percentage.

### 🎯 Goal Management
- Add goals under **Academics**, **Skills**, or **Personal** categories.
- Include optional notes for each goal.
- Mark goals as achieved or in progress.
- Search and filter goals.
- View overall goal achievement progress.
- Delete goals that are no longer needed.

### 🏠 Home Dashboard
- Access the main sections of the application from one screen.
- Quickly navigate to Tasks, Goals, Focus, and Progress.
- Enjoy a clean, student-friendly interface with a consistent dark theme.

### 💾 Offline Data Storage
- Store tasks and goals locally using SQLite.
- Access saved tasks and goals without an internet connection.
- Start with sample tasks and goals added when the database is first initialized.

## Planned Features

The following sections are available in the app as introductory screens, with their main functionality planned for future development:

- **Focus Timer:** A 25-minute study timer with start, pause, and reset controls.
- **Progress Tracking:** A summary of completed tasks, achieved goals, and study time.

## Technology Stack

| Technology | Purpose |
| --- | --- |
| React Native | Mobile application development |
| Expo (SDK 58) | Development and application tooling |
| JavaScript and JSX | Application logic and user interface |
| React Navigation | Bottom-tab navigation |
| Expo SQLite | Local database and offline storage |
| Expo Vector Icons | Icons and visual elements |

## Getting Started

### Prerequisites

Make sure you have:

- **Node.js** and **npm** installed.
- **Expo Go** on a compatible mobile device, or an Android/iOS development environment suitable for the project's Expo SDK.
- **Git** (optional, for cloning the repository).

### Installation

**1. Clone the repository**

```bash
git clone <YOUR_REPOSITORY_URL>
cd Learnova
```

Replace `<YOUR_REPOSITORY_URL>` with the URL of your GitHub repository.

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npx expo start
```

**4. Open the application**

Follow the instructions displayed in the terminal to open the project on a compatible device or emulator. You can also scan the QR code using Expo Go when supported by the project's SDK and native dependencies.

### Available Commands

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run android` | Start Expo with the Android option |
| `npm run ios` | Start Expo with the iOS option |
| `npm run web` | Start Expo with the web option; web compatibility has not been verified |

## Project Structure

```text
Learnova/
├── assets/                     # App icons and other assets
├── src/
│   ├── components/             # Reusable interface components
│   │   ├── GoalCard.jsx
│   │   ├── IntroScreen.jsx
│   │   └── TaskCard.jsx
│   ├── data/                   # Initial sample data
│   │   ├── sampleGoals.js
│   │   └── sampleTasks.js
│   ├── database/
│   │   └── database.js          # SQLite setup and data operations
│   ├── navigation/
│   │   └── AppNavigator.jsx     # Bottom-tab navigation
│   ├── screens/
│   │   ├── DashboardScreen.jsx
│   │   ├── FocusScreen.jsx
│   │   ├── GoalsScreen.jsx
│   │   ├── ProgressScreen.jsx
│   │   └── TasksScreen.jsx
│   └── theme/
│       └── colors.js           # Shared app colors
├── App.jsx                     # Application providers and navigation
├── app.json                    # Expo application configuration
├── index.js                    # Application entry point
└── package.json                # Dependencies and scripts
```

## How the Application Works

Learnova uses a bottom navigation bar with five sections: **Home, Tasks, Goals, Focus, and Progress**.

Tasks and goals are stored in a local SQLite database named `learnova.db`. When the application starts for the first time, it creates the required database tables and inserts example records. Users can then add their own tasks and goals, update completion status, and review their progress. These changes remain saved locally on the device.

At the current stage, the Focus and Progress sections introduce functionality intended for future updates.

## Future Improvements

- Implement the 25-minute focus timer.
- Add a progress dashboard with task, goal, and study-time summaries.
- Improve the home dashboard with live information from saved records.
- Continue improving the user experience and accessibility.

## Project Status

**Under development** — task management, goal management, local SQLite storage, and bottom-tab navigation are implemented. Focus timer and progress analytics are planned.

## License

A `LICENSE` file is included in the repository. Review its terms and copyright details before publishing or reusing the project under a specific license.

---

**Learnova — Learn better. Stay organized. Grow every day.**
