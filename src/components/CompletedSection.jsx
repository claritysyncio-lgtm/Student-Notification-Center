
import React, { useCallback } from "react";
import TaskItem from "./TaskItem";

/**
 * CompletedSection Component
 * 
 * A collapsible section for displaying completed tasks.
 * Provides toggle functionality and handles empty states gracefully.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {Array} props.tasks - Array of completed task objects
 * @param {boolean} props.open - Whether the section is expanded
 * @param {Function} props.onToggle - Callback to toggle section visibility
 * @param {Function} props.onToggleComplete - Callback for task completion toggle
 * @param {boolean} props.collapsible - Whether the section can be collapsed
 */
export default function CompletedSection({ 
  title, 
  tasks = [], 
  open, 
  onToggle, 
  onToggleComplete,
  collapsible = true
}) {
  /**
   * Handle section toggle with proper error handling
   */
  const handleToggle = useCallback(() => {
    if (!collapsible) return;
    
    try {
      onToggle();
    } catch (error) {
      console.error('Error toggling completed section:', error);
    }
  }, [onToggle, collapsible]);

  // Validate tasks array
  const validTasks = Array.isArray(tasks) ? tasks : [];
  
  return (
    <section className="nc-section nc-completed">
      <div 
        className={`nc-section-title completed-toggle ${collapsible ? 'clickable' : ''}`}
        onClick={handleToggle}
        role={collapsible ? 'button' : undefined}
        tabIndex={collapsible ? 0 : undefined}
        aria-expanded={collapsible ? open : undefined}
        aria-label={collapsible ? `Toggle ${title} section` : undefined}
      >
        <span>{title}</span>
        {validTasks.length > 0 && (
          <span className="task-count">({validTasks.length})</span>
        )}
        {collapsible && (
          <span className="toggle-icon" aria-hidden="true">
            {open ? '▾' : '▸'}
          </span>
        )}
      </div>
      
      {(!collapsible || open) && (
        <div className="nc-section-body">
          {validTasks.length === 0 ? (
            <div className="nc-empty">
              No completed tasks yet
            </div>
          ) : (
            validTasks.map(task => {
              // Validate task object before rendering
              if (!task || !task.id) {
                console.warn('Invalid completed task object:', task);
                return null;
              }
              
              return (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggleComplete={onToggleComplete} 
                />
              );
            }).filter(Boolean) // Remove null entries
          )}
        </div>
      )}
    </section>
  );
}
