export function timerLabel(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}

export function studyDuration(seconds) {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));
  if (safe < 60) return `${safe} sec`;
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes} min`;
}
