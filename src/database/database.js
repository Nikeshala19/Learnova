// Local SQLite storage shared by Learnova's Tasks and Goals features.
// This file extends the Phase 4 database. Existing tasks are preserved.
import { sampleTasks } from '../data/sampleTasks';
import { sampleGoals } from '../data/sampleGoals';
import { dateFromChoice } from '../utils/dates';

export async function initializeDatabase(db) {
  // Use execAsync only for fixed SQL; user-provided values use runAsync parameters.
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      due TEXT NOT NULL,
      priority TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      completed INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      achieved INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS focus_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
      created_at INTEGER NOT NULL
    );
  `);

  // Convert old relative labels once. The original date of those labels was not
  // stored, so we anchor them to the day this upgrade is first installed.
  const dateMigration = await db.getFirstAsync(
    'SELECT value FROM app_meta WHERE key = ?', 'task_date_migration_v1'
  );
  if (!dateMigration) {
    await db.withTransactionAsync(async () => {
      for (const label of ['Today', 'Tomorrow', 'This week']) {
        await db.runAsync(
          'UPDATE tasks SET due = ? WHERE due = ?', dateFromChoice(label), label
        );
      }
      await db.runAsync(
        'INSERT INTO app_meta (key, value) VALUES (?, ?)', 'task_date_migration_v1', 'yes'
      );
    });
  }

  // Independent seed flags are important for users upgrading from Phase 4.
  // The existing tasks_seeded flag must not prevent the new goals from appearing.
  const tasksSeeded = await db.getFirstAsync(
    'SELECT value FROM app_meta WHERE key = ?', 'tasks_seeded'
  );
  if (!tasksSeeded) {
    await db.withTransactionAsync(async () => {
      const now = Date.now();
      for (const [index, task] of sampleTasks.entries()) {
        await db.runAsync(
          `INSERT OR IGNORE INTO tasks
            (id, title, subject, due, priority, note, completed, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          task.id, task.title, task.subject, dateFromChoice(task.due), task.priority,
          task.note, task.completed ? 1 : 0, now - index * 1000
        );
      }
      await db.runAsync(
        'INSERT INTO app_meta (key, value) VALUES (?, ?)', 'tasks_seeded', 'yes'
      );
    });
  }

  const goalsSeeded = await db.getFirstAsync(
    'SELECT value FROM app_meta WHERE key = ?', 'goals_seeded'
  );
  if (!goalsSeeded) {
    await db.withTransactionAsync(async () => {
      const now = Date.now();
      for (const [index, goal] of sampleGoals.entries()) {
        await db.runAsync(
          `INSERT OR IGNORE INTO goals
            (id, title, category, note, achieved, created_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
          goal.id, goal.title, goal.category, goal.note,
          goal.achieved ? 1 : 0, now - index * 1000
        );
      }
      await db.runAsync(
        'INSERT INTO app_meta (key, value) VALUES (?, ?)', 'goals_seeded', 'yes'
      );
    });
  }
}

// ----------------- Tasks (unchanged from Phase 4) -----------------
export async function getTasks(db) {
  const rows = await db.getAllAsync(
    `SELECT id, title, subject, due, priority, note, completed
     FROM tasks ORDER BY created_at DESC, id DESC`
  );
  return rows.map((row) => ({ ...row, completed: row.completed === 1 }));
}

export async function insertTask(db, task) {
  await db.runAsync(
    `INSERT INTO tasks
      (id, title, subject, due, priority, note, completed, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    task.id, task.title, task.subject, task.due, task.priority,
    task.note, task.completed ? 1 : 0, Date.now()
  );
}

export async function updateTaskCompletion(db, id, completed) {
  await db.runAsync(
    'UPDATE tasks SET completed = ? WHERE id = ?', completed ? 1 : 0, id
  );
}

// ----------------- Goals (new in Phase 5) -----------------
export async function getGoals(db) {
  const rows = await db.getAllAsync(
    `SELECT id, title, category, note, achieved
     FROM goals ORDER BY created_at DESC, id DESC`
  );
  return rows.map((row) => ({ ...row, achieved: row.achieved === 1 }));
}

export async function insertGoal(db, goal) {
  await db.runAsync(
    `INSERT INTO goals (id, title, category, note, achieved, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    goal.id, goal.title, goal.category, goal.note,
    goal.achieved ? 1 : 0, Date.now()
  );
}

export async function updateGoalStatus(db, id, achieved) {
  await db.runAsync(
    'UPDATE goals SET achieved = ? WHERE id = ?', achieved ? 1 : 0, id
  );
}

export async function deleteGoal(db, id) {
  await db.runAsync('DELETE FROM goals WHERE id = ?', id);
}

// ----------------- Focus & Progress -----------------
export async function addFocusSession(db, seconds) {
  if (!Number.isInteger(seconds) || seconds <= 0 || seconds > 25 * 60) {
    throw new Error('Invalid study session duration');
  }
  await db.runAsync(
    'INSERT INTO focus_sessions (id, duration_seconds, created_at) VALUES (?, ?, ?)',
    `focus-${Date.now()}-${Math.floor(Math.random() * 1000000)}`, seconds, Date.now()
  );
}

export async function getProgressStats(db) {
  const row = await db.getFirstAsync(`
    SELECT
      (SELECT COUNT(*) FROM tasks) AS totalTasks,
      (SELECT COUNT(*) FROM tasks WHERE completed = 1) AS completedTasks,
      (SELECT COUNT(*) FROM goals) AS totalGoals,
      (SELECT COUNT(*) FROM goals WHERE achieved = 1) AS achievedGoals,
      (SELECT COUNT(*) FROM focus_sessions) AS focusSessions,
      (SELECT COALESCE(SUM(duration_seconds), 0) FROM focus_sessions) AS focusSeconds
  `);
  return {
    totalTasks: Number(row?.totalTasks ?? 0),
    completedTasks: Number(row?.completedTasks ?? 0),
    totalGoals: Number(row?.totalGoals ?? 0),
    achievedGoals: Number(row?.achievedGoals ?? 0),
    focusSessions: Number(row?.focusSessions ?? 0),
    focusSeconds: Number(row?.focusSeconds ?? 0),
  };
}

export async function getRecentFocusSessions(db) {
  return db.getAllAsync(
    'SELECT id, duration_seconds, created_at FROM focus_sessions ORDER BY created_at DESC LIMIT 5'
  );
}
