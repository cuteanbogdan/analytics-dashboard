import { query } from "shared-config/dist/db";

export const updateSiteStatus = async (trackingId: string): Promise<void> => {
  try {
    await query(
      `
      UPDATE users.sites
      SET active = TRUE, last_active_date = NOW()
      WHERE tracking_id = $1
      `,
      [trackingId]
    );
  } catch (error) {
    console.error("Error updating site status:", error);
    throw new Error("Failed to update site status");
  }
};
