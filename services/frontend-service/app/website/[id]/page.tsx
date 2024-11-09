"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { useSelector } from "react-redux";
import {
  fetchPageViewsAsync,
  fetchSessionsAsync,
  fetchVisitorStatsAsync,
  fetchWebsiteDetailsAsync,
  resetWebsiteState,
} from "@/redux/slices/websiteDetailsSlice";
import VisitorStats from "@/components/websiteDetails/VisitorStats";
import PageViews from "@/components/websiteDetails/PageViews";
import Sessions from "@/components/websiteDetails/Sessions";
import { RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";

const WebsiteDetailsPage = () => {
  const { id } = useParams();
  const tracking_id = id as string;
  const isAuthenticated = useAuth();

  const dispatch = useAppDispatch();
  const { details, loading, error } = useSelector(
    (state: RootState) => state.websiteDetails
  );

  useEffect(() => {
    if (tracking_id) {
      dispatch(fetchWebsiteDetailsAsync(tracking_id));
      dispatch(fetchPageViewsAsync(tracking_id));
      dispatch(fetchVisitorStatsAsync(tracking_id));
      dispatch(fetchSessionsAsync(tracking_id));
    }
    return () => {
      dispatch(resetWebsiteState());
    };
  }, [dispatch, tracking_id]);

  const handleRefreshStatus = async () => {
    dispatch(fetchWebsiteDetailsAsync(tracking_id));
    dispatch(fetchPageViewsAsync(tracking_id));
    dispatch(fetchVisitorStatsAsync(tracking_id));
    dispatch(fetchSessionsAsync(tracking_id));
  };
  if (!isAuthenticated) {
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading website details: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {details?.site_name}
          </h1>
          <p className="text-gray-600">Tracking ID: {details?.tracking_id}</p>
          <a
            href={details?.site_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:underline"
          >
            {details?.site_url}
          </a>
          <p
            className={`text-sm ${
              details?.active ? "text-green-500" : "text-red-500"
            }`}
          >
            Status: {details?.active ? "Active" : "Inactive"}
          </p>
        </div>
        <button
          onClick={handleRefreshStatus}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Refresh Status
        </button>
      </div>

      <div className="space-y-4">
        <VisitorStats />
        <PageViews />
        <Sessions />
      </div>
    </div>
  );
};

export default WebsiteDetailsPage;
