"use client";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const PageViews = () => {
  const { pageViews, loading } = useSelector(
    (state: RootState) => state.websiteDetails
  );

  if (loading) return <p>Loading Page Views...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-[95%] mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Page Views
      </h2>
      {pageViews && pageViews.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">
                  Page URL
                </th>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">
                  Views
                </th>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">
                  Unique Visitors
                </th>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">
                  Avg Time on Page
                </th>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">
                  Bounce Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {pageViews.map((view: any, index: number) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border-t`}
                >
                  <td className="py-2 px-4">{view.page_url}</td>
                  <td className="py-2 px-4">{view.views_count}</td>
                  <td className="py-2 px-4">{view.unique_visitors}</td>
                  <td className="py-2 px-4">
                    {view.average_time_on_page
                      ? `${(view.average_time_on_page / 60).toFixed(2)} mins`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {view.bounce_rate ? `${view.bounce_rate}%` : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No page view data available.
        </p>
      )}
    </div>
  );
};

export default PageViews;
