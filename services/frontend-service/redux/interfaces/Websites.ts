export interface Website {
  id: string;
  tracking_id: string;
  site_name: string;
  site_url: string;
  active: boolean;
  created_at: string;
  last_active_date?: string;
}

export interface WebsitesState {
  websites: Website[];
  loading: boolean;
  error: string | null;
  filterStatus: "all" | "active" | "inactive";
}
