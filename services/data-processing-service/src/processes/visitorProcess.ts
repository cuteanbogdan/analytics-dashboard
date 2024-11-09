import axios from "axios";
import UAParser from "ua-parser-js";
import { TrackingData } from "shared-types/dist/trackingData";
import { query } from "shared-config/dist/db";
import { IP_API_TOKEN } from "../config";

export const processVisitorStats = async (
  data: TrackingData
): Promise<void> => {
  const visitorId = data.ipAddress;
  const location = await getLocationFromIp(visitorId);
  const deviceInfo = getDeviceInfoFromUserAgent(data.userAgent);

  const visitorResult = await query(
    `
    SELECT * FROM analytics.visitor_stats
    WHERE tracking_id = $1 AND visitor_id = $2
  `,
    [data.trackingId, visitorId]
  );

  if ((visitorResult.rowCount ?? 0) > 0) {
    const existingVisitor = visitorResult.rows[0];

    await query(
      `
      UPDATE analytics.visitor_stats
      SET visit_count = visit_count + 1,
          last_visit = $2,
          device_type = $3,
          location = $4
      WHERE id = $1
    `,
      [existingVisitor.id, new Date(), deviceInfo, JSON.stringify(location)]
    );
  } else {
    await query(
      `
      INSERT INTO analytics.visitor_stats (tracking_id, visitor_id, device_type, location, visit_count, first_visit, last_visit)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        data.trackingId,
        visitorId,
        deviceInfo,
        JSON.stringify(location),
        1,
        new Date(),
        new Date(),
      ]
    );
  }
};

async function getLocationFromIp(
  ip: string | undefined
): Promise<{ country: string; city: string } | null> {
  if (!ip) return null;

  try {
    const response = await axios.get(
      `https://ipinfo.io/${ip}?token=${IP_API_TOKEN}`
    );
    const { country, city } = response.data;
    return { country, city };
  } catch (error) {
    console.error("Error fetching location data:", error);
    return { country: "Unknown", city: "Unknown" };
  }
}

function getDeviceInfoFromUserAgent(userAgent: string | undefined): string {
  if (!userAgent) return "Unknown";

  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  return `${result.device.type || "Desktop"} - ${result.os.name} ${
    result.os.version
  }`;
}
