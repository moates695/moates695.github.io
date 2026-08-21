const TOKEN_KEY = "gym_junkie_export_token";
const EMAIL_KEY = "gym_junkie_export_email";
const EXPIRES_KEY = "gym_junkie_export_expires";

export interface GymJunkieSession {
  token: string;
  email: string;
  /**
   * Unix ms at which the export token stops working, when the server told us.
   * Absent for a session stored before this was recorded, which is treated as
   * an unknown expiry rather than an expired one.
   */
  expiresAt?: number;
}

export function loadSession(): GymJunkieSession | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const email = localStorage.getItem(EMAIL_KEY);
  if (!token || !email) return null;

  const stored = Number(localStorage.getItem(EXPIRES_KEY));
  const expiresAt = Number.isFinite(stored) && stored > 0 ? stored : undefined;

  // A token we know has expired is dropped here rather than being handed back
  // for a request that can only come home 401.
  if (expiresAt !== undefined && expiresAt <= Date.now()) {
    clearSession();
    return null;
  }

  return { token, email, ...(expiresAt !== undefined ? { expiresAt } : {}) };
}

export function saveSession(session: GymJunkieSession): void {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(EMAIL_KEY, session.email);
  if (session.expiresAt !== undefined) {
    localStorage.setItem(EXPIRES_KEY, String(session.expiresAt));
  } else {
    localStorage.removeItem(EXPIRES_KEY);
  }
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(EXPIRES_KEY);
}
