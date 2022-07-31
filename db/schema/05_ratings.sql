DROP TABLE IF EXISTS ratings CASCADE;
-- ALTER SEQUENCE ratings_id_seq RESTART;
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id REFERENCES users(id) ON DELETE CASCADE,
  resource_id REFERENCES resources(id) ON DELETE CASCADE,
);