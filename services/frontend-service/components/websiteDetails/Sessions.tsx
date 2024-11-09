"use client";
import { gql, useQuery } from "@apollo/client";

const GET_SESSIONS = gql`
  query GetPageSessions($tracking_id: ID!, $page_url: String) {
    getPageSessions(tracking_id: $tracking_id, page_url: $page_url) {
      id
      tracking_id
      page_url
      session_start
      session_end
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
      {data?.getPageSessions?.length > 0 ? (
        data.getPageSessions.map((session: any, index: number) => (
          <div key={index}>
            <p>Session Start: {session.session_start}</p>
            <p>Session End: {session.session_end}</p>
            <p>
              Duration:{" "}
              {session.session_end
                ? calculateDuration(session.session_start, session.session_end)
                : "Ongoing"}{" "}
              mins
            </p>
          </div>
        ))
      ) : (
        <p>No session data available.</p>
      )}
    </div>
  );
};

const calculateDuration = (start: string, end: string) => {
  const startTime = new Date(start);
  const endTime = new Date(end);
  return Math.floor((endTime.getTime() - startTime.getTime()) / 60000);
};

export default Sessions;
