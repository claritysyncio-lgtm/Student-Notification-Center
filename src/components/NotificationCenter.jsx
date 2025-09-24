
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getTasks, updateTaskCompletion } from "../api/notionApi";
import Section from "./Section";
import CompletedSection from "./CompletedSection";
import Dropdown from "./Dropdown";
import TaskItem from "./TaskItem";
import { defaultConfig, generateThemeCSS } from "../config/widgetConfig";

/**
 * NotificationCenter Component
 * Main component that displays and manages task notifications from Notion
 * 
 * @param {Object} config - Configuration object for the notification center
 * @param {Object} config.sections - Section configuration (overdue, dueToday, etc.)
 * @param {Object} config.theme - Theme configuration for styling
 * @param {boolean} config.showTitle - Whether to show the title
 * @param {boolean} config.showFilters - Whether to show filter dropdowns
 * @param {boolean} config.showRefreshButton - Whether to show refresh button
 */
export default function NotificationCenter({ config = defaultConfig }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseFilter, setCourseFilter] = useState(config.defaultCourseFilter || "All Courses");
  const [typeFilter, setTypeFilter] = useState(config.defaultTypeFilter || "All Types");
  const [completedOpen, setCompletedOpen] = useState(false);
  const [dueThisWeekOpen, setDueThisWeekOpen] = useState(true);
  const [showResetButton, setShowResetButton] = useState(false);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Show reset button after 3 seconds for testing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowResetButton(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Load tasks from Notion API
   */
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const taskData = await getTasks();
      setTasks(taskData);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset the app to show the database link page (for testing)
   */
  const handleReset = () => {
    localStorage.removeItem('notionDatabaseId');
    localStorage.removeItem('notionAccessToken');
    localStorage.removeItem('notionWorkspace');
    window.location.reload();
  };

  /**
   * Handle task completion toggle with optimistic updates
   */
  const handleToggleComplete = useCallback(async (taskId, currentStatus) => {
    // Optimistic UI update
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !currentStatus } : task
      )
    );

    try {
      await updateTaskCompletion(taskId, !currentStatus);
      // Refresh data to ensure sync with Notion
      const freshTasks = await getTasks();
      setTasks(freshTasks);
    } catch (err) {
      console.error('Failed to update task completion:', err);
      // Revert optimistic update on error
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, completed: currentStatus } : task
        )
      );
    }
  }, []);

  // Memoized filter options to prevent unnecessary re-renders
  const filterOptions = useMemo(() => {
    const courses = Array.from(new Set(tasks.map(task => task.course).filter(Boolean)));
    const types = Array.from(new Set(tasks.map(task => task.type).filter(Boolean)));
    return { courses, types };
  }, [tasks]);

  // Memoized filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (courseFilter !== "All Courses" && task.course !== courseFilter) return false;
      if (typeFilter !== "All Types" && task.type !== typeFilter) return false;
      return true;
    });
  }, [tasks, courseFilter, typeFilter]);

  // Memoized date calculations - recalculated daily
  const dateRanges = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    
    // Calculate tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);
    
    // Calculate end of week (7 days from now)
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndStr = weekEnd.toISOString().slice(0, 10);
    
    return { 
      today, 
      tomorrow: tomorrowStr, 
      weekEnd: weekEndStr 
    };
  }, []); // Empty dependency array - we want this to recalculate daily

  // Memoized task categorization
  const categorizedTasks = useMemo(() => {
    const { today, tomorrow, weekEnd } = dateRanges;
    
    return {
      overdue: filteredTasks.filter(task => 
        task.due && task.due < today && !task.completed
      ),
      dueToday: filteredTasks.filter(task => 
        !task.completed && (task.due === today || 
        new Date(task.due).toDateString() === new Date().toDateString())
      ),
      dueTomorrow: filteredTasks.filter(task => 
        !task.completed && task.due === tomorrow
      ),
      dueThisWeek: filteredTasks.filter(task => 
        !task.completed && task.due > today && task.due <= weekEnd && task.due !== tomorrow
      ),
      completed: filteredTasks.filter(task => task.completed)
    };
  }, [filteredTasks, dateRanges]);

  /**
   * Handle refresh button click
   */
  const handleRefresh = useCallback(async () => {
    console.log('Refreshing tasks...');
    await loadTasks();
    console.log('Tasks refreshed successfully');
  }, []);

  return (
    <div className="nc-root">
      <style>{generateThemeCSS(config.theme || {})}</style>
      
      <div className="nc-callout">
        {config.showTitle && (
          <div className="nc-callout-title">{config.title}</div>
        )}
        
        <header className="nc-header">
          {config.showFilters && (
            <div className="nc-filters">
              <Dropdown 
                label="All Courses" 
                options={["All Courses", ...filterOptions.courses]} 
                value={courseFilter} 
                onChange={setCourseFilter} 
              />
              <Dropdown 
                label="All Types" 
                options={["All Types", ...filterOptions.types]} 
                value={typeFilter} 
                onChange={setTypeFilter} 
              />
            </div>
          )}
          
          {config.showRefreshButton && (
            <button 
              className="refresh-button" 
              onClick={handleRefresh} 
              title="Refresh tasks"
              disabled={loading}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={loading ? 'spinning' : ''}
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M3 21v-5h5"/>
              </svg>
            </button>
          )}
          {showResetButton && (
            <button
              onClick={handleReset}
              className="reset-button"
              title="Reset to test database link page"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                zIndex: 1000
              }}
            >
              Reset
            </button>
          )}
        </header>
      </div>

      {loading && (
        <div className="nc-loading">
          Loading tasks from Notion...
        </div>
      )}

      {error && (
        <div className="nc-error">
          <h3>Error Loading Tasks</h3>
          <p>
            There was an issue fetching tasks from Notion. This is often a CORS issue 
            or a problem with your API token or database permissions.
          </p>
          <details>
            <summary>Error Details</summary>
            <pre>{error.message}</pre>
          </details>
        </div>
      )}

      <main className="nc-main">
        {config.sections?.overdue?.enabled && categorizedTasks.overdue.length > 0 && (
          <Section 
            title={config.sections.overdue.title || 'Overdue'} 
            tasks={categorizedTasks.overdue} 
            onToggleComplete={handleToggleComplete} 
            className="overdue" 
            showCountdown={config.sections.overdue.showCountdown} 
          />
        )}
        
        {config.sections?.dueToday?.enabled && (
          <Section 
            title={config.sections.dueToday.title || 'Due Today'} 
            tasks={categorizedTasks.dueToday} 
            onToggleComplete={handleToggleComplete} 
            showCountdown={config.sections.dueToday.showCountdown}
          />
        )}
        
        {config.sections?.dueTomorrow?.enabled && (
          <Section 
            title={config.sections.dueTomorrow.title || 'Due Tomorrow'} 
            tasks={categorizedTasks.dueTomorrow} 
            onToggleComplete={handleToggleComplete} 
            showCountdown={config.sections.dueTomorrow.showCountdown}
          />
        )}
        
        {config.sections?.dueThisWeek?.enabled && (
          config.sections.dueThisWeek.collapsible ? (
            <CompletedSection
              title={config.sections.dueThisWeek.title || 'Due This Week'}
              tasks={categorizedTasks.dueThisWeek}
              open={dueThisWeekOpen}
              onToggle={() => setDueThisWeekOpen(prev => !prev)}
              onToggleComplete={handleToggleComplete}
              collapsible={config.sections.dueThisWeek.collapsible}
            />
          ) : (
            <Section 
              title={config.sections.dueThisWeek.title || 'Due This Week'} 
              tasks={categorizedTasks.dueThisWeek} 
              onToggleComplete={handleToggleComplete} 
              showCountdown={config.sections.dueThisWeek.showCountdown} 
            />
          )
        )}
        
        {config.sections?.completed?.enabled && (
          <CompletedSection
            title={config.sections.completed.title || 'Completed'}
            tasks={categorizedTasks.completed}
            open={completedOpen}
            onToggle={() => setCompletedOpen(prev => !prev)}
            onToggleComplete={handleToggleComplete}
            collapsible={config.sections.completed.collapsible}
          />
        )}
      </main>
    </div>
  );
}
