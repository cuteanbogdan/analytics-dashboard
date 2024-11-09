export interface WebsiteDetails {
  id: string;
  tracking_id: string;
  site_name: string;
  site_url: string;
  active: boolean;
  created_at: string;
  last_active_date: string | null;
}

export interface PageView {
  id: string;
  tracking_id: string;
  timestamp: string;
  page_url: string;
  views_count: number;
  unique_visitors: number;
}

export interface VisitorStat {
  id: string;
  tracking_id: string;
  visitor_id: string;
  device_type: string;
  location: string;
  visit_count: number;
  first_visit: string;
  last_visit: string;
}

export interface PageSession {
  id: string;
  tracking_id: string;
  page_url: string;
  session_start: string;
  session_end: string | null;
}

export interface WebsiteState {
  details: WebsiteDetails | null;
  pageViews: PageView[];
  visitorStats: VisitorStat[];
  sessions: PageSession[];
  loading: boolean;
  error: string | null;
}
