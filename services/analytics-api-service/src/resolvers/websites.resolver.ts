import { query } from "shared-config/dist/db";

interface AddWebsiteArgs {
  site_name: string;
  site_url: string;
}

export const websitesResolvers = {
  Query: {
    getWebsites: async (
      _: unknown,
      __: unknown,
      context: { user?: { id: string } }
    ) => {
      if (!context.user || !context.user.id) {
        throw new Error("User not authenticated");
      }

      try {
        const result = await query(
          "SELECT * FROM users.sites WHERE user_id = $1",
          [context.user.id]
        );
        return result.rows || [];
      } catch (error) {
        console.error("Error fetching websites:", error);
        return [];
      }
    },
    getWebsiteByTrackingID: async (
      _: unknown,
      { tracking_id }: { tracking_id: string },
      context: { user?: { id: string } }
    ) => {
      if (!context.user || !context.user.id) {
        throw new Error("User not authenticated");
      }

      const result = await query(
        "SELECT * FROM users.sites WHERE tracking_id = $1 AND user_id = $2",
        [tracking_id, context.user.id]
      );

      if (result.rows.length === 0) {
        throw new Error("Website not found or access denied");
      }

      return result.rows[0];
    },
  },
  Mutation: {
    addWebsite: async (
      _: unknown,
      { site_name, site_url }: AddWebsiteArgs,
      context: { user?: { id: string } }
    ) => {
      if (!context.user || !context.user.id) {
        throw new Error("User not authenticated");
      }

      const userId = context.user.id;

      let sanitizedUrl;
      try {
        const url = new URL(site_url);
        url.pathname = url.pathname.replace(/\/+$/, "");
        sanitizedUrl = url.href.toLowerCase();
      } catch (e) {
        throw new Error("Invalid URL format");
      }

      const duplicateCheck = await query(
        `SELECT * FROM users.sites WHERE site_url = $1`,
        [sanitizedUrl]
      );

      if (duplicateCheck.rows.length > 0) {
        throw new Error("A website with this URL already exists");
      }

      const result = await query(
        `INSERT INTO users.sites (user_id, site_name, site_url) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
        [userId, site_name, sanitizedUrl]
      );

      return result.rows[0];
    },

    checkWebsiteStatus: async (
      // template only
      _: unknown,
      { id }: { id: string },
      context: { user?: { id: string } }
    ) => {
      if (!context.user || !context.user.id) {
        throw new Error("User not authenticated");
      }

      const result = await query(
        "SELECT * FROM users.sites WHERE id = $1 AND user_id = $2",
        [id, context.user.id]
      );

      if (result.rows.length === 0) {
        throw new Error("Website not found or access denied");
      }

      const website = result.rows[0];
      const isActive = true;

      await query(
        "UPDATE users.sites SET active = $1, last_active_date = NOW() WHERE id = $2",
        [isActive, id]
      );

      return { ...website, active: isActive, last_active_date: new Date() };
    },
  },
};
