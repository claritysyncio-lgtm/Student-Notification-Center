
import React, { useCallback } from "react";
import { getTypeColors } from "../styles/colors";

/**
 * TaskItem Component
 * 
 * Displays individual task information with completion toggle functionality.
 * Handles task metadata display including due dates, course info, and type styling.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.task - Task object containing all task data
 * @param {string} props.task.id - Unique task identifier
 * @param {string} props.task.name - Task name/title
 * @param {string} props.task.course - Course name
 * @param {string} props.task.due - Due date in ISO format
 * @param {number} props.task.grade - Grade percentage
 * @param {string} props.task.type - Task type (Assignment, Quiz, etc.)
 * @param {boolean} props.task.completed - Completion status
 * @param {string} props.task.typeColor - Notion color for type styling
 * @param {Function} props.onToggleComplete - Callback for completion toggle
 * @param {boolean} props.showCountdown - Whether to display countdown timer
 */
export default function TaskItem({ 
  task, 
  onToggleComplete, 
  showCountdown = false 
}) {
  const color = getTypeColors(task.type, task.typeColor);

  /**
   * Handle completion toggle with proper error handling
   */
  const handleToggleComplete = useCallback(() => {
    try {
      onToggleComplete(task.id, task.completed);
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
    }
  }, [task.id, task.completed, onToggleComplete]);

  /**
   * Format due date for display with relative time indicators
   */
  const formatDueDate = (dueDate) => {
    if (!dueDate) return '—';
    
    try {
      const date = new Date(dueDate);
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Add relative indicators for better UX
      let relativeIndicator = '';
      if (diffDays === 0) {
        relativeIndicator = ' (Today)';
      } else if (diffDays === 1) {
        relativeIndicator = ' (Tomorrow)';
      } else if (diffDays === -1) {
        relativeIndicator = ' (Yesterday)';
      } else if (diffDays < 0) {
        relativeIndicator = ` (${Math.abs(diffDays)} days ago)`;
      } else if (diffDays <= 7) {
        relativeIndicator = ` (in ${diffDays} days)`;
      }
      
      return new Date(dueDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      }) + relativeIndicator;
    } catch (error) {
      console.warn('Invalid date format:', dueDate);
      return 'Invalid Date';
    }
  };

  /**
   * Format grade percentage for display
   */
  const formatGrade = (grade) => {
    if (!grade || grade <= 0) return '';
    return `Worth ${grade}%`;
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-left">
        <button 
          className={`circle ${task.completed ? 'checked' : ''}`} 
          onClick={handleToggleComplete}
          aria-label={`Mark task "${task.name}" as ${task.completed ? 'incomplete' : 'complete'}`}
          type="button"
        >
          {task.completed ? '✓' : ''}
        </button>
        
        <div className="task-meta">
          <div className="task-name" title={task.name}>
            {task.name || 'Untitled Task'}
          </div>
          <div className="course" title={task.course}>
            {task.course || 'No Course'}
          </div>
          <div className="task-sub">
            <span className="due-label">
              Due: <strong>{formatDueDate(task.due)}</strong>
              {showCountdown && task.countdown && (
                <span className="countdown"> • {task.countdown}</span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="task-right">
        <div className="task-properties-stack">
          <div className="grade-line">
            {formatGrade(task.grade)}
          </div>
          <div 
            className="type-pill" 
            style={{
              backgroundColor: color.bg, 
              color: color.text
            }}
            title={`Task type: ${task.type}`}
          >
            {task.type || 'Task'}
          </div>
        </div>
      </div>
    </div>
  );
}
