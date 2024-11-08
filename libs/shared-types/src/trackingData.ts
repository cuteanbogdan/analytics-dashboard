export interface TrackingData {
  trackingId: string;
  eventType: string;
  pageUrl: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  customData?: string;
}
