"use client";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const VisitorStats = () => {
  const { visitorStats, loading } = useSelector(
    (state: RootState) => state.websiteDetails
  );

  if (loading) return <p>Loading Visitor Stats...</p>;

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
