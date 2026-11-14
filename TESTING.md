# Learnova verification checklist

Run the application using `npx expo start -c` and Expo Go with the correct SDK.

- [ ] Home displays a valid pending-task count and active-goal count.
- [ ] Tasks list loads the existing local dataset.
- [ ] Create a task with due Today; task details show Today.
- [ ] Restart the app on a later day: that due date no longer reads Today.
- [ ] Search Tasks, apply To do/Done filters, and complete a task.
- [ ] Add a goal, mark achieved, and delete an unwanted goal.
- [ ] Focus: Start, Pause, Continue, Reset and Finish & save work.
- [ ] After saving a focus session, Progress shows its true duration.
- [ ] Progress counts update after returning from Tasks, Goals, and Focus.
- [ ] Relaunch Expo Go with the development server still running; data remains saved.
- [ ] All five tab buttons are readable and navigable.

## Git checks

```powershell
git branch --show-current
git status
git diff --stat
git add .
git commit -m "fix: finish offline Learnova screens"
git push origin feat/learnova-implement
```

Do not commit local `.git` metadata from an extracted ZIP. Keep using the existing `.git` folder in your working project.
