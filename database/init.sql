-- DB & Tables
CREATE DATABASE IF NOT EXISTS ikea CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ikea;

CREATE TABLE IF NOT EXISTS furniture_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS furniture (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type_id INT NOT NULL,
  dimensions VARCHAR(50) NOT NULL, -- למשל "100 x 50 x 30"
  color VARCHAR(30) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_type FOREIGN KEY (type_id) REFERENCES furniture_types(id)
);

-- Seed types
INSERT INTO furniture_types (name) VALUES ('שולחן'),('כיסא'),('ספה'),('ארון')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Sample items
INSERT INTO furniture (type_id, dimensions, color, price)
VALUES
  (1,'100 x 50 x 30','לבן',399.90),
  (2,'40 x 40 x 90','שחור',129.00)
;
