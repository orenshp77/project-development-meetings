-- יצירת מסד נתונים לניהול פגישות
CREATE DATABASE IF NOT EXISTS meeting_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE meeting_management;

-- טבלת קבוצות פיתוח
CREATE TABLE IF NOT EXISTS development_teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- טבלת פגישות
CREATE TABLE IF NOT EXISTS meetings (
    meeting_id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    description TEXT NOT NULL,
    room VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES development_teams(team_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- יצירת אינדקס לשיפור ביצועים
CREATE INDEX idx_team_id ON meetings(team_id);
CREATE INDEX idx_start_datetime ON meetings(start_datetime);
