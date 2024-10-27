import amqplib, { Channel, Connection } from "amqplib";
import { RABBITMQ_URL } from "./config";
import { TrackingData } from "shared-types/dist/trackingData";

let channel: Channel;

export const connectToRabbitMQ = async (): Promise<void> => {
  const connection: Connection = await amqplib.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  console.log("Tracking Service - Connected to RabbitMQ");
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
