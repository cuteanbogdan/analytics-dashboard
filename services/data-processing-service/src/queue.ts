import amqplib, { Channel, Connection } from "amqplib";
import { RABBITMQ_URL, QUEUE_NAME } from "./config";
import { processTrackingData } from "./processes/processTrackingData";

let channel: Channel;

export const connectToRabbitMQ = async (): Promise<void> => {
  const connection: Connection = await amqplib.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  console.log("Data Processing Service - Connected to RabbitMQ");
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
