import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api';

function App() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [meetings, setMeetings] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    team_id: '',
    start_datetime: '',
    end_datetime: '',
    description: '',
    room: ''
  });

  // טעינת קבוצות הפיתוח
  useEffect(() => {
    fetchTeams();
  }, []);

  // טעינת פגישות כאשר נבחרת קבוצה
  useEffect(() => {
    if (selectedTeam) {
      fetchMeetings(selectedTeam);
      setFormData(prev => ({ ...prev, team_id: selectedTeam }));
    } else {
      setMeetings([]);
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_URL}/teams`);
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      alert('שגיאה בטעינת קבוצות');
    }
  };

  const fetchMeetings = async (teamId) => {
    try {
      const response = await fetch(`${API_URL}/meetings/${teamId}`);
      const data = await response.json();
      setMeetings(data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      alert('שגיאה בטעינת פגישות');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // בדיקת כל השדות
    if (!formData.team_id || !formData.start_datetime || !formData.end_datetime ||
        !formData.description || !formData.room) {
      alert('נא למלא את כל השדות');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('הפגישה נוספה בהצלחה!');
        setShowAddForm(false);
        setFormData({
          team_id: selectedTeam,
          start_datetime: '',
          end_datetime: '',
          description: '',
          room: ''
        });
        // רענון רשימת הפגישות
        if (selectedTeam) {
          fetchMeetings(selectedTeam);
        }
      } else {
        const error = await response.json();
        alert(`שגיאה: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding meeting:', error);
      alert('שגיאה בהוספת פגישה');
    }
  };

  const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container">
      <header>
        <h1>מערכת ניהול פגישות</h1>
        <p>ניהול פגישות לקבוצות הפיתוח בחברה</p>
      </header>

      <div className="controls">
        <div className="team-selector">
          <label htmlFor="teamSelect">בחר קבוצת פיתוח:</label>
          <select
            id="teamSelect"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="select-box"
          >
            <option value="">-- בחר קבוצה --</option>
            {teams.map(team => (
              <option key={team.team_id} value={team.team_id}>
                {team.team_name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="add-button"
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={!selectedTeam}
        >
          {showAddForm ? 'ביטול' : '+ הוסף פגישה חדשה'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-form-container">
          <h2>הוספת פגישה חדשה</h2>
          <form onSubmit={handleSubmit} className="meeting-form">
            <div className="form-group">
              <label>קבוצת פיתוח:</label>
              <select
                name="team_id"
                value={formData.team_id}
                onChange={handleInputChange}
                required
              >
                <option value="">בחר קבוצה</option>
                {teams.map(team => (
                  <option key={team.team_id} value={team.team_id}>
                    {team.team_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>תאריך ושעת התחלה:</label>
              <input
                type="datetime-local"
                name="start_datetime"
                value={formData.start_datetime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>תאריך ושעת סיום:</label>
              <input
                type="datetime-local"
                name="end_datetime"
                value={formData.end_datetime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>תיאור הפגישה:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>חדר:</label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                placeholder="לדוגמה: Blue Room, New York Room"
                required
              />
            </div>

            <button type="submit" className="submit-button">
              הוסף פגישה
            </button>
          </form>
        </div>
      )}

      {selectedTeam && (
        <div className="meetings-container">
          <h2>פגישות של {teams.find(t => t.team_id === parseInt(selectedTeam))?.team_name}</h2>

          {meetings.length === 0 ? (
            <p className="no-meetings">אין פגישות לקבוצה זו</p>
          ) : (
            <div className="meetings-grid">
              {meetings.map(meeting => (
                <div key={meeting.meeting_id} className="meeting-card">
                  <div className="meeting-header">
                    <h3>{meeting.description}</h3>
                    <span className="room-badge">{meeting.room}</span>
                  </div>
                  <div className="meeting-details">
                    <div className="detail-item">
                      <span className="label">התחלה:</span>
                      <span className="value">{formatDateTime(meeting.start_datetime)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">סיום:</span>
                      <span className="value">{formatDateTime(meeting.end_datetime)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App
