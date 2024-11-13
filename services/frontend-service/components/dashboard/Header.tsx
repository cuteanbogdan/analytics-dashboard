import React from "react";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { logoutAsync } from "@/redux/slices/authSlice";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    router.push("/login");
  };

  return (
    <header className="w-full max-w-5xl p-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
