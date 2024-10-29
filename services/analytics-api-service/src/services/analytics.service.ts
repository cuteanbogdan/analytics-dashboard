import { query } from "shared-config";

export const getPageViewsData = async () => {
  const text = `
    SELECT page_url, COUNT(*) AS views_count
    FROM tracking_data
    GROUP BY page_url
  `;
  const result = await query(text);
  return result.rows;
};

export const getVisitorStatsData = async () => {
  const text = `
    SELECT visitor_id, COUNT(*) AS visit_count, MAX(timestamp) AS last_visit
    FROM tracking_data
    GROUP BY visitor_id
  `;
  const result = await query(text);
  return result.rows;
};
