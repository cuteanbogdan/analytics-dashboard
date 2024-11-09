import { createMockStore, MockStore } from "../mocks/mockStore";
import {
  fetchWebsitesAsync,
  addWebsiteAsync,
} from "@/redux/slices/websitesSlice";
import { RootState } from "@/redux/store";
import client from "@/apollo/client";

jest.mock("@/apollo/client");

const mockWebsites = [
  {
    id: "1",
    tracking_id: "uuid-1",
    site_name: "Test Website",
    site_url: "http://test.com",
    active: true,
    created_at: "2024-01-01T00:00:00Z",
    last_active_date: "2024-01-02T00:00:00Z",
  },
];

describe("Websites Slice", () => {
  let store: MockStore;

  beforeEach(() => {
    store = createMockStore({
      websites: { websites: [], loading: false, error: null },
    });
    jest.clearAllMocks();
  });

  it("should fetch websites and update state on success", async () => {
    (client.query as jest.Mock).mockResolvedValue({
      data: { getWebsites: mockWebsites },
    });

    await store.dispatch(fetchWebsitesAsync());

    const state = store.getState() as RootState;
    expect(state.websites.websites).toEqual(mockWebsites);
    expect(state.websites.loading).toBe(false);
    expect(state.websites.error).toBe(null);
  });

  it("should handle errors during fetch websites", async () => {
    (client.query as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

    await store.dispatch(fetchWebsitesAsync());

    const state = store.getState() as RootState;
    expect(state.websites.websites).toEqual([]);
    expect(state.websites.loading).toBe(false);
    expect(state.websites.error).toBe("Failed to fetch websites");
  });

  it("should add a website and update state on success", async () => {
    const newWebsite = {
      id: "2",
      site_name: "New Website",
      site_url: "http://new.com",
      tracking_id: "uuid-2",
    };

    (client.mutate as jest.Mock).mockResolvedValue({
      data: { addWebsite: newWebsite },
    });

    await store.dispatch(
      addWebsiteAsync({
        site_name: newWebsite.site_name,
        site_url: newWebsite.site_url,
      })
    );

    const state = store.getState() as RootState;
    expect(state.websites.websites).toContainEqual(newWebsite);
    expect(state.websites.loading).toBe(false);
    expect(state.websites.error).toBe(null);
  });

  it("should handle errors during add website", async () => {
    (client.mutate as jest.Mock).mockRejectedValue(new Error("Add failed"));

    await store.dispatch(
      addWebsiteAsync({
        site_name: "Fail Website",
        site_url: "http://fail.com",
      })
    );

    const state = store.getState() as RootState;
    expect(state.websites.loading).toBe(false);
    expect(state.websites.error).toBe("Failed to add website");
  });
});
