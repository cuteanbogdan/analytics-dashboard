"use client";
import { useParams } from "next/navigation";
import { useQuery, gql } from "@apollo/client";
import VisitorStats from "@/components/websiteDetails/VisitorStats";
import PageViews from "@/components/websiteDetails/PageViews";
import Sessions from "@/components/websiteDetails/Sessions";

const GET_WEBSITE_DETAILS = gql`
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

const WebsiteDetailsPage = () => {
  const { id } = useParams();
  const tracking_id = id as string;
  const { data, loading, error, refetch } = useQuery(GET_WEBSITE_DETAILS, {
    variables: { tracking_id },
    skip: !tracking_id,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading website details.</p>;

  const handleRefreshStatus = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error("Error refreshing status:", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {data.getWebsiteByTrackingID.site_name}
          </h1>
          <p className="text-gray-600">
            Tracking ID: {data.getWebsiteByTrackingID.tracking_id}
          </p>
          <a
            href={data.getWebsiteByTrackingID.site_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:underline"
          >
            {data.getWebsiteByTrackingID.site_url}
          </a>
          <p
            className={`text-sm ${
              data.getWebsiteByTrackingID.active
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            Status: {data.getWebsiteByTrackingID.active ? "Active" : "Inactive"}
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
        <VisitorStats trackingId={tracking_id} />
        <PageViews trackingId={tracking_id} />
        <Sessions trackingId={tracking_id} />
      </div>
    </div>
  );
};

export default WebsiteDetailsPage;
