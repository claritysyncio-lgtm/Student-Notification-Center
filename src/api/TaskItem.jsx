import React from 'react';
import { typeColors } from '../styles/colors';

export default function TaskItem({ task, onToggleComplete }) {
  const { id, name, due, course, grade, type, completed } = task;

  const typeStyle = typeColors[type] || { bg: '#eee', text: '#333' };

  const formattedDate = due ? new Date(due).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';

  return (
    <div className={`task-item ${completed ? 'completed' : ''}`}>
      <div className="task-checkbox">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggleComplete(id, !completed)}
          id={`task-${id}`}
        />
        <label htmlFor={`task-${id}`}></label>
      </div>
      <div className="task-details">
        <span className="task-name">{name}</span>
        <div className="task-meta">
          {course && <span className="task-property">{course}</span>}
          {type && (
            <span className="task-property" style={{ backgroundColor: typeStyle.bg, color: typeStyle.text }}>
              {type}
            </span>
          )}
          {formattedDate && <span className="task-property">{formattedDate}</span>}
        </div>
      </div>
      {grade != null && (
        <div className="task-grade-stack">
          <span className="task-grade-value">{grade}%</span>
          <span className="task-grade-label">of grade</span>
        </div>
      )}
    </div>
  );
}