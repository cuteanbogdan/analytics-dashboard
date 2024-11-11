import { query } from "shared-config/dist/db";

interface AddWebsiteArgs {
  site_name: string;
  site_url: string;
}

interface EditWebsiteArgs {
  id: string;
  site_name: string;
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

    editWebsite: async (
      _: unknown,
      { id, site_name }: EditWebsiteArgs,
      context: { user?: { id: string } }
    ) => {
      if (!context.user || !context.user.id) {
        throw new Error("User not authenticated");
      }

      const websiteCheck = await query(
        "SELECT * FROM users.sites WHERE id = $1 AND user_id = $2",
        [id, context.user.id]
      );

      if (websiteCheck.rows.length === 0) {
        throw new Error("Website not found or access denied");
      }

      const result = await query(
        `UPDATE users.sites 
         SET site_name = $1 
         WHERE id = $2 
         RETURNING *`,
        [site_name, id]
      );

      return result.rows[0];
    },

    deleteWebsite: async (
      _: unknown,
      { id }: { id: string },
      context: { user?: { id: string } }
    ) => {
      if (!context.user || !context.user.id) {
        throw new Error("User not authenticated");
      }

      const websiteCheck = await query(
        "SELECT * FROM users.sites WHERE id = $1 AND user_id = $2",
        [id, context.user.id]
      );

      if (websiteCheck.rows.length === 0) {
        throw new Error("Website not found or access denied");
      }

      await query("DELETE FROM users.sites WHERE id = $1", [id]);
      return true;
    },
  },
};
