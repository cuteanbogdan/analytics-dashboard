import { TrackingData } from "shared-types/dist/trackingData";
import { query } from "shared-config/dist/db";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const processSession = async (data: TrackingData): Promise<void> => {
  const { trackingId, pageUrl, sessionToken } = data;
  const now = new Date();

  const sessionResult = await query(
    `
    SELECT * FROM analytics.page_sessions
    WHERE tracking_id = $1 AND page_url = $2 AND session_token = $3
    ORDER BY session_start DESC
    LIMIT 1
  `,
    [trackingId, pageUrl, sessionToken]
  );

  if ((sessionResult.rowCount ?? 0) > 0) {
    const existingSession = sessionResult.rows[0];
    const lastActivity = new Date(
      existingSession.session_end || existingSession.session_start
    );

    if (now.getTime() - lastActivity.getTime() < SESSION_TIMEOUT) {
      await query(
        `
        UPDATE analytics.page_sessions
        SET session_end = $1
        WHERE id = $2
      `,
        [now, existingSession.id]
      );
      return;
    }
  }

  await query(
    `
    INSERT INTO analytics.page_sessions (tracking_id, page_url, session_token, session_start)
    VALUES ($1, $2, $3, $4)
  `,
    [trackingId, pageUrl, sessionToken, now]
  );
};
