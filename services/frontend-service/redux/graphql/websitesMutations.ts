import { gql } from "@apollo/client";

export const ADD_WEBSITE = gql`
  mutation AddWebsite($site_name: String!, $site_url: String!) {
    addWebsite(site_name: $site_name, site_url: $site_url) {
      id
      site_name
      site_url
    }
  }
`;
