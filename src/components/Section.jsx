
import React from "react";
import TaskItem from "./TaskItem";

/**
 * Section Component
 * 
 * Renders a section of tasks with a title and optional countdown display.
 * Handles empty states and provides consistent task list rendering.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {Array} props.tasks - Array of task objects
 * @param {Function} props.onToggleComplete - Callback for task completion toggle
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showCountdown - Whether to show countdown timers
 */
export default function Section({ 
  title, 
  tasks = [], 
  onToggleComplete, 
  className = "", 
  showCountdown = false 
}) {
  // Validate tasks array
  const validTasks = Array.isArray(tasks) ? tasks : [];
  
  return (
    <section className={`nc-section ${className}`}>
      <div className="nc-section-title">
        {title}
        {validTasks.length > 0 && (
          <span className="task-count">({validTasks.length})</span>
        )}
      </div>
      
      <div className="nc-section-body">
        {validTasks.length === 0 ? (
          <div className="nc-empty">
            No tasks in this section
          </div>
        ) : (
          validTasks.map(task => {
            // Validate task object before rendering
            if (!task || !task.id) {
              console.warn('Invalid task object:', task);
              return null;
            }
            
            return (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggleComplete={onToggleComplete} 
                showCountdown={showCountdown} 
              />
            );
          }).filter(Boolean) // Remove null entries
        )}
      </div>
    </section>
  );
}
