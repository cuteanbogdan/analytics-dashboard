import { readFileSync } from "fs";
import { join } from "path";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { DocumentNode } from "graphql";

const analyticsSchema = readFileSync(
  join(__dirname, "analytics.graphql"),
  "utf8"
);
const websitesSchema = readFileSync(
  join(__dirname, "websites.graphql"),
  "utf8"
);

const typeDefs: DocumentNode = mergeTypeDefs([analyticsSchema, websitesSchema]);

export default typeDefs;
