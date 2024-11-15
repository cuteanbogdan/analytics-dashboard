CREATE SCHEMA IF NOT EXISTS analytics;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE analytics.page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_id UUID REFERENCES users.sites(tracking_id) ON DELETE CASCADE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  page_url TEXT,
  views_count INT DEFAULT 1,
  unique_visitors INT DEFAULT 0,
  average_time_on_page INT,            
  bounce_rate DECIMAL(5, 2)                
);

CREATE TABLE analytics.visitor_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_id UUID REFERENCES users.sites(tracking_id) ON DELETE CASCADE,
  visitor_id TEXT,
  device_type VARCHAR(50),                  
  location TEXT,                           
  visit_count INT DEFAULT 1,
  first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics.page_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token UUID NOT NULL,
  tracking_id UUID REFERENCES users.sites(tracking_id) ON DELETE CASCADE,
  page_url TEXT,
  session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_end TIMESTAMP
);