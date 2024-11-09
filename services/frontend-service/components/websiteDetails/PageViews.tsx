"use client";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const PageViews = () => {
  const { pageViews, loading } = useSelector(
    (state: RootState) => state.websiteDetails
  );

  if (loading) return <p>Loading Page Views...</p>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Page Views</h2>
      {pageViews && pageViews.length > 0 ? (
        pageViews.map((view: any, index: number) => (
          <div key={index} className="mb-4">
            <p>Page URL: {view.page_url}</p>
            <p>Views: {view.views_count}</p>
            <p>Unique Visitors: {view.unique_visitors}</p>
            <p>
              Average Time on Page:{" "}
              {view.average_time_on_page / 60 + " mins" || "N/A"}
            </p>
            <p>
              Bounce Rate: {view.bounce_rate ? `${view.bounce_rate}%` : "N/A"}
            </p>
            <hr className="my-2 border-gray-300" />
          </div>
        ))
      ) : (
        <p>No page view data available.</p>
      )}
    </div>
  );
};

export default PageViews;
