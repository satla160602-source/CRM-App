
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  station_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT,
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_station_id ON customers(station_id);
CREATE INDEX idx_customers_name ON customers(name);
