import { TrackingData } from "shared-types/dist/trackingData";
import { query } from "shared-config/dist/db";

export const processPageViews = async (data: TrackingData): Promise<void> => {
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
    const newAverageTimeOnPage = calculateAverageTimeOnPage(
      existingPageView.average_time_on_page,
      newViewsCount
    );
    const newBounceRate = calculateBounceRate(newViewsCount, newUniqueVisitors);

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
        newAverageTimeOnPage,
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
        calculateAverageTimeOnPage(0, 1),
        calculateBounceRate(1, isUniqueVisitor ? 1 : 0),
        new Date(),
      ]
    );
  }
};

async function isNewVisitor(
  trackingId: string,
  visitorId: string | undefined
): Promise<boolean> {
  if (!visitorId) return false;

  const result = await query(
    `
    SELECT COUNT(*) FROM analytics.visitor_stats
    WHERE tracking_id = $1 AND visitor_id = $2
  `,
    [trackingId, visitorId]
  );

  return result.rows[0].count === "0";
}

function calculateAverageTimeOnPage(
  previousAvg: number,
  totalViews: number
): number {
  // Placeholder logic to calculate the average time on page
  const simulatedVisitDuration = 120; // Simulated visit duration in seconds
  return (previousAvg * (totalViews - 1) + simulatedVisitDuration) / totalViews;
}

function calculateBounceRate(
  viewsCount: number,
  uniqueVisitors: number
): number {
  // Placeholder logic to calculate bounce rate as a percentage
  // Bounce rate formula: (Single-page visits / Total visits) * 100
  const singlePageVisits = Math.max(uniqueVisitors - 1, 0); // Simulate single-page visits
  return (singlePageVisits / viewsCount) * 100;
}
