"use client";
import React from "react";
import Header from "@/components/dashboard/Header";
import AddWebsite from "@/components/dashboard/AddWebsite";
import WebsiteList from "@/components/dashboard/WebsiteList";
import StatsSummary from "@/components/dashboard/StatsSummary";
import QuickFilters from "@/components/dashboard/QuickFilters";
import { useAuth } from "@/hooks/useAuth";

const Dashboard: React.FC = () => {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col w-full max-w-5xl p-4 space-y-6">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <AddWebsite />
          <div className="flex flex-col space-y-4 md:w-1/2">
            <StatsSummary />
            <QuickFilters />
          </div>
        </div>
        <WebsiteList />
      </div>
    </div>
  );
};

export default Dashboard;
