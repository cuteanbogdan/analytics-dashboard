import { query } from "shared-config/dist/db";

export const analyticsResolvers = {
  Query: {
    pageViews: async (_: any, { trackingId, startDate, endDate, top }: any) => {
      let sql = `SELECT * FROM analytics.page_views WHERE tracking_id = $1`;
      const params = [trackingId];

      if (startDate && endDate) {
        sql += " AND timestamp BETWEEN $2 AND $3";
        params.push(startDate, endDate);
      }

      sql += " ORDER BY views_count DESC";
      if (top) {
        sql += ` LIMIT ${top}`;
      }

      const result = await query(sql, params);
      return result.rows;
    },

    visitorStats: async (
      _: any,
      { trackingId, location, newVisitors }: any
    ) => {
      let sql = `SELECT * FROM analytics.visitor_stats WHERE tracking_id = $1`;
      const params = [trackingId];

      if (location) {
        sql += " AND location IS NOT NULL";
      }

      if (newVisitors) {
        sql += " AND visit_count = 1";
      }

      const result = await query(sql, params);
      return result.rows;
    },

    bounceRate: async (_: any, { trackingId }: any) => {
      const result = await query(
        `SELECT bounce_rate FROM analytics.page_views WHERE tracking_id = $1`,
        [trackingId]
      );
      return result.rows[0]?.bounce_rate || 0.0;
    },

    averageTimeOnPage: async (_: any, { trackingId }: any) => {
      const result = await query(
        `SELECT average_time_on_page FROM analytics.page_views WHERE tracking_id = $1`,
        [trackingId]
      );
      return result.rows[0]?.average_time_on_page || 0;
    },

    pageSessions: async (
      _: any,
      { trackingId, pageUrl, startDate, endDate }: any
    ) => {
      let sql = `
        SELECT id, tracking_id, page_url, session_start, session_end,
               EXTRACT(EPOCH FROM (session_end - session_start)) AS session_duration
        FROM analytics.page_sessions
        WHERE tracking_id = $1
      `;
      const params = [trackingId];

      if (pageUrl) {
        sql += " AND page_url = $2";
        params.push(pageUrl);
      }

      if (startDate && endDate) {
        sql += " AND session_start BETWEEN $3 AND $4";
        params.push(startDate, endDate);
      }

      sql += " ORDER BY session_start DESC";

      const result = await query(sql, params);
      return result.rows.map((row: any) => ({
        ...row,
        sessionDuration: row.session_duration || 0,
      }));
    },
  },
};
