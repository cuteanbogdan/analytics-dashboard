import { analyticsResolvers } from "./analytics.resolver";
import { websitesResolvers } from "./websites.resolver";

export const resolvers = {
  Query: {
    ...analyticsResolvers.Query,
    ...websitesResolvers.Query,
  },
  Mutation: {
    ...websitesResolvers.Mutation,
  },
};
