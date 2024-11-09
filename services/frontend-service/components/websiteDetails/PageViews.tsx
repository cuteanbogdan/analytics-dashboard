"use client";
import { gql, useQuery } from "@apollo/client";

const GET_PAGE_VIEWS = gql`
  query GetPageViews($tracking_id: String!) {
    getPageViews(tracking_id: $tracking_id) {
      pageUrl
      viewsCount
      uniqueVisitors
    }
  }
`;

const PageViews = ({ trackingId }: { trackingId: string }) => {
  const { data, loading, error } = useQuery(GET_PAGE_VIEWS, {
    variables: { tracking_id: trackingId },
  });

  if (loading) return <p>Loading Page Views...</p>;
  if (error) return <p>Error loading page views.</p>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Page Views</h2>
      {data.getPageViews.map((view: any, index: number) => (
        <div key={index}>
          <p>Page URL: {view.pageUrl}</p>
          <p>Views: {view.viewsCount}</p>
          <p>Unique Visitors: {view.uniqueVisitors}</p>
        </div>
      ))}
    </div>
  );
};

export default PageViews;
