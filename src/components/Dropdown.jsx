
import React from "react";

export default function Dropdown({ label, options = [], value, onChange }) {
  return (
    <div className="dropdown">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
