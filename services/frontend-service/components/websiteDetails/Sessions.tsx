"use client";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const Sessions = () => {
  const { sessions, loading } = useSelector(
    (state: RootState) => state.websiteDetails
  );

  if (loading) return <p>Loading Sessions...</p>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Sessions</h2>
      {sessions && sessions.length > 0 ? (
        sessions.map((session: any, index: number) => (
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
