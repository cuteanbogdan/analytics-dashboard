import { connectToRabbitMQ, consumeMessages } from "./queue";
import { checkConnection } from "shared-config/dist/db";

const start = async () => {
  try {
    await checkConnection("Data-Processing Service");
    await connectToRabbitMQ();
    await consumeMessages();
    console.log("Data Processing Service is up and running");
  } catch (error) {
    console.error("Error starting Data Processing Service:", error);
  }
};

start();
