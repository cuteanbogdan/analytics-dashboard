"use client";
import { gql, useQuery } from "@apollo/client";

const GET_PAGE_VIEWS = gql`
  query GetPageViews($tracking_id: ID!) {
    getPageViews(tracking_id: $tracking_id) {
      id
      tracking_id
      timestamp
      page_url
      views_count
      unique_visitors
      average_time_on_page
      bounce_rate
    }
  }
`;

const PageViews = ({ trackingId }: { trackingId: string }) => {
  const { data, loading, error } = useQuery(GET_PAGE_VIEWS, {
    variables: { tracking_id: trackingId },
  });

  if (loading) return <p>Loading Page Views...</p>;
  if (error) return <p>Error loading page views.</p>;

  const pageViews = data?.getPageViews;

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Page Views</h2>
      {pageViews && pageViews.length > 0 ? (
        pageViews.map((view: any, index: number) => (
          <div key={index} className="mb-4">
            <p>Page URL: {view.page_url}</p>
            <p>Views: {view.views_count}</p>
            <p>Unique Visitors: {view.unique_visitors}</p>
            <p>Average Time on Page: {view.average_time_on_page || "N/A"}</p>
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
