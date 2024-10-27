CREATE TABLE IF NOT EXISTS tracking_data (
  id SERIAL PRIMARY KEY,
  tracking_id VARCHAR(255) NOT NULL,
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address VARCHAR(50),
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
