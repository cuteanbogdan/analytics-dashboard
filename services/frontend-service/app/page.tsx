"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return <div>Template</div>;
}
