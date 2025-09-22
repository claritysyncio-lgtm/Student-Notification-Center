
import React from "react";
import TaskItem from "./TaskItem";

export default function Section({ title, tasks = [], onToggleComplete, className = "", showCountdown = false }) {
  return (
    <section className={`nc-section ${className}`}>
      <div className="nc-section-title">{title}</div>
      <div className="nc-section-body">
        {tasks.length === 0 ? <div className="nc-empty">No tasks</div> : tasks.map(t => (
          <TaskItem key={t.id} task={t} onToggleComplete={onToggleComplete} showCountdown={showCountdown} />
        ))}
      </div>
    </section>
  );
}
