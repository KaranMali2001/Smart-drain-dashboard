-- Insert some sample data for testing
INSERT INTO sensor_data (distance, motor, timestamp) VALUES
  (250, 'OFF', 1755673213950),
  (180, 'ON', 1755673216776),
  (150, 'ON', 1755673219602),
  (220, 'OFF', 1755673222428),
  (190, 'ON', 1755673225254);

INSERT INTO motor_logs (motor_state, distance, reason, timestamp) VALUES
  ('ON', 180, 'Distance below threshold (200)', 1755673216776),
  ('ON', 150, 'Distance below threshold (200)', 1755673219602),
  ('OFF', 220, 'Distance above threshold (200)', 1755673222428),
  ('ON', 190, 'Distance below threshold (200)', 1755673225254);
