import { query } from "shared-config/dist/db";

interface AddWebsiteArgs {
  site_name: string;
  site_url: string;
}

export const websitesResolvers = {
  Query: {
    getWebsites: async () => {
      try {
        const result = await query("SELECT * FROM users.sites");
        return result.rows || [];
      } catch (error) {
        console.error("Error fetching websites:", error);
        return [];
      }
    },
    getWebsiteByID: async (_: unknown, { id }: { id: string }) => {
      const result = await query("SELECT * FROM users.sites WHERE id = $1", [
        id,
      ]);
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

      const result = await query(
        `INSERT INTO users.sites (user_id, site_name, site_url) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
        [userId, site_name, site_url]
      );

      return result.rows[0];
    },

    checkWebsiteStatus: async (_: unknown, { id }: { id: string }) => {
      // only template
      const result = await query("SELECT * FROM users.sites WHERE id = $1", [
        id,
      ]);

      if (result.rows.length > 0) {
        const website = result.rows[0];
        const isActive = true;
        await query(
          "UPDATE users.sites SET active = $1, last_active_date = NOW() WHERE id = $2",
          [isActive, id]
        );

        return { ...website, active: isActive, lastActiveDate: new Date() };
      }
      throw new Error("Website not found");
    },
  },
};
