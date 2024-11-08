import amqplib, { Channel, Connection } from "amqplib";
import { RABBITMQ_URL } from "./config";
import { TrackingData } from "shared-types/dist/trackingData";

let channel: Channel;

export const connectToRabbitMQ = async (
  retries = 5,
  delay = 5000
): Promise<void> => {
  while (retries > 0) {
    try {
      const connection: Connection = await amqplib.connect(RABBITMQ_URL);
      channel = await connection.createChannel();
      console.log("Tracking Service - Connected to RabbitMQ");
      return;
    } catch (error) {
      console.error(
        `Failed to connect to RabbitMQ. Retrying in ${delay / 1000} seconds...`,
        error
      );
      retries -= 1;
      if (retries === 0) {
        throw new Error(
          "Could not connect to RabbitMQ after multiple attempts"
        );
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

export const publishToQueue = async (
  queue: string,
  data: TrackingData
): Promise<void> => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
};
