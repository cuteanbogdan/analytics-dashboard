CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  refresh_token TEXT,
  role VARCHAR(50) DEFAULT 'user',        
  status VARCHAR(50) DEFAULT 'active',  
  plan_tier VARCHAR(50) DEFAULT 'free',   
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE users.sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users.accounts(id) ON DELETE CASCADE,
  site_name VARCHAR(255) NOT NULL,
  site_url TEXT NOT NULL,
  tracking_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
