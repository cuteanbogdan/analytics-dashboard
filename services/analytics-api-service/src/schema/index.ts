import { readFileSync } from "fs";
import { join } from "path";
import gql from "graphql-tag";

const typeDefs = gql(
  readFileSync(join(__dirname, "analytics.graphql"), "utf8")
);

export default typeDefs;
