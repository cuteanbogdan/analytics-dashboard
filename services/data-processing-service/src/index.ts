import { connectToRabbitMQ, consumeMessages } from "./queue";
import { query } from "./db";

const start = async () => {
  try {
    await connectToRabbitMQ();
    await consumeMessages();
    console.log("Data Processing Service is up and running");
  } catch (error) {
    console.error("Error starting Data Processing Service:", error);
  }
};

start();
