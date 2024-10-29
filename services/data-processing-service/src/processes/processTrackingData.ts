import { TrackingData } from "shared-types/dist/trackingData";
import { processPageViews } from "./pageViewProcess";
import { processVisitorStats } from "./visitorProcess";

export const processTrackingData = async (
  data: TrackingData
): Promise<void> => {
  await processVisitorStats(data);
  await processPageViews(data);

  console.log("Data processed and stored for:", data.trackingId);
};
