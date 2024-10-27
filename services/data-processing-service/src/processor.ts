import { TrackingData } from "shared-types/dist/trackingData";
import { query } from "./db";

export const processTrackingData = async (
  data: TrackingData
): Promise<void> => {
  const enrichedData = {
    ...data,
    processedAt: new Date(),
  };

  const text = `
    INSERT INTO tracking_data (tracking_id, page_url, referrer, user_agent, ip_address, processed_at)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  const values = [
    enrichedData.trackingId,
    enrichedData.pageUrl,
    enrichedData.referrer,
    enrichedData.userAgent,
    enrichedData.ipAddress,
    enrichedData.processedAt,
  ];

  await query(text, values);
  console.log("Data processed and stored:", enrichedData);
};
