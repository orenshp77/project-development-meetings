# מערכת ניהול פגישות

מערכת לניהול פגישות של קבוצות פיתוח.

## הרצה

### מסד נתונים
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample_data.sql
```

### Backend
```bash
cd backend
npm install
npm start
```
רץ על http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
רץ על http://localhost:5173

## הגדרות
צרו קובץ `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=meeting_management
DB_PORT=3306
PORT=5000
```

## API

| נתיב | שיטה | תיאור |
|------|------|-------|
| /api/teams | GET | כל הקבוצות |
| /api/meetings/:teamId | GET | פגישות לפי קבוצה |
| /api/meetings | POST | הוספת פגישה |
