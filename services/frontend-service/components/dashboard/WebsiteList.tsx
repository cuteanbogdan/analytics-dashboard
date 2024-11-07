import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchWebsitesAsync } from "@/redux/slices/websitesSlice";

const WebsiteList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { websites, loading, error } = useSelector(
    (state: RootState) => state.websites
  );

  useEffect(() => {
    dispatch(fetchWebsitesAsync());
  }, [dispatch]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-6 md:mb-0">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Your Websites
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="space-y-2">
          {websites.map((site) => (
            <li key={site.id} className="text-indigo-600 hover:underline">
              <a href={site.site_url} target="_blank" rel="noopener noreferrer">
                {site.site_name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WebsiteList;
