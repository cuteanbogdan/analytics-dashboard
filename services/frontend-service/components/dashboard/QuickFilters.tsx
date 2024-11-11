import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setFilterStatus } from "@/redux/slices/websitesSlice";

const QuickFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filterStatus = useSelector(
    (state: RootState) => state.websites.filterStatus
  );

  const handleFilterChange = (status: "all" | "active" | "inactive") => {
    dispatch(setFilterStatus(status));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Quick Filters
      </h3>
      <div className="flex space-x-4">
        <button
          onClick={() => handleFilterChange("all")}
          className={`px-3 py-2 rounded-md ${
            filterStatus === "all"
              ? "bg-indigo-600"
              : "bg-indigo-500 hover:bg-indigo-600"
          } text-white`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange("active")}
          className={`px-3 py-2 rounded-md ${
            filterStatus === "active"
              ? "bg-green-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          Active
        </button>
        <button
          onClick={() => handleFilterChange("inactive")}
          className={`px-3 py-2 rounded-md ${
            filterStatus === "inactive"
              ? "bg-red-600"
              : "bg-red-500 hover:bg-red-600"
          } text-white`}
        >
          Inactive
        </button>
      </div>
    </div>
  );
};

export default QuickFilters;
