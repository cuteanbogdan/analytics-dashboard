import { TrackingData } from "shared-types/dist/trackingData";
import { query } from "shared-config/dist/db";

export const processSession = async (data: TrackingData): Promise<void> => {
  const { trackingId, pageUrl } = data;

  const sessionResult = await query(
    `
    SELECT * FROM analytics.page_sessions
    WHERE tracking_id = $1 AND page_url = $2 AND session_end IS NULL
    ORDER BY session_start DESC
    LIMIT 1
  `,
    [trackingId, pageUrl]
  );

  if ((sessionResult.rowCount ?? 0) > 0) {
    const existingSession = sessionResult.rows[0];
    await query(
      `
      UPDATE analytics.page_sessions
      SET session_end = $1
      WHERE id = $2
    `,
      [new Date(), existingSession.id]
    );
  } else {
    await query(
      `
      INSERT INTO analytics.page_sessions (tracking_id, page_url, session_start)
      VALUES ($1, $2, $3)
    `,
      [trackingId, pageUrl, new Date()]
    );
  }
};
