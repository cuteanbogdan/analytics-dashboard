import { Router } from "express";
import {
  getPageViews,
  getVisitorStats,
} from "../controllers/analytics.controller";

const router = Router();

router.get("/page-views", getPageViews);
router.get("/visitor-stats", getVisitorStats);

export default router;
