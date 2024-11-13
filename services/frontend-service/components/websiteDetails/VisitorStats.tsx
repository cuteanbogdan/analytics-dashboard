"use client";
import { RootState } from "@/redux/store";
import { formatTimestamp } from "@/redux/utils";
import { useSelector } from "react-redux";

const VisitorStats = () => {
  const { visitorStats, loading } = useSelector(
    (state: RootState) => state.websiteDetails
  );

  if (loading) return <p>Loading Visitor Stats...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-[95%] mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Visitor Stats
      </h2>
      {visitorStats && visitorStats.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">
                  Device Type
                </th>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">
                  Location
                </th>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">
                  Visit Count
                </th>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">
                  First Visit
                </th>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">
                  Last Visit
                </th>
              </tr>
            </thead>
            <tbody>
              {visitorStats.map((visitor: any, index: number) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-t`}
                >
                  <td className="py-2 px-4">{visitor.device_type}</td>
                  <td className="py-2 px-4">{visitor.location || "N/A"}</td>
                  <td className="py-2 px-4">{visitor.visit_count}</td>
                  <td className="py-2 px-4">
                    {formatTimestamp(Number(visitor.first_visit))}
                  </td>
                  <td className="py-2 px-4">
                    {formatTimestamp(Number(visitor.last_visit))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No visitor data available.</p>
      )}
    </div>
  );
};

export default VisitorStats;
