"use client";
import { gql, useQuery } from "@apollo/client";

const GET_VISITOR_STATS = gql`
  query GetVisitorStats($tracking_id: String!) {
    getVisitorStats(tracking_id: $tracking_id) {
      totalVisitors
      newVisitors
      returningVisitors
    }
  }
`;

const VisitorStats = ({ trackingId }: { trackingId: string }) => {
  const { data, loading, error } = useQuery(GET_VISITOR_STATS, {
    variables: { tracking_id: trackingId },
  });

  if (loading) return <p>Loading Visitor Stats...</p>;
  if (error) return <p>Error loading visitor stats.</p>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Visitor Stats
      </h2>
      <p>Total Visitors: {data.getVisitorStats.totalVisitors}</p>
      <p>New Visitors: {data.getVisitorStats.newVisitors}</p>
      <p>Returning Visitors: {data.getVisitorStats.returningVisitors}</p>
    </div>
  );
};

export default VisitorStats;
