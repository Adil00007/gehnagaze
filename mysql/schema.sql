-- Gehna Gaze MySQL schema

CREATE TABLE IF NOT EXISTS products (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  discounted_price DECIMAL(12, 2) NULL,
  image_url TEXT NOT NULL,
  category VARCHAR(120) NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX products_created_at_idx (created_at)
);

CREATE TABLE IF NOT EXISTS discounts (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  percentage DECIMAL(5, 2) NULL,
  active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX discounts_created_at_idx (created_at),
  INDEX discounts_active_idx (active)
);

CREATE TABLE IF NOT EXISTS orders (
  id CHAR(36) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(80) NOT NULL,
  address TEXT NOT NULL,
  payment_method VARCHAR(80) NOT NULL,
  transaction_id VARCHAR(255) NOT NULL,
  notes TEXT NOT NULL,
  items JSON NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX orders_created_at_idx (created_at),
  INDEX orders_status_idx (status)
);

CREATE TABLE IF NOT EXISTS uploads (
  id CHAR(36) PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  data MEDIUMBLOB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX categories_created_at_idx (created_at)
);

CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(80) PRIMARY KEY,
  setting_value TEXT NOT NULL
);