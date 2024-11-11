import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchWebsitesAsync,
  deleteWebsiteAsync,
  editWebsiteAsync,
} from "@/redux/slices/websitesSlice";
import Link from "next/link";
import { FaEdit, FaTrashAlt, FaCheck } from "react-icons/fa";
import { selectFilteredWebsites } from "@/redux/utils";

const WebsiteList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const websites = useSelector(selectFilteredWebsites);
  const { loading, error } = useSelector((state: RootState) => state.websites);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editName, setEditName] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    dispatch(fetchWebsitesAsync());
  }, [dispatch]);

  const handleEdit = (siteId: string) => {
    setEditMode((prev) => ({ ...prev, [siteId]: true }));
    setEditName((prev) => ({
      ...prev,
      [siteId]: websites.find((site) => site.id === siteId)?.site_name || "",
    }));
  };

  const handleSave = (siteId: string) => {
    dispatch(editWebsiteAsync({ id: siteId, site_name: editName[siteId] }));
    setEditMode((prev) => ({ ...prev, [siteId]: false }));
  };

  const handleDelete = (siteId: string) => {
    if (confirm("Are you sure you want to delete this website?")) {
      dispatch(deleteWebsiteAsync(siteId));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Websites</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {websites.map((site) => (
            <div
              key={site.id}
              className="bg-gray-50 p-4 rounded-lg shadow-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col items-start border border-gray-200"
            >
              <div className="flex-1 w-full">
                {editMode[site.id] ? (
                  <input
                    type="text"
                    value={editName[site.id]}
                    onChange={(e) =>
                      setEditName((prev) => ({
                        ...prev,
                        [site.id]: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 mb-2 text-lg font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <Link href={`/website/${site.tracking_id}`}>
                    <h3 className="text-lg font-semibold text-indigo-600 hover:underline">
                      {site.site_name}
                    </h3>
                  </Link>
                )}
                <p className="text-sm text-gray-500">{site.site_url}</p>
                <p
                  className={`text-sm mt-1 font-semibold ${
                    site.active ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Status: {site.active ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="flex w-full justify-between mt-3">
                {editMode[site.id] ? (
                  <button
                    onClick={() => handleSave(site.id)}
                    className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600"
                  >
                    <FaCheck size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(site.id)}
                    className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  >
                    <FaEdit size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(site.id)}
                  className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <FaTrashAlt size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WebsiteList;
