import { gql } from "@apollo/client";

export const ADD_WEBSITE = gql`
  mutation AddWebsite($site_name: String!, $site_url: String!) {
    addWebsite(site_name: $site_name, site_url: $site_url) {
      id
      site_name
      site_url
      active
      tracking_id
      last_active_date
      created_at
    }
  }
`;

export const EDIT_WEBSITE = gql`
  mutation EditWebsite($id: ID!, $site_name: String!) {
    editWebsite(id: $id, site_name: $site_name) {
      id
      site_name
      site_url
      active
      tracking_id
      last_active_date
      created_at
    }
  }
`;

export const DELETE_WEBSITE = gql`
  mutation deleteWebsite($id: ID!) {
    deleteWebsite(id: $id)
  }
`;
