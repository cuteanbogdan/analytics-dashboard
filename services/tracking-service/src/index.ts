import express, { Request, Response } from "express";
import { PORT } from "./config";
import { connectToRabbitMQ, publishToQueue } from "./queue";
import { TrackingData } from "./types";

const app = express();
app.use(express.json());

const TRACKING_QUEUE = "tracking_data_queue";

app.post("/track", async (req: Request, res: Response): Promise<void> => {
  const trackingData: TrackingData = req.body;

  if (!trackingData.trackingId) {
    res.status(400).json({ error: "Missing trackingId" });
    return;
  }

  try {
    await publishToQueue(TRACKING_QUEUE, trackingData);
    res.status(200).json({ message: "Tracking data received" });
  } catch (error) {
    console.error("Error publishing to queue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, async (): Promise<void> => {
  console.log(`Tracking Service is running on port ${PORT}`);
  await connectToRabbitMQ();
});
