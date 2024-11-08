import amqplib, { Channel, Connection } from "amqplib";
import { RABBITMQ_URL, QUEUE_NAME } from "./config";
import { processTrackingData } from "./processes/processTrackingData";

let channel: Channel;

export const connectToRabbitMQ = async (
  retries = 5,
  delay = 5000
): Promise<void> => {
  while (retries > 0) {
    try {
      const connection: Connection = await amqplib.connect(RABBITMQ_URL);
      channel = await connection.createChannel();
      console.log("Data Processing Service - Connected to RabbitMQ");
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

export const consumeMessages = async (): Promise<void> => {
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  channel.consume(QUEUE_NAME, async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      console.log("Received message:", data);

      await processTrackingData(data);

      channel.ack(msg);
    }
  });
};
