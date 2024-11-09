import Joi from "joi";
import { query } from "shared-config/dist/db";

export const trackingDataSchema = Joi.object({
  trackingId: Joi.string().uuid().required(),
  eventType: Joi.string().valid("pageview", "click", "form_submit").required(),
  pageUrl: Joi.string().uri().required(),
  referrer: Joi.string().uri().allow("").optional(),
  userAgent: Joi.string().required(),
  customData: Joi.object().optional(),
  ipAddress: Joi.string().required(),
});

export const isValidTrackingId = async (
  trackingId: string
): Promise<boolean> => {
  const result = await query(
    `SELECT 1 FROM users.sites WHERE tracking_id = $1 LIMIT 1`,
    [trackingId]
  );
  return (result.rowCount ?? 0) > 0;
};
