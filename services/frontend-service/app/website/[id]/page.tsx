"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  fetchPageViewsAsync,
  fetchSessionsAsync,
  fetchVisitorStatsAsync,
  fetchWebsiteDetailsAsync,
  resetWebsiteState,
} from "@/redux/slices/websiteDetailsSlice";
import VisitorStats from "@/components/websiteDetails/VisitorStats";
import PageViews from "@/components/websiteDetails/PageViews";
import Sessions from "@/components/websiteDetails/Sessions";
import { FaSyncAlt, FaCode, FaClipboard } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation, Pagination } from "swiper/modules";
import TrendsChart from "@/components/websiteDetails/TrendsChart";
import { processTrendData } from "@/redux/utils";

const WebsiteDetailsPage = () => {
  const { id } = useParams();
  const tracking_id = id as string;
  const isAuthenticated = useAuth();

  const dispatch = useAppDispatch();
  const { details, pageViews, sessions, visitorStats, loading, error } =
    useSelector((state: RootState) => state.websiteDetails);

  const [isModalOpen, setModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const [showFullScript, setShowFullScript] = useState(false);

  useEffect(() => {
    if (tracking_id) {
      dispatch(fetchWebsiteDetailsAsync(tracking_id));
      dispatch(fetchPageViewsAsync(tracking_id));
      dispatch(fetchVisitorStatsAsync(tracking_id));
      dispatch(fetchSessionsAsync(tracking_id));
    }
    return () => {
      dispatch(resetWebsiteState());
    };
  }, [dispatch, tracking_id]);

  const handleRefreshStatus = () => {
    dispatch(fetchWebsiteDetailsAsync(tracking_id));
    dispatch(fetchPageViewsAsync(tracking_id));
    dispatch(fetchVisitorStatsAsync(tracking_id));
    dispatch(fetchSessionsAsync(tracking_id));
  };

  const visitorTrendData = processTrendData(visitorStats, "first_visit");
  const pageViewTrendData = processTrendData(pageViews, "timestamp");
  const sessionTrendData = processTrendData(sessions, "session_start");

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setShowFullScript(false);
    setCopySuccess("");
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(embedScript).then(() => {
      setCopySuccess("Script copied to clipboard!");
      setTimeout(() => setCopySuccess(""), 2000);
    });
  };

  const embedScript = `<script src="https://example.com/track.js?tracking_id=${tracking_id}" defer></script>`;
  const truncatedScript = `<script src="https://example.com/track.js?..." defer></script>`;

  if (!isAuthenticated) return null;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading website details: {error}</p>;

  const totalViews = pageViews.reduce(
    (total, page) => total + (page.views_count || 0),
    0
  );
  const uniqueVisitors = visitorStats.length;
  const bounceRate = "0";

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-100 min-h-screen">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {details?.site_name}
          </h1>
          <p className="text-sm text-gray-500">
            Last Updated: {new Date().toLocaleString()}
          </p>
          <p
            className={`text-sm ${
              details?.active ? "text-green-600" : "text-red-600"
            }`}
          >
            Status: {details?.active ? "Active" : "Not Active"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefreshStatus}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaSyncAlt className="mr-2" /> Refresh
          </button>
          <button
            onClick={handleOpenModal}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaCode className="mr-2" /> Get Script
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Total Views</p>
          <p className="text-2xl font-bold text-indigo-600">
            {totalViews || "N/A"}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Unique Visitors</p>
          <p className="text-2xl font-bold text-green-600">
            {uniqueVisitors || "N/A"}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Bounce Rate</p>
          <p className="text-2xl font-bold text-red-600">
            {bounceRate ? `${bounceRate}%` : "N/A"}
          </p>
        </div>
      </section>

      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
        modules={[Navigation, Pagination]}
      >
        <SwiperSlide>
          <div className="p-6 bg-white rounded-lg shadow-lg max-w-full h-[70%] overflow-auto">
            <VisitorStats />
            <div className="flex justify-center mt-4">
              <div className="w-70 h-60 flex justify-center">
                <TrendsChart
                  data={visitorTrendData}
                  label="Visitor Count"
                  backgroundColor="rgba(99, 102, 241, 0.2)"
                  borderColor="rgba(99, 102, 241, 1)"
                />
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="p-6 bg-white rounded-lg shadow-lg max-w-full h-[70%] overflow-auto">
            <PageViews />
            <div className="flex justify-center mt-4">
              <div className="w-70 h-60 flex justify-center">
                <TrendsChart
                  data={pageViewTrendData}
                  label="Page Views"
                  backgroundColor="rgba(34, 197, 94, 0.2)"
                  borderColor="rgba(34, 197, 94, 1)"
                />
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="p-6 bg-white rounded-lg shadow-lg max-w-full h-[70%] overflow-auto">
            <Sessions />
            <div className="flex justify-center mt-4">
              <div className="w-70 h-60 flex justify-center">
                <TrendsChart
                  data={sessionTrendData}
                  label="Sessions"
                  backgroundColor="rgba(239, 68, 68, 0.2)"
                  borderColor="rgba(239, 68, 68, 1)"
                />
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">Embed Script</h2>
            <p className="mb-4">
              Copy and paste the script below into the{" "}
              <strong>{`<body>`}</strong> section of your website to activate
              tracking:
            </p>
            <div className="bg-gray-100 p-3 rounded text-sm mb-4 overflow-x-auto whitespace-pre-wrap">
              <pre className="break-words">
                {showFullScript ? (
                  <code>{`<script src="https://example.com/track.js?tracking_id=${tracking_id}" defer></script>`}</code>
                ) : (
                  <code>{truncatedScript}</code>
                )}
              </pre>
              <span
                onClick={() => setShowFullScript(!showFullScript)}
                className="text-blue-500 ml-2 cursor-pointer"
              >
                {showFullScript ? "Show less" : "Show more"}
              </span>
            </div>
            <button
              onClick={handleCopyScript}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <FaClipboard className="mr-2" /> Copy Script
            </button>
            {copySuccess && (
              <p className="text-green-600 text-sm mt-2">{copySuccess}</p>
            )}
            <button
              onClick={handleCloseModal}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteDetailsPage;
