"use client";
import { gql, useQuery } from "@apollo/client";

const GET_VISITOR_STATS = gql`
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

const VisitorStats = ({ trackingId }: { trackingId: string }) => {
  const { data, loading, error } = useQuery(GET_VISITOR_STATS, {
    variables: { tracking_id: trackingId },
  });

  if (loading) return <p>Loading Visitor Stats...</p>;
  if (error) return <p>Error loading visitor stats.</p>;

  const visitorStats = data?.getVisitorStats;

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Visitor Stats
      </h2>
      {visitorStats && visitorStats.length > 0 ? (
        <>
          <p>Total Visitors: {visitorStats.length}</p>
          <ul>
            {visitorStats.map((visitor: any, index: number) => (
              <li key={index}>
                <p>Device Type: {visitor.device_type}</p>
                <p>Location: {visitor.location}</p>
                <p>Visit Count: {visitor.visit_count}</p>
                <p>First Visit: {visitor.first_visit}</p>
                <p>Last Visit: {visitor.last_visit}</p>
                <hr className="my-2" />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No visitor data available.</p>
      )}
    </div>
  );
};

export default VisitorStats;
