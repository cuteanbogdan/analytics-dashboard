import { createMockStore, MockStore } from "../mocks/mockStore";
import {
  fetchWebsiteDetailsAsync,
  fetchPageViewsAsync,
  fetchVisitorStatsAsync,
  fetchSessionsAsync,
  resetWebsiteState,
} from "@/redux/slices/websiteDetailsSlice";
import { RootState } from "@/redux/store";
import client from "@/apollo/client";

jest.mock("@/apollo/client");

const mockWebsiteDetails = {
  id: "1",
  tracking_id: "uuid-1",
  site_name: "Test Website",
  site_url: "http://test.com",
  active: true,
  created_at: "2024-01-01T00:00:00Z",
  last_active_date: "2024-01-02T00:00:00Z",
};

const mockPageViews = [
  {
    id: "pv-1",
    tracking_id: "uuid-1",
    timestamp: "2024-01-01T00:00:00Z",
    page_url: "/home",
    views_count: 10,
    unique_visitors: 5,
  },
];

const mockVisitorStats = [
  {
    id: "vs-1",
    tracking_id: "uuid-1",
    visitor_id: "visitor-1",
    device_type: "Desktop",
    location: '{"country":"USA"}',
    visit_count: 3,
    first_visit: "2024-01-01T00:00:00Z",
    last_visit: "2024-01-02T00:00:00Z",
  },
];

const mockSessions = [
  {
    id: "session-1",
    tracking_id: "uuid-1",
    page_url: "/home",
    session_start: "2024-01-01T00:00:00Z",
    session_end: "2024-01-01T00:30:00Z",
  },
];

describe("WebsiteDetails Slice", () => {
  let store: MockStore;

  beforeEach(() => {
    store = createMockStore({
      websiteDetails: {
        details: null,
        pageViews: [],
        visitorStats: [],
        sessions: [],
        loading: false,
        error: null,
      },
    });
    jest.clearAllMocks();
  });

  it("should fetch website details and update state on success", async () => {
    (client.query as jest.Mock).mockResolvedValue({
      data: { getWebsiteByTrackingID: mockWebsiteDetails },
    });

    await store.dispatch(fetchWebsiteDetailsAsync("uuid-1"));

    const state = store.getState() as RootState;
    expect(state.websiteDetails.details).toEqual(mockWebsiteDetails);
    expect(state.websiteDetails.loading).toBe(false);
    expect(state.websiteDetails.error).toBe(null);
  });

  it("should handle errors during fetch website details", async () => {
    (client.query as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

    await store.dispatch(fetchWebsiteDetailsAsync("uuid-1"));

    const state = store.getState() as RootState;
    expect(state.websiteDetails.details).toBeNull();
    expect(state.websiteDetails.loading).toBe(false);
    expect(state.websiteDetails.error).toBe("Failed to fetch website details");
  });

  it("should fetch page views and update state on success", async () => {
    (client.query as jest.Mock).mockResolvedValue({
      data: { getPageViews: mockPageViews },
    });

    await store.dispatch(fetchPageViewsAsync("uuid-1"));

    const state = store.getState() as RootState;
    expect(state.websiteDetails.pageViews).toEqual(mockPageViews);
    expect(state.websiteDetails.error).toBe(null);
  });

  it("should fetch visitor stats and update state on success", async () => {
    (client.query as jest.Mock).mockResolvedValue({
      data: { getVisitorStats: mockVisitorStats },
    });

    await store.dispatch(fetchVisitorStatsAsync("uuid-1"));

    const state = store.getState() as RootState;
    expect(state.websiteDetails.visitorStats).toEqual(mockVisitorStats);
    expect(state.websiteDetails.error).toBe(null);
  });

  it("should fetch sessions and update state on success", async () => {
    (client.query as jest.Mock).mockResolvedValue({
      data: { getPageSessions: mockSessions },
    });

    await store.dispatch(fetchSessionsAsync("uuid-1"));

    const state = store.getState() as RootState;
    expect(state.websiteDetails.sessions).toEqual(mockSessions);
    expect(state.websiteDetails.error).toBe(null);
  });

  it("should reset website details state", () => {
    store.dispatch(resetWebsiteState());

    const state = store.getState() as RootState;
    expect(state.websiteDetails.details).toBeNull();
    expect(state.websiteDetails.pageViews).toEqual([]);
    expect(state.websiteDetails.visitorStats).toEqual([]);
    expect(state.websiteDetails.sessions).toEqual([]);
    expect(state.websiteDetails.error).toBe(null);
  });
});
