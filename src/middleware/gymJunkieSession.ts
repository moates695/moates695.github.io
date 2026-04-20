const TOKEN_KEY = "gym_junkie_export_token";
const EMAIL_KEY = "gym_junkie_export_email";

export interface GymJunkieSession {
  token: string;
  email: string;
}

export function loadSession(): GymJunkieSession | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const email = localStorage.getItem(EMAIL_KEY);
  if (!token || !email) return null;
  return { token, email };
}

export function saveSession(session: GymJunkieSession): void {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(EMAIL_KEY, session.email);
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}
