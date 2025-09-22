
import React from "react";
import TaskItem from "./TaskItem";

export default function CompletedSection({ title, tasks = [], open, onToggle, onToggleComplete }) {
  return (
    <section className="nc-section nc-completed">
      <div className="nc-section-title completed-toggle" onClick={onToggle}>
        <span>{title}</span>
        <span>{open ? '▾' : '▾'}</span>
      </div>
      {open && (
        <div className="nc-section-body">
          {tasks.length === 0 ? <div className="nc-empty">No completed tasks</div> : tasks.map(t => (
            <TaskItem key={t.id} task={t} onToggleComplete={onToggleComplete} />
          ))}
        </div>
      )}
    </section>
  );
}
