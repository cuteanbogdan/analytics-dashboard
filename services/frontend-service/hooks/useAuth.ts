"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { refreshAuthState } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        try {
          const result = await dispatch(refreshAuthState()).unwrap();
          if (!result) throw new Error("Refresh failed");
        } catch (error) {
          console.error("User session expired:", error);
          router.push("/login");
        }
      }
    };
    checkAuth();
  }, [isAuthenticated, dispatch, router]);

  return isAuthenticated;
};
