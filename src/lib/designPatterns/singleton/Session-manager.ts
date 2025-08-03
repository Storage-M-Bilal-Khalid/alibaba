import { Pool } from 'pg';
import crypto from 'crypto';
import Database from '@/lib/postgresSqlDbConnection';

const formatter = new Intl.DateTimeFormat('en-PK', {
  timeZone: 'Asia/Karachi',
  year: 'numeric',
  month: 'long',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

class SessionManager {
  private static instance: SessionManager;

  private constructor() {}

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
      console.log('✅ SessionManager instance created using Singleton pattern.');
    }
    return SessionManager.instance;
  }

  public async createSession(userId: number): Promise<string> {
    const pkOffsetMs = 5 * 60 * 60 * 1000;
    const nowUTC = new Date();
    const pool: Pool = Database();
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const createdAt = new Date(nowUTC.getTime() + pkOffsetMs);
    const expiresAt = new Date(createdAt.getTime() + 60 * 60 * 1000);
    const createdAtFormatted = formatter.format(createdAt);
    const expiresAtFormatted = formatter.format(expiresAt);

    await pool.query('DELETE FROM sessions WHERE user_id = $1', [userId]);

    await pool.query(
      `INSERT INTO sessions (user_id, session_token, created_at, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [userId, sessionToken, createdAt, expiresAt]
    );

    console.log('✅ Session token stored in database successfully.');
    console.log('Created At (PKT):', createdAtFormatted);
    console.log('Expires At (PKT +1hr):', expiresAtFormatted);
    return sessionToken;
  }

  public async getSession(userId: number): Promise<any> {
    const pool: Pool = Database();
    const result = await pool.query('SELECT * FROM sessions WHERE user_id = $1', [userId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  public async extendSession(userId: number): Promise<void> {
    const pool: Pool = Database();
    const newExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await pool.query(
      'UPDATE sessions SET expires_at = $1 WHERE user_id = $2',
      [newExpiry, userId]
    );
  }

  public async clearSession(userId: number): Promise<void> {
    const pool: Pool = Database();
    await pool.query('DELETE FROM sessions WHERE user_id = $1', [userId]);
  }

  public async validateSession(sessionToken: string, userId: number): Promise<boolean> {
        const pool: Pool = Database();
        const result = await pool.query(
            'SELECT expires_at FROM sessions WHERE user_id = $1 AND session_token = $2',
            [userId, sessionToken]
        );

        if (result.rows.length === 0) {
            return false;
        }

        const session = result.rows[0];
        const now = new Date();
        return session.expires_at > now;
    }
}

export default SessionManager;
