export type Theme = 'light' | 'dark';

export function setTheme(theme: Theme) {
  const method = theme === 'dark' ? 'add' : 'remove';
  document.documentElement.classList[method]('dark');
  localStorage.setItem('prefs.theme', theme);
}

export function isDarkTheme() {
  return document.documentElement.classList.contains('dark');
}

export function toggleTheme() {
  setTheme(isDarkTheme() ? 'light' : 'dark');
}
