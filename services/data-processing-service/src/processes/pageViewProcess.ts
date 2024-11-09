import { TrackingData } from "shared-types/dist/trackingData";
import { query } from "shared-config/dist/db";

export const processPageViews = async (data: TrackingData): Promise<void> => {
  try {
    const isUniqueVisitor = await isNewVisitor(data.trackingId, data.ipAddress);

    const pageViewResult = await query(
      `
      SELECT * FROM analytics.page_views
      WHERE tracking_id = $1 AND page_url = $2
      `,
      [data.trackingId, data.pageUrl]
    );

    if ((pageViewResult.rowCount ?? 0) > 0) {
      const existingPageView = pageViewResult.rows[0];

      const newViewsCount = existingPageView.views_count + 1;
      const newUniqueVisitors =
        existingPageView.unique_visitors + (isUniqueVisitor ? 1 : 0);
      const newAverageTimeOnPage = await calculateAverageTimeOnPage(
        data.trackingId,
        data.pageUrl
      );
      const newBounceRate = await calculateBounceRate(
        data.trackingId,
        data.pageUrl
      );

      await query(
        `
        UPDATE analytics.page_views
        SET views_count = $2,
            unique_visitors = $3,
            average_time_on_page = $4,
            bounce_rate = $5,
            timestamp = $6
        WHERE id = $1
        `,
        [
          existingPageView.id,
          newViewsCount,
          newUniqueVisitors,
          Math.round(newAverageTimeOnPage),
          newBounceRate,
          new Date(),
        ]
      );
    } else {
      await query(
        `
        INSERT INTO analytics.page_views (tracking_id, page_url, views_count, unique_visitors, average_time_on_page, bounce_rate, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          data.trackingId,
          data.pageUrl,
          1,
          isUniqueVisitor ? 1 : 0,
          await calculateAverageTimeOnPage(data.trackingId, data.pageUrl),
          await calculateBounceRate(data.trackingId, data.pageUrl),
          new Date(),
        ]
      );
    }
  } catch (error) {
    console.error("Error in processPageViews:", error);
  }
};

async function isNewVisitor(
  trackingId: string,
  visitorId: string | undefined
): Promise<boolean> {
  if (!visitorId) return false;

  try {
    const result = await query(
      `
      SELECT COUNT(*) FROM analytics.visitor_stats
      WHERE tracking_id = $1 AND visitor_id = $2
      `,
      [trackingId, visitorId]
    );

    return result.rows[0].count === "0";
  } catch (error) {
    console.error("Error in isNewVisitor:", error);
    return false;
  }
}

async function calculateAverageTimeOnPage(
  trackingId: string,
  pageUrl: string
): Promise<number> {
  try {
    const result = await query(
      `
      SELECT EXTRACT(EPOCH FROM (session_end - session_start)) AS session_duration
      FROM analytics.page_sessions
      WHERE tracking_id = $1 AND page_url = $2 AND session_end IS NOT NULL
      `,
      [trackingId, pageUrl]
    );

    const sessionDurations = result.rows.map(
      (row: any) => row.session_duration || 0
    );
    const totalDuration = sessionDurations.reduce(
      (sum, duration) => sum + duration,
      0
    );
    const averageTime =
      sessionDurations.length > 0 ? totalDuration / sessionDurations.length : 0;

    return averageTime;
  } catch (error) {
    console.error("Error in calculateAverageTimeOnPage:", error);
    return 0;
  }
}

async function calculateBounceRate(
  trackingId: string,
  pageUrl: string
): Promise<number> {
  try {
    const singlePageResult = await query(
      `
      SELECT COUNT(*) AS single_page_visits
      FROM analytics.page_sessions
      WHERE tracking_id = $1 AND page_url = $2 AND session_end IS NOT NULL
      `,
      [trackingId, pageUrl]
    );
    const singlePageVisits = parseInt(
      singlePageResult.rows[0].single_page_visits,
      10
    );

    const totalSessionsResult = await query(
      `
      SELECT COUNT(*) AS total_sessions
      FROM analytics.page_sessions
      WHERE tracking_id = $1 AND page_url = $2
      `,
      [trackingId, pageUrl]
    );
    const totalSessions = parseInt(
      totalSessionsResult.rows[0].total_sessions,
      10
    );

    const bounceRate =
      totalSessions > 0 ? (singlePageVisits / totalSessions) * 100 : 0;

    return bounceRate;
  } catch (error) {
    console.error("Error in calculateBounceRate:", error);
    return 0;
  }
}
