import React, { useState } from "react";
import "./Settings.css";

const AGE_OPTIONS = [
  "Under 18",
  "18-25",
  "26-35",
  "36-45",
  "46-60",
  "60+"
];
const WEIGHT_OPTIONS = [
  "Under 100 lbs (45 kg)",
  "100-130 lbs (45-59 kg)",
  "131-160 lbs (60-72 kg)",
  "161-200 lbs (73-90 kg)",
  "201-250 lbs (91-113 kg)",
  "251+ lbs (114+ kg)"
];
const GENDER_OPTIONS = ["Male", "Female", "Other"];
const SPECIAL_NEEDS_OPTIONS = [
  "Diabetic",
  "Pregnant",
  "Breastfeeding",
  "Heart Condition",
  "Kidney Condition",
  "Other"
];

function Settings({ userSettings, setUserSettings }) {
  const [specialNeedsInput, setSpecialNeedsInput] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "specialNeeds") {
      let updated = userSettings.specialNeeds || [];
      if (checked) {
        updated = [...updated, value];
      } else {
        updated = updated.filter((v) => v !== value);
      }
      setUserSettings({ ...userSettings, specialNeeds: updated });
    } else if (name === "specialNeedsOther") {
      setSpecialNeedsInput(value);
      setUserSettings({ ...userSettings, specialNeedsOther: value });
    } else {
      setUserSettings({ ...userSettings, [name]: value });
    }
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <form className="settings-form">
        <label>
          Age Range:
          <select name="age" value={userSettings.age || ""} onChange={handleChange}>
            <option value="">Select...</option>
            {AGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
        <label>
          Body Weight Range:
          <select name="weight" value={userSettings.weight || ""} onChange={handleChange}>
            <option value="">Select...</option>
            {WEIGHT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend>Gender:</legend>
          {GENDER_OPTIONS.map((opt) => (
            <label key={opt} style={{ marginRight: 16 }}>
              <input
                type="radio"
                name="gender"
                value={opt}
                checked={userSettings.gender === opt}
                onChange={handleChange}
              />
              {opt}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Special Needs (Medical Conditions):</legend>
          {SPECIAL_NEEDS_OPTIONS.map((opt) => (
            opt !== "Other" ? (
              <label key={opt} style={{ marginRight: 12 }}>
                <input
                  type="checkbox"
                  name="specialNeeds"
                  value={opt}
                  checked={userSettings.specialNeeds?.includes(opt) || false}
                  onChange={handleChange}
                />
                {opt}
              </label>
            ) : null
          ))}
          <label style={{ display: 'block', marginTop: 8 }}>
            Other:
            <input
              type="text"
              name="specialNeedsOther"
              value={specialNeedsInput}
              placeholder="Specify other needs"
              onChange={handleChange}
              style={{ marginLeft: 8, padding: '4px 8px', borderRadius: 5, border: '1px solid #bbb' }}
            />
          </label>
        </fieldset>
      </form>
    </div>
  );
}

export default Settings;
