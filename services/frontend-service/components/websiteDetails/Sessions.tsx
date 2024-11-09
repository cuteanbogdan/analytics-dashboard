"use client";
import { gql, useQuery } from "@apollo/client";

const GET_SESSIONS = gql`
  query GetSessions($tracking_id: String!) {
    getSessions(tracking_id: $tracking_id) {
      sessionStart
      sessionEnd
      duration
    }
  }
`;

const Sessions = ({ trackingId }: { trackingId: string }) => {
  const { data, loading, error } = useQuery(GET_SESSIONS, {
    variables: { tracking_id: trackingId },
  });

  if (loading) return <p>Loading Sessions...</p>;
  if (error) return <p>Error loading sessions.</p>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Sessions</h2>
      {data.getSessions.map((session: any, index: number) => (
        <div key={index}>
          <p>Session Start: {session.sessionStart}</p>
          <p>Session End: {session.sessionEnd}</p>
          <p>Duration: {session.duration} mins</p>
        </div>
      ))}
    </div>
  );
};

export default Sessions;
