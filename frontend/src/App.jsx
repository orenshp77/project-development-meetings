import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [meetings, setMeetings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
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
    } else {
      setMeetings([]);
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API_URL}/teams`);
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchMeetings = async (teamId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/meetings/team/${teamId}`);
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      team_id: '',
      start_datetime: '',
      end_datetime: '',
      description: '',
      room: ''
    });
    setEditingMeeting(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.team_id || !formData.start_datetime || !formData.end_datetime || !formData.description || !formData.room) {
      Swal.fire({
        icon: 'warning',
        title: 'שדות חסרים',
        text: 'כל השדות הינם שדות חובה!',
        confirmButtonText: 'הבנתי'
      });
      return;
    }

    try {
      if (editingMeeting) {
        await axios.put(`${API_URL}/meetings/${editingMeeting.meeting_id}`, formData);
        Swal.fire({
          icon: 'success',
          title: 'עודכן בהצלחה!',
          text: 'הפגישה עודכנה בהצלחה',
          confirmButtonText: 'אישור'
        });
      } else {
        await axios.post(`${API_URL}/meetings`, formData);
        Swal.fire({
          icon: 'success',
          title: 'נוסף בהצלחה!',
          text: 'הפגישה נוספה בהצלחה',
          confirmButtonText: 'אישור'
        });
      }
      resetForm();
      if (selectedTeam) {
        fetchMeetings(selectedTeam);
      }
    } catch (error) {
      console.error('Error saving meeting:', error);
      Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: 'שגיאה בשמירת הפגישה',
        confirmButtonText: 'אישור'
      });
    }
  };

  const handleEdit = (meeting) => {
    const formatForInput = (datetime) => {
      const date = new Date(datetime);
      return date.toISOString().slice(0, 16);
    };

    setFormData({
      team_id: meeting.team_id.toString(),
      start_datetime: formatForInput(meeting.start_datetime),
      end_datetime: formatForInput(meeting.end_datetime),
      description: meeting.description,
      room: meeting.room
    });
    setEditingMeeting(meeting);
    setShowForm(true);
  };

  const handleDelete = async (meetingId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'האם אתה בטוח?',
      text: 'לא ניתן לשחזר את הפגישה לאחר המחיקה',
      showCancelButton: true,
      confirmButtonColor: '#ff416c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'כן, מחק!',
      cancelButtonText: 'ביטול'
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/meetings/${meetingId}`);
      Swal.fire({
        icon: 'success',
        title: 'נמחק!',
        text: 'הפגישה נמחקה בהצלחה',
        confirmButtonText: 'אישור'
      });
      if (selectedTeam) {
        fetchMeetings(selectedTeam);
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
      Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: 'שגיאה במחיקת הפגישה',
        confirmButtonText: 'אישור'
      });
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
    <div className="app">
      <header className="header">
        <h1>ניהול פגישות קבוצות פיתוח</h1>
      </header>

      <main className="main-content">
        <section className="controls">
          <div className="select-container">
            <label htmlFor="team-select">בחר קבוצת פיתוח:</label>
            <select
              id="team-select"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
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
            className="btn btn-primary"
            onClick={() => {
              if (showForm && editingMeeting) {
                resetForm();
              } else {
                setShowForm(!showForm);
                setEditingMeeting(null);
                setFormData({
                  team_id: '',
                  start_datetime: '',
                  end_datetime: '',
                  description: '',
                  room: ''
                });
              }
            }}
          >
            {showForm ? 'סגור טופס' : '+ הוסף פגישה חדשה'}
          </button>
        </section>

        {showForm && (
          <section className="form-section">
            <h2>{editingMeeting ? 'עריכת פגישה' : 'הוספת פגישה חדשה'}</h2>
            <form onSubmit={handleSubmit} className="meeting-form">
              <div className="form-group">
                <label htmlFor="team_id">קבוצת פיתוח *</label>
                <select
                  id="team_id"
                  name="team_id"
                  value={formData.team_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- בחר קבוצה --</option>
                  {teams.map(team => (
                    <option key={team.team_id} value={team.team_id}>
                      {team.team_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="start_datetime">תאריך ושעת התחלה *</label>
                <input
                  type="datetime-local"
                  id="start_datetime"
                  name="start_datetime"
                  value={formData.start_datetime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="end_datetime">תאריך ושעת סיום *</label>
                <input
                  type="datetime-local"
                  id="end_datetime"
                  name="end_datetime"
                  value={formData.end_datetime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">תיאור הפגישה *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="room">חדר פגישה *</label>
                <select
                  id="room"
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- בחר חדר --</option>
                  <option value="Blue Room">Blue Room</option>
                  <option value="New York Room">New York Room</option>
                  <option value="Large Board Room">Large Board Room</option>
                  <option value="Small Meeting Room">Small Meeting Room</option>
                </select>
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn btn-success">
                  {editingMeeting ? 'עדכן פגישה' : 'שמור פגישה'}
                </button>
                {editingMeeting && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    ביטול
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        <section className="meetings-section">
          <h2>
            {selectedTeam
              ? `פגישות של ${teams.find(t => t.team_id == selectedTeam)?.team_name || ''}`
              : 'בחר קבוצה לצפייה בפגישות'
            }
          </h2>

          {loading ? (
            <div className="loading">טוען...</div>
          ) : meetings.length > 0 ? (
            <div className="meetings-grid">
              {meetings.map(meeting => (
                <div key={meeting.meeting_id} className="meeting-card">
                  <div className="meeting-header">
                    <span className="room-badge">{meeting.room}</span>
                  </div>
                  <h3 className="meeting-title">{meeting.description}</h3>
                  <div className="meeting-details">
                    <p>
                      <strong>התחלה:</strong> {formatDateTime(meeting.start_datetime)}
                    </p>
                    <p>
                      <strong>סיום:</strong> {formatDateTime(meeting.end_datetime)}
                    </p>
                  </div>
                  <div className="meeting-actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(meeting)}
                    >
                      עריכה
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(meeting.meeting_id)}
                    >
                      מחיקה
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedTeam ? (
            <p className="no-meetings">אין פגישות לקבוצה זו</p>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default App;
