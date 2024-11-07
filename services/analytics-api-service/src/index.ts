import express from "express";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors";
import typeDefs from "./schema";
import { resolvers } from "./resolvers";
import { authenticateToken } from "shared-config/dist/auth.middleware";
import cookieParser from "cookie-parser";
import { checkConnection } from "shared-config/dist/db";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(authenticateToken);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await checkConnection("Analytics-API-Service");

  await server.start();
  app.use(
    "/api/analytics",
    cors<cors.CorsRequest>(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        user: req.user,
      }),
    })
  );

  const PORT = process.env.PORT || 5003;
  app.listen(PORT, () => {
    console.log(
      `Analytics API running at http://localhost:${PORT}/api/analytics`
    );
  });
}

startServer();
