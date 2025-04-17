import React, { useState, useEffect, useRef } from "react";
import Settings from "./Settings";
import Content from "./Content";
import "./App.css";

const FASTING_OPTIONS = [
  { label: "16 hours", value: 16 * 60 * 60 },
  { label: "24 hours", value: 24 * 60 * 60 },
  { label: "36 hours", value: 36 * 60 * 60 },
  { label: "72 hours", value: 72 * 60 * 60 },
];
const EATING_WINDOW_DEFAULT = 8 * 60 * 60; // 8 hours in seconds

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function getReminderInterval(duration) {
  // duration in seconds
  if (duration === 16 * 60 * 60) return 2 * 60 * 60;
  if (duration === 24 * 60 * 60) return 3 * 60 * 60;
  if (duration === 36 * 60 * 60) return 4 * 60 * 60;
  if (duration === 72 * 60 * 60) return 6 * 60 * 60;
  return 2 * 60 * 60; // default 2h
}

function App() {
  const [page, setPage] = useState("home");
  const [userSettings, setUserSettings] = useState({});
  const [isFasting, setIsFasting] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(FASTING_OPTIONS[0].value);
  const [timeLeft, setTimeLeft] = useState(FASTING_OPTIONS[0].value);
  const [status, setStatus] = useState("Not Fasting");
  // Autophagy constants
  const AUTOPHAGY_THRESHOLD = 16 * 60 * 60; // 16 hours in seconds
  const [autophagyState, setAutophagyState] = useState("not_started"); // 'not_started', 'in_progress', 'ended'

  const timerRef = useRef(null);
  const reminderRef = useRef(null);
  const [showReminder, setShowReminder] = useState(false);
  const [progress, setProgress] = useState(0);
  const [milestone, setMilestone] = useState(null);
  const [milestonesReached, setMilestonesReached] = useState([]);

  // Timer effect
  useEffect(() => {
    if (isFasting) {
      setStatus("Fasting");
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            clearInterval(reminderRef.current);
            setStatus("Eating Window");
            setIsFasting(false);
            setProgress(0);
            setMilestone(null);
            setMilestonesReached([]);
            return EATING_WINDOW_DEFAULT;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      clearInterval(reminderRef.current);
      setProgress(0);
      setMilestone(null);
      setMilestonesReached([]);
    }
    return () => {
      clearInterval(timerRef.current);
      clearInterval(reminderRef.current);
    };
  }, [isFasting]);

  // Progress & milestones
  useEffect(() => {
    if (!isFasting) return;
    const pct = 1 - timeLeft / selectedDuration;
    setProgress(Math.max(0, Math.min(1, pct)));
    const milestones = [0.25, 0.5, 0.75];
    const hoursLeft = timeLeft / 3600;
    let milestoneMsg = null;
    // 1 hour remaining milestone
    if (
      !milestonesReached.includes("1h") &&
      timeLeft <= 3600 &&
      timeLeft > 3590 // avoid multiple triggers
    ) {
      milestoneMsg = {
        key: "1h",
        msg: "Only 1 hour left! You're almost there. Start preparing for a gentle fast break."
      };
    } else {
      for (let i = 0; i < milestones.length; i++) {
        const m = milestones[i];
        if (
          !milestonesReached.includes(m) &&
          pct >= m &&
          pct < m + 0.01 // avoid multiple triggers
        ) {
          let msg =
            m === 0.25
              ? "Great job! You've completed 25% of your fast. Stay hydrated and keep going!"
              : m === 0.5
              ? "Halfway there! Celebrate your progress and keep focusing on your goal."
              : "75% done! The finish line is in sight. Stay strong!";
          milestoneMsg = { key: m, msg };
          break;
        }
      }
    }
    if (milestoneMsg) {
      setMilestone(milestoneMsg);
      setMilestonesReached((prev) => [...prev, milestoneMsg.key]);
    }
    // eslint-disable-next-line
  }, [timeLeft, isFasting, selectedDuration]);

  // Water reminder effect
  useEffect(() => {
    if (isFasting) {
      // Request notification permission if needed
      if (window.Notification && Notification.permission === "default") {
        Notification.requestPermission();
      }
      // Set up reminder interval
      const interval = getReminderInterval(selectedDuration);
      let elapsed = 0;
      reminderRef.current = setInterval(() => {
        elapsed += interval;
        // Only remind if enough time left
        if (timeLeft > interval) {
          // Try to show system notification
          if (window.Notification && Notification.permission === "granted") {
            new Notification("Fasting Coach - Hydration Reminder", {
              body: "Time to drink water and stay hydrated!",
              icon: "favicon.ico"
            });
          } else {
            setShowReminder(true);
          }
        }
      }, interval * 1000);
    } else {
      clearInterval(reminderRef.current);
      setShowReminder(false);
    }
    return () => {
      clearInterval(reminderRef.current);
    };
    // eslint-disable-next-line
  }, [isFasting, selectedDuration]);

  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value, 10);
    setSelectedDuration(newDuration);
    if (!isFasting) {
      setTimeLeft(newDuration);
    }
  };

  const handleStartStop = () => {
    if (isFasting) {
      setIsFasting(false);
      setStatus("Not Fasting");
    } else {
      setIsFasting(true);
      setTimeLeft(selectedDuration);
      setStatus("Fasting");
    }
  };

  // Autophagy timer calculation
  let autophagyCountdown = null;
  let autophagyLabel = "";
  if (isFasting) {
    if (timeLeft > selectedDuration - AUTOPHAGY_THRESHOLD) {
      // Not reached autophagy
      const secondsToAutophagy = timeLeft - (selectedDuration - AUTOPHAGY_THRESHOLD);
      autophagyCountdown = formatTime(secondsToAutophagy);
      autophagyLabel = "Time until Autophagy";
    } else {
      // In autophagy
      const secondsInAutophagy = selectedDuration - AUTOPHAGY_THRESHOLD - timeLeft;
      autophagyCountdown = formatTime(secondsInAutophagy);
      autophagyLabel = "Time in Autophagy Healing";
    }
  }

  return (
    <div className="app-container">
      <h1 className="main-title" onClick={() => setPage("home")}>Fasting Coach</h1>
      <nav className="nav-bar" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}></nav>

      <main className="main-content">
        {page === "home" ? (
          <div>
            <section className="status-section">
              <h2>Status: <span className={isFasting ? "fasting" : status === "Eating Window" ? "eating" : "not-fasting"}>{status}</span></h2>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="fasting-duration" style={{ fontWeight: 500, marginRight: 8 }}>
                  Fasting Duration:
                </label>
                <select
                  id="fasting-duration"
                  value={selectedDuration}
                  onChange={handleDurationChange}
                  disabled={isFasting}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
                >
                  {FASTING_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="recommendation-badges">
                  <div className="recommendation-badge water">
                    <span className="badge-icon" role="img" aria-label="Water">💧</span>
                    <span className="badge-title">Water</span>
                    <span className="badge-subtext">(stay hydrated!)</span>
                  </div>
                  <div className="recommendation-badge tea">
                    <span className="badge-icon" role="img" aria-label="Herbal tea">🍵</span>
                    <span className="badge-title">Herbal tea</span>
                    <span className="badge-subtext">(unsweetened)</span>
                  </div>
                </div>
                <button
                  className="start-stop-btn"
                  onClick={handleStartStop}
                  style={{
                    margin: "18px auto 0 auto",
                    display: "block",
                    padding: "12px 36px",
                    fontSize: "1.2rem"
                  }}
                >
                  {isFasting ? "Stop Fast" : "Start Fast"}
                </button>
              </div>
            </section>

            <section className="progress-section">
              <h3>Main Fasting Timer</h3>
              <progress value={progress} max="1" style={{ width: '100%', height: '20px', borderRadius: '10px', border: 'none' }} />
              <p className="timer">{formatTime(timeLeft)}</p>
              <p style={{ fontSize: '1.1rem', color: '#888', marginTop: -12 }}>Time Left</p>
            </section>
            {isFasting && (
              <section className="autophagy-section">
                <h3 style={{ marginBottom: 8 }}>
                  {autophagyLabel === 'Time in Autophagy Healing' ? (
                    <span style={{ color: '#fff', background: '#43a047', borderRadius: 8, padding: '2px 10px', fontWeight: 700 }}>
                      Autophagy Achieved: Healing Time
                    </span>
                  ) : (
                    autophagyLabel
                  )}
                </h3>
                <progress
                  value={autophagyLabel === 'Time in Autophagy Healing'
                    ? (selectedDuration - AUTOPHAGY_THRESHOLD - timeLeft) / (selectedDuration - AUTOPHAGY_THRESHOLD)
                    : (AUTOPHAGY_THRESHOLD - (selectedDuration - timeLeft)) / AUTOPHAGY_THRESHOLD}
                  max="1"
                  style={{
                    width: '100%',
                    height: '20px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: autophagyLabel === 'Time in Autophagy Healing' ? '#b9f6ca' : '#fffde7'
                  }}
                />
                <p className="timer" style={{ color: autophagyLabel === 'Time in Autophagy Healing' ? '#43a047' : '#2e7d32' }}>
                  {autophagyCountdown ? autophagyCountdown : 'N/A'}
                </p>
                <p style={{ fontSize: '1.1rem', color: '#888', marginTop: -12 }}>{autophagyLabel}</p>
              </section>
            )}
            {showReminder && (
              <div>
                <p>Time to drink water and stay hydrated!</p>
                <button style={{marginTop: 8, padding: '6px 20px', borderRadius: 6, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 500, cursor: 'pointer'}} onClick={() => setShowReminder(false)}>Got it!</button>
              </div>
            )}
          </div>
        ) : page === "settings" ? (
          <Settings userSettings={userSettings} setUserSettings={setUserSettings} />
        ) : (
          <Content />
        )}
      </main>
      {milestone && (
        <div className="popup-milestone" style={{
          position: 'fixed', left: 0, right: 0, top: 60, margin: 'auto', maxWidth: 340, background: '#fffde7', color: '#d97706', borderRadius: 14, padding: 28, textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.13)', zIndex: 1100, border: '2px solid #ffd54f'
        }}>
          <h4>Milestone!</h4>
          <p>{milestone.msg}</p>
          <button style={{marginTop: 8, padding: '6px 20px', borderRadius: 6, border: 'none', background: '#ffd54f', color: '#d97706', fontWeight: 500, cursor: 'pointer'}} onClick={() => setMilestone(null)}>Got it!</button>
        </div>
      )}
      <footer className="footer-bar">
        <button
          className="nav-content-btn"
          onClick={() => setPage(page === "content" ? "home" : "content")}
        >
          {page === "content" ? "Home" : "Content"}
        </button>
        <button
          className="nav-settings-btn"
          onClick={() => setPage(page === "settings" ? "home" : "settings")}
        >
          {page === "settings" ? "Home" : "Settings"}
        </button>
      </footer>
    </div>
  );
}

export default App;
