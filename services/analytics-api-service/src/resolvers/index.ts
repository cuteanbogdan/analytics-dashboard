import { analyticsResolvers } from "./analytics.resolver";

export const resolvers = {
  Query: {
    ...analyticsResolvers.Query,
  },
};
