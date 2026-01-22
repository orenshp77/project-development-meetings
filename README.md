# מערכת ניהול פגישות

מערכת Full Stack לניהול פגישות של קבוצות פיתוח בארגון.
בנויה עם React בצד לקוח, Node.js/Express בצד שרת ומסד נתונים MySQL.

## תוכן עניינים
- [דרישות מקדימות](#דרישות-מקדימות)
- [התקנה](#התקנה)
- [הרצת הפרויקט](#הרצת-הפרויקט)
- [מבנה הפרויקט](#מבנה-הפרויקט)
- [API Documentation](#api-documentation)
- [תכונות](#תכונות)

## דרישות מקדימות

לפני שמתחילים, וודאו שיש לכם מותקנים:

* Node.js גרסה 16 ומעלה
* MySQL Server גרסה 8 ומעלה
* npm (מגיע עם Node.js)

## התקנה

### שלב 1: יצירת מסד הנתונים

1. פתחו את MySQL Workbench או התחברו לשרת MySQL דרך שורת הפקודה:
```bash
mysql -u root -p
```

2. הריצו את קובץ הסכימה ליצירת מסד הנתונים והטבלאות:
```bash
mysql -u root -p < database/schema.sql
```

3. הכניסו נתונים לדוגמה:
```bash
mysql -u root -p < database/sample_data.sql
```

או באופן ידני דרך MySQL Workbench:
- פתחו את הקובץ `database/schema.sql` והריצו אותו
- פתחו את הקובץ `database/sample_data.sql` והריצו אותו

### שלב 2: התקנת צד שרת

1. נווטו לתיקיית backend:
```bash
cd backend
```

2. התקינו את התלויות:
```bash
npm install
```

3. צרו קובץ `.env` לפי הדוגמה:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=meeting_management
DB_PORT=3306
PORT=5000
```

### שלב 3: התקנת צד לקוח

1. נווטו לתיקיית frontend:
```bash
cd frontend
```

2. התקינו את התלויות:
```bash
npm install
```

## הרצת הפרויקט

### הרצת צד שרת

1. פתחו טרמינל ונווטו לתיקיית backend:
```bash
cd backend
```

2. הריצו את השרת:
```bash
npm start
```

השרת ירוץ על: `http://localhost:5000`

### הרצת צד לקוח

1. פתחו טרמינל נוסף ונווטו לתיקיית frontend:
```bash
cd frontend
```

2. הריצו את אפליקציית React:
```bash
npm run dev
```

האפליקציה תרוץ על: `http://localhost:5173`

3. פתחו דפדפן וגשו לכתובת שמוצגת בטרמינל

## מבנה הפרויקט

```
project-Meeting-management/
│
├── database/
│   ├── schema.sql           # סכימת מסד הנתונים
│   └── sample_data.sql      # נתונים לדוגמה
│
├── backend/
│   ├── src/
│   │   ├── index.js         # שרת Express והגדרת Routes
│   │   └── db.js            # חיבור למסד הנתונים
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── App.jsx          # קומפוננט ראשי
    │   ├── App.css          # עיצוב
    │   ├── main.jsx         # Entry point
    │   └── index.css        # עיצוב גלובלי
    └── package.json
```

## API Documentation

### 1. קבלת כל קבוצות הפיתוח
```http
GET /api/teams
```

**תגובה:**
```json
[
  {
    "team_id": 1,
    "team_name": "Team UI"
  },
  {
    "team_id": 2,
    "team_name": "Team Mobile"
  }
]
```

### 2. קבלת פגישות של קבוצה ספציפית
```http
GET /api/meetings/:teamId
```

**פרמטרים:**
- `teamId` - מזהה קבוצת הפיתוח

**תגובה:**
```json
[
  {
    "meeting_id": 1,
    "team_id": 1,
    "start_datetime": "2025-11-20T10:00:00.000Z",
    "end_datetime": "2025-11-20T11:00:00.000Z",
    "description": "Sprint Planning Meeting",
    "room": "Blue Room",
    "team_name": "Team UI"
  }
]
```

### 3. הוספת פגישה חדשה
```http
POST /api/meetings
```

**Body:**
```json
{
  "team_id": 1,
  "start_datetime": "2025-11-25T14:00:00",
  "end_datetime": "2025-11-25T15:00:00",
  "description": "Code Review Session",
  "room": "Blue Room"
}
```

**תגובה:**
```json
{
  "meeting_id": 15,
  "message": "Meeting created successfully"
}
```

### 4. קבלת כל הפגישות (בונוס)
```http
GET /api/meetings
```

## בדיקה עם Postman

דוגמאות:

1. **GET All Teams**
   - Method: GET
   - URL: `http://localhost:5000/api/teams`

2. **GET Meetings by Team**
   - Method: GET
   - URL: `http://localhost:5000/api/meetings/1`

3. **POST New Meeting**
   - Method: POST
   - URL: `http://localhost:5000/api/meetings`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
     "team_id": 1,
     "start_datetime": "2025-11-28T10:00:00",
     "end_datetime": "2025-11-28T11:00:00",
     "description": "Team Sync Meeting",
     "room": "New York Room"
   }
   ```

## תכונות

### מסד נתונים
* טבלת קבוצות פיתוח עם מפתח ראשי אוטומטי
* טבלת פגישות עם מפתח זר לקבוצות
* תמיכה בעברית (UTF8)
* נתונים לדוגמה כלולים

### צד שרת
* RESTful API עם Express
* נתיב לקבלת כל הקבוצות
* נתיב לקבלת פגישות לפי קבוצה
* נתיב להוספת פגישה חדשה
* בדיקת תקינות נתונים
* תמיכה ב CORS
* טיפול בשגיאות

### צד לקוח
* תיבת בחירה לקבוצת פיתוח
* תצוגת פגישות בכרטיסיות
* טופס להוספת פגישה חדשה
* בדיקת תקינות בטופס
* עיצוב מודרני
* תמיכה במובייל (Responsive)
* ממשק בעברית מלא (RTL)

## פתרון בעיות נפוצות

### שגיאת חיבור למסד הנתונים
```
Error: connect ECONNREFUSED
```
**פתרון:** וודאו ש MySQL Server רץ ושפרטי הגישה בקובץ `.env` נכונים.

### שגיאת CORS
```
Access to fetch blocked by CORS policy
```
**פתרון:** וודאו שהשרת רץ וש CORS מופעל (כבר מוגדר בקוד).

### הפרונטאנד לא מציג נתונים
**פתרון:**
1. וודאו שהשרת רץ על פורט 5000
2. בדקו את הקונסול בדפדפן לשגיאות
3. וודאו שיש נתונים במסד הנתונים

## טכנולוגיות

* React 19 + Vite
* Node.js + Express
* MySQL 8
* CSS3

## רישיון

פרויקט לימודי.
