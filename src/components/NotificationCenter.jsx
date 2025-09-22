
import React, { useEffect, useState } from "react";
import { getTasks, updateTaskCompletion } from "../api/notionApi";
import Section from "./Section";
import CompletedSection from "./CompletedSection";
import Dropdown from "./Dropdown";
import TaskItem from "./TaskItem";
import { typeColors } from "../styles/colors";
import { defaultConfig, generateThemeCSS } from "../config/widgetConfig";

export default function NotificationCenter({ config = defaultConfig }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseFilter, setCourseFilter] = useState(config.defaultCourseFilter || "All Courses");
  const [typeFilter, setTypeFilter] = useState(config.defaultTypeFilter || "All Types");
  const [completedOpen, setCompletedOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getTasks()
      .then(setTasks)
      .catch(err => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // re-filter on env change; simple approach
  }, [tasks]);

  const handleToggleComplete = async (taskId, current) => {
    // optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !current } : t))
    );
    await updateTaskCompletion(taskId, !current);
    // re-fetch to ensure sync (optional)
    const fresh = await getTasks();
    setTasks(fresh);
  };

  const courses = Array.from(new Set(tasks.map((t) => t.course).filter(Boolean)));
  const types = Array.from(new Set(tasks.map((t) => t.type).filter(Boolean)));

  const filtered = tasks.filter((t) => {
    if (courseFilter !== "All Courses" && t.course !== courseFilter) return false;
    if (typeFilter !== "All Types" && t.type !== typeFilter) return false;
    return true;
  });

  const today = new Date().toISOString().slice(0,10);
  const tomorrow = (() => {
    const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().slice(0,10);
  })();
  const weekEnd = (() => {
    const d = new Date(); d.setDate(d.getDate()+7); return d.toISOString().slice(0,10);
  })();

  const overdueTasks = filtered.filter(t => t.due && t.due < today && !t.completed);

  const dueToday = filtered.filter(t => t.due === today && !t.completed || (new Date(t.due).toDateString() === new Date().toDateString() && !t.completed));
  const dueTomorrow = filtered.filter(t => !t.completed && t.due === tomorrow);
  const dueWeek = filtered.filter(t => !t.completed && t.due > today && t.due <= weekEnd && t.due !== tomorrow);

  const completed = filtered.filter(t => t.completed);

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
              <Dropdown label="All Courses" options={["All Courses", ...courses]} value={courseFilter} onChange={setCourseFilter} />
              <Dropdown label="All Types" options={["All Types", ...types]} value={typeFilter} onChange={setTypeFilter} />
            </div>
          )}
          {config.showRefreshButton && (
            <button className="refresh-button" onClick={() => window.location.reload()} title="Refresh tasks">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M3 21v-5h5"/>
              </svg>
            </button>
          )}
        </header>
      </div>

      {loading && (
        <div className="nc-loading">Loading tasks from Notion...</div>
      )}

      {error && (
        <div className="nc-error">
          <h3>Error Loading Tasks</h3>
          <p>There was an issue fetching tasks from Notion. This is often a CORS issue or a problem with your API token or database permissions.</p>
          <pre>
            {error.message}
          </pre>
        </div>
      )}

      <main className="nc-main">
        {config.sections?.overdue?.enabled && overdueTasks.length > 0 && (
          <Section 
            title={config.sections?.overdue?.title || 'Overdue'} 
            tasks={overdueTasks} 
            onToggleComplete={handleToggleComplete} 
            className="overdue" 
            showCountdown={config.sections?.overdue?.showCountdown} 
          />
        )}
        {config.sections?.dueToday?.enabled && (
          <Section 
            title={config.sections?.dueToday?.title || 'Due Today'} 
            tasks={dueToday} 
            onToggleComplete={handleToggleComplete} 
            showCountdown={config.sections?.dueToday?.showCountdown}
          />
        )}
        {config.sections?.dueTomorrow?.enabled && (
          <Section 
            title={config.sections?.dueTomorrow?.title || 'Due Tomorrow'} 
            tasks={dueTomorrow} 
            onToggleComplete={handleToggleComplete} 
            showCountdown={config.sections?.dueTomorrow?.showCountdown}
          />
        )}
        {config.sections?.dueThisWeek?.enabled && (
          <Section 
            title={config.sections?.dueThisWeek?.title || 'Due This Week'} 
            tasks={dueWeek} 
            onToggleComplete={handleToggleComplete} 
            showCountdown={config.sections?.dueThisWeek?.showCountdown} 
          />
        )}
        {config.sections?.completed?.enabled && (
          <CompletedSection
            title={config.sections?.completed?.title || 'Completed'}
            tasks={completed}
            open={completedOpen}
            onToggle={() => setCompletedOpen(v => !v)}
            onToggleComplete={handleToggleComplete}
            collapsible={config.sections?.completed?.collapsible}
          />
        )}
      </main>
    </div>
  );
}
