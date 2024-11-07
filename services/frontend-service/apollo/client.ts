import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL,
  cache: new InMemoryCache(),
  credentials: "include",
});

export default client;
