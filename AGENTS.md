# Learnova project conventions

- This project is a small React Native / Expo SDK 58 application written in JavaScript and JSX.
- The app deliberately uses **React Navigation bottom tabs** in `src/navigation/AppNavigator.jsx`; do not convert it to Expo Router as part of a bug fix.
- The five tabs are Home, Tasks, Goals, Focus and Progress.
- Keep the dark navy theme from `src/theme/colors.js` and the existing simple interface.
- Local persistence is handled by Expo SQLite in `src/database/database.js`; preserve existing records during schema changes.
- Run and test the app in Expo Go before committing, and push changes to a feature branch to open a Pull Request into main.
