-- Create users table (handled by Supabase Auth automatically)
-- Create sensor_data table to store IoT readings
CREATE TABLE IF NOT EXISTS sensor_data (
  id BIGSERIAL PRIMARY KEY,
  distance INTEGER NOT NULL,
  motor VARCHAR(10) NOT NULL CHECK (motor IN ('ON', 'OFF')),
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create motor_logs table to track motor state changes
CREATE TABLE IF NOT EXISTS motor_logs (
  id BIGSERIAL PRIMARY KEY,
  motor_state VARCHAR(10) NOT NULL CHECK (motor_state IN ('ON', 'OFF')),
  distance INTEGER NOT NULL,
  reason TEXT,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sensor_data_timestamp ON sensor_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_motor_logs_timestamp ON motor_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_data_created_at ON sensor_data(created_at DESC);
