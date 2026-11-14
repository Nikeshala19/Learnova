// Store dates as local YYYY-MM-DD values, rather than permanent labels such as "Today".
// The date has no time zone offset, so it stays the same calendar day on this device.
export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function dateFromChoice(choice, reference = new Date()) {
  if (choice === 'Anytime') return 'Anytime';
  const date = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  if (choice === 'Tomorrow') date.setDate(date.getDate() + 1);
  if (choice === 'In 7 days' || choice === 'This week') date.setDate(date.getDate() + 7);
  return localDateKey(date);
}

export function dueDateLabel(stored, reference = new Date()) {
  if (stored === 'Anytime' || !stored) return 'Anytime';
  // Fallback for old records if they have not been migrated yet.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(stored)) return stored;

  const [year, month, day] = stored.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (localDateKey(date) !== stored) return stored;
  const today = new Date(reference.getFullYear(), reference.getMonth(), reference.getDate());
  const difference = Math.round((date.getTime() - today.getTime()) / 86400000);
  if (difference === 0) return 'Today';
  if (difference === 1) return 'Tomorrow';
  const readable = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return difference < 0 ? `Overdue · ${readable}` : readable;
}
