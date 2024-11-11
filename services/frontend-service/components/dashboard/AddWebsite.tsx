"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { addWebsiteAsync } from "@/redux/slices/websitesSlice";
import { AiOutlinePlus } from "react-icons/ai";

const AddWebsite: React.FC = () => {
  const [websiteName, setWebsiteName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error: apiError } = useSelector(
    (state: RootState) => state.websites
  );

  const handleAddWebsite = () => {
    setError(null);
    setSuccessMessage(null);

    if (!websiteName.trim() || !websiteUrl.trim()) {
      setError("Please enter both the website name and URL.");
      return;
    }

    dispatch(addWebsiteAsync({ site_name: websiteName, site_url: websiteUrl }))
      .unwrap()
      .then(() => {
        setSuccessMessage("Website added successfully!");
        setWebsiteName("");
        setWebsiteUrl("");
      })
      .catch(() => {
        setError("Failed to add website. Please try again.");
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-6 md:mb-0 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <AiOutlinePlus className="mr-2 text-indigo-600" />
        Add New Website
      </h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {apiError && <p className="text-red-500 text-sm mb-3">{apiError}</p>}
      {successMessage && (
        <p className="text-green-500 text-sm mb-3">{successMessage}</p>
      )}
      <input
        type="text"
        placeholder="Website Name"
        value={websiteName}
        onChange={(e) => setWebsiteName(e.target.value)}
        className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="url"
        placeholder="Website URL"
        value={websiteUrl}
        onChange={(e) => setWebsiteUrl(e.target.value)}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={handleAddWebsite}
        className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Website"}
      </button>
    </div>
  );
};

export default AddWebsite;
