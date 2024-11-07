"use client";
import React from "react";
import Header from "@/components/dashboard/Header";
import AddWebsite from "@/components/dashboard/AddWebsite";
import WebsiteList from "@/components/dashboard/WebsiteList";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useAuth } from "@/hooks/useAuth";

const Dashboard: React.FC = () => {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col md:flex-row md:space-x-8 w-full max-w-5xl p-4">
        <AddWebsite />
        <WebsiteList />
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;
