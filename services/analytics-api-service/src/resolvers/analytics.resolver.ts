import { query } from "shared-config/dist/db";

export const analyticsResolvers = {
  Query: {
    getPageViews: async (
      _: unknown,
      { tracking_id }: { tracking_id: string }
    ) => {
      const result = await query(
        `SELECT * FROM analytics.page_views WHERE tracking_id = $1 ORDER BY timestamp DESC`,
        [tracking_id]
      );
      return result.rows;
    },

    getVisitorStats: async (
      _: unknown,
      { tracking_id }: { tracking_id: string }
    ) => {
      const result = await query(
        `SELECT * FROM analytics.visitor_stats WHERE tracking_id = $1 ORDER BY last_visit DESC`,
        [tracking_id]
      );
      return result.rows;
    },

    getPageSessions: async (
      _: unknown,
      { tracking_id, page_url }: { tracking_id: string; page_url: string }
    ) => {
      const result = await query(
        `
        SELECT * FROM analytics.page_sessions 
        WHERE tracking_id = $1 AND (page_url = $2 OR $2 IS NULL) 
        ORDER BY session_start DESC
        `,
        [tracking_id, page_url || null]
      );
      return result.rows;
    },
  },
};
