DROP TABLE IF EXISTS resources CASCADE;
-- ALTER SEQUENCE resources_id_seq RESTART;
CREATE TABLE resources (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  url VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  like_id INTEGER,
  comment_id INTEGER,
  rating_id INTEGER
);
