-- הכנסת נתונים לדוגמה

USE meeting_management;

-- הוספת קבוצות פיתוח
INSERT INTO development_teams (team_name) VALUES
('Team UI'),
('Team Mobile'),
('Team React'),
('Team Backend'),
('Team DevOps'),
('Team QA');

-- הוספת פגישות לדוגמה
INSERT INTO meetings (team_id, start_datetime, end_datetime, description, room) VALUES
-- Team UI (team_id = 1)
(1, '2025-11-20 10:00:00', '2025-11-20 11:00:00', 'Sprint Planning Meeting', 'Blue Room'),
(1, '2025-11-22 14:00:00', '2025-11-22 15:30:00', 'Design Review', 'New York Room'),
(1, '2025-11-25 09:00:00', '2025-11-25 10:00:00', 'Daily Standup', 'Blue Room'),

-- Team Mobile (team_id = 2)
(2, '2025-11-21 11:00:00', '2025-11-21 12:00:00', 'iOS Development Sync', 'Large Board Room'),
(2, '2025-11-23 15:00:00', '2025-11-23 16:00:00', 'Android Release Planning', 'New York Room'),

-- Team React (team_id = 3)
(3, '2025-11-20 13:00:00', '2025-11-20 14:00:00', 'Code Review Session', 'Blue Room'),
(3, '2025-11-24 10:00:00', '2025-11-24 11:30:00', 'Architecture Discussion', 'Large Board Room'),
(3, '2025-11-26 14:00:00', '2025-11-26 15:00:00', 'Performance Optimization', 'New York Room'),

-- Team Backend (team_id = 4)
(4, '2025-11-21 09:00:00', '2025-11-21 10:30:00', 'API Design Meeting', 'Large Board Room'),
(4, '2025-11-23 13:00:00', '2025-11-23 14:00:00', 'Database Optimization', 'Blue Room'),

-- Team DevOps (team_id = 5)
(5, '2025-11-22 10:00:00', '2025-11-22 11:00:00', 'CI/CD Pipeline Review', 'New York Room'),
(5, '2025-11-24 15:00:00', '2025-11-24 16:00:00', 'Infrastructure Planning', 'Large Board Room'),

-- Team QA (team_id = 6)
(6, '2025-11-20 11:00:00', '2025-11-20 12:00:00', 'Test Strategy Meeting', 'Blue Room'),
(6, '2025-11-25 14:00:00', '2025-11-25 15:30:00', 'Bug Triage Session', 'New York Room');
