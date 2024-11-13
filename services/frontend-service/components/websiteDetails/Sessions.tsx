"use client";
import { RootState } from "@/redux/store";
import { formatTimestamp } from "@/redux/utils";
import { useSelector } from "react-redux";

const Sessions = () => {
  const { sessions, loading } = useSelector(
    (state: RootState) => state.websiteDetails
  );

  if (loading) return <p>Loading Sessions...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-[95%] mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Sessions
      </h2>
      {sessions && sessions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">
                  Page URL
                </th>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">
                  Session Start
                </th>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">
                  Session End
                </th>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session: any, index: number) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-t`}
                >
                  <td className="py-2 px-4">{session.page_url || "N/A"}</td>
                  <td className="py-2 px-4">
                    {formatTimestamp(Number(session.session_start))}
                  </td>
                  <td className="py-2 px-4">
                    {session.session_end
                      ? formatTimestamp(Number(session.session_end))
                      : "Ongoing"}
                  </td>
                  <td className="py-2 px-4">
                    {session.session_end
                      ? `${calculateDuration(
                          Number(session.session_start),
                          Number(session.session_end)
                        )} mins`
                      : "Ongoing"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No session data available.</p>
      )}
    </div>
  );
};

const calculateDuration = (start: number, end: number) => {
  const startTime = new Date(start);
  const endTime = new Date(end);
  return Math.floor((endTime.getTime() - startTime.getTime()) / 60000);
};

export default Sessions;
