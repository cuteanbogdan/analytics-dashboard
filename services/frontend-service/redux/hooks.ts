import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store";

// Export a typed version of useDispatch for async thunks
export const useAppDispatch = () => useDispatch<AppDispatch>();
