CREATE SCHEMA IF NOT EXISTS tracking_raw;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE tracking_raw.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_id UUID REFERENCES users.sites(tracking_id) ON DELETE CASCADE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  event_type VARCHAR(50) DEFAULT 'pageview',
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address VARCHAR(45),
  custom_data JSONB                            
);
