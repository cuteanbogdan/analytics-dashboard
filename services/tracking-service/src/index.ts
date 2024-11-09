import express, { Request, Response } from "express";
import cors from "cors";
import { PORT } from "./config";
import { connectToRabbitMQ, publishToQueue } from "./queue";
import { TrackingData } from "shared-types/dist/trackingData";
import { checkConnection } from "shared-config/dist/db";
import { trackingDataSchema, isValidTrackingId } from "./validators";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (origin) {
        callback(null, origin); // Allow dynamic origins
      } else {
        callback(null, "*"); // Allow non-origin requests
      }
    },
    credentials: true,
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

const TRACKING_QUEUE = "tracking_data_queue";

app.post("/track", async (req: Request, res: Response): Promise<void> => {
  const trackingData: TrackingData = {
    ...req.body,
    ipAddress: req.ip,
  };

  const { error } = trackingDataSchema.validate(trackingData);
  if (error) {
    res.status(400).json({ error: `Validation error: ${error.message}` });
    return;
  }

  const isValid = await isValidTrackingId(trackingData.trackingId);
  if (!isValid) {
    res.status(404).json({ error: "Invalid trackingId" });
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

const startServer = async (): Promise<void> => {
  try {
    await checkConnection("Tracking Service");
    await connectToRabbitMQ();
    app.listen(PORT, () => {
      console.log(`Tracking Service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start Tracking Service:", error);
    process.exit(1);
  }
};

startServer();
