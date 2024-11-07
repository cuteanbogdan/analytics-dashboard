import React from "react";

const RecentActivity: React.FC = () => {
  const activities = [
    "Added new website: My Blog",
    "Viewed stats for My Blog",
    "Removed website: Old Shop",
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Recent Activity
      </h2>
      <ul className="space-y-2 text-gray-700">
        {activities.map((activity, index) => (
          <li key={index} className="text-sm">
            {activity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
