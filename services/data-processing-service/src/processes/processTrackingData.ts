import { TrackingData } from "shared-types/dist/trackingData";
import { processPageViews } from "./pageViewProcess";
import { processVisitorStats } from "./visitorProcess";
import { processSession } from "./sessionProcess";

export const processTrackingData = async (
  data: TrackingData
): Promise<void> => {
  await processVisitorStats(data);

  await processPageViews(data);

  await processSession(data);

  console.log("Data processed and stored for:", data.trackingId);
};