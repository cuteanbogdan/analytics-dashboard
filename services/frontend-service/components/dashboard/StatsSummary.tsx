import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const StatsSummary: React.FC = () => {
  const websites = useSelector((state: RootState) => state.websites.websites);

  const totalWebsites = websites.length;
  const activeWebsites = websites.filter((site) => site.active).length;
  const inactiveWebsites = totalWebsites - activeWebsites;

  const recentlyAddedWebsites = websites.filter((site) => {
    const createdAt = new Date(parseInt(site.created_at, 10));
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    return createdAt >= thirtyDaysAgo;
  }).length;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Website Stats
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600">{totalWebsites}</p>
          <p className="text-sm text-gray-500">Total Websites</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{activeWebsites}</p>
          <p className="text-sm text-gray-500">Active Websites</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{inactiveWebsites}</p>
          <p className="text-sm text-gray-500">Inactive Websites</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {recentlyAddedWebsites}
          </p>
          <p className="text-sm text-gray-500">Recently Added</p>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;
