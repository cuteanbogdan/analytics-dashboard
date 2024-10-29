import { Request, Response } from "express";
import {
  getPageViewsData,
  getVisitorStatsData,
} from "../services/analytics.service";

export const getPageViews = async (req: Request, res: Response) => {
  try {
    const data = await getPageViewsData();
    res.json(data);
  } catch (error) {
    console.error("Error fetching page views:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getVisitorStats = async (req: Request, res: Response) => {
  try {
    const data = await getVisitorStatsData();
    res.json(data);
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
