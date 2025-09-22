
import React from "react";
import { getTypeColors } from "../styles/colors";

export default function TaskItem({ task, onToggleComplete, showCountdown = false }) {
  const color = getTypeColors(task.type, task.typeColor);

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-left">
        <button className={`circle ${task.completed ? 'checked' : ''}`} onClick={() => onToggleComplete(task.id, task.completed)} aria-label="toggle complete">
          {task.completed ? '✓' : ''}
        </button>
        <div className="task-meta">
          <div className="task-name">{task.name}</div>
          <div className="task-sub">
            <span className="due-label">
              Due: <strong>{task.due ? new Date(task.due).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : '—'}</strong>
              {showCountdown && task.countdown && (
                <span className="countdown"> • {task.countdown}</span>
              )}
            </span>
            <div className="course">{task.course}</div>
          </div>
        </div>
      </div>

      <div className="task-right">
        <div className="task-properties-stack">
          <div className="grade-line">{task.grade ? `Worth ${task.grade}%` : ''}</div>
          <div className="type-pill" style={{backgroundColor: color.bg, color: color.text}}>{task.type}</div>
        </div>
      </div>
    </div>
  );
}
