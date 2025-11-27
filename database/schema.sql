-- יצירת מסד הנתונים
CREATE DATABASE IF NOT EXISTS development_meetings;
USE development_meetings;

-- טבלת קבוצות פיתוח
CREATE TABLE IF NOT EXISTS development_teams (
    team_id INT PRIMARY KEY AUTO_INCREMENT,
    team_name VARCHAR(100) NOT NULL
);

-- טבלת פגישות
CREATE TABLE IF NOT EXISTS meetings (
    meeting_id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    description TEXT,
    room VARCHAR(100) NOT NULL,
    FOREIGN KEY (team_id) REFERENCES development_teams(team_id) ON DELETE CASCADE
);

-- הכנסת נתונים לטבלת קבוצות פיתוח
INSERT INTO development_teams (team_name) VALUES
('Team UI'),
('Team Mobile'),
('Team React'),
('Team Backend'),
('Team DevOps');

-- הכנסת נתונים לטבלת פגישות
INSERT INTO meetings (team_id, start_datetime, end_datetime, description, room) VALUES
(1, '2025-11-28 09:00:00', '2025-11-28 10:00:00', 'Daily Standup - UI Team', 'Blue Room'),
(1, '2025-11-28 14:00:00', '2025-11-28 15:30:00', 'Design Review Meeting', 'New York Room'),
(2, '2025-11-28 10:00:00', '2025-11-28 11:00:00', 'Mobile Sprint Planning', 'Large Board Room'),
(2, '2025-11-29 09:00:00', '2025-11-29 09:30:00', 'Mobile Daily Standup', 'Blue Room'),
(3, '2025-11-28 11:00:00', '2025-11-28 12:00:00', 'React Component Architecture Discussion', 'New York Room'),
(3, '2025-11-29 15:00:00', '2025-11-29 16:00:00', 'Code Review Session', 'Blue Room'),
(4, '2025-11-28 13:00:00', '2025-11-28 14:00:00', 'API Design Meeting', 'Large Board Room'),
(5, '2025-11-29 10:00:00', '2025-11-29 11:30:00', 'Infrastructure Planning', 'New York Room');
