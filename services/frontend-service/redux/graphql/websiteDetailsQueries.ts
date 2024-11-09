import { gql } from "@apollo/client";

export const GET_WEBSITE_DETAILS = gql`
  query getWebsiteByTrackingID($tracking_id: String!) {
    getWebsiteByTrackingID(tracking_id: $tracking_id) {
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

export const GET_PAGE_VIEWS = gql`
  query GetPageViews($tracking_id: ID!) {
    getPageViews(tracking_id: $tracking_id) {
      id
      tracking_id
      timestamp
      page_url
      views_count
      unique_visitors
      average_time_on_page
      bounce_rate
    }
  }
`;

export const GET_VISITOR_STATS = gql`
  query GetVisitorStats($tracking_id: ID!) {
    getVisitorStats(tracking_id: $tracking_id) {
      id
      tracking_id
      visitor_id
      device_type
      location
      visit_count
      first_visit
      last_visit
    }
  }
`;

export const GET_SESSIONS = gql`
  query GetPageSessions($tracking_id: ID!) {
    getPageSessions(tracking_id: $tracking_id) {
      id
      tracking_id
      page_url
      session_start
      session_end
    }
  }
`;
