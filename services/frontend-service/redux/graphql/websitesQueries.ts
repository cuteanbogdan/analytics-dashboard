import { gql } from "@apollo/client";

export const GET_WEBSITES = gql`
  query GetWebsites {
    getWebsites {
      id
      tracking_id
      site_name
      site_url
      active
      created_at
      last_active_date
    }
  }
`;
