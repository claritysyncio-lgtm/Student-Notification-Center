import React, { useState, useEffect, useMemo } from 'react';
import Section from '../components/Section';
import CompletedSection from '../components/CompletedSection';
import Dropdown from '../components/Dropdown';
import { getTasks, updateTaskCompletion } from './notionApi';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [typeFilter, setTypeFilter] = useState("All Types");

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleToggleComplete = async (taskId, completed) => {
    const originalTasks = tasks;
    setTasks(tasks.map(t => (t.id === taskId ? { ...t, completed } : t)));
    try {
      await updateTaskCompletion(taskId, completed);
    } catch (error) {
      console.error('Failed to update task', error);
      setError(error);
      setTasks(originalTasks); // revert
    }
  };

  const { overdueTasks, dueToday, dueTomorrow, dueThisWeek, completedTasks, courses, types } = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const tomorrowStr = (() => {
      const d = new Date(); 
      d.setDate(d.getDate() + 1); 
      return d.toISOString().slice(0, 10);
    })();
    const weekEndStr = (() => {
      const d = new Date(); 
      d.setDate(d.getDate() + 7); 
      return d.toISOString().slice(0, 10);
    })();

    // Filter tasks based on selected filters
    const filtered = tasks.filter((t) => {
      if (courseFilter !== "All Courses" && t.course !== courseFilter) return false;
      if (typeFilter !== "All Types" && t.type !== typeFilter) return false;
      return true;
    });

    const overdue = [];
    const today = [];
    const tomorrow = [];
    const thisWeek = [];
    const completed = [];

    for (const task of filtered) {
      if (task.completed) {
        completed.push(task);
        continue;
      }
      if (task.due && task.due < todayStr) {
        overdue.push(task);
      } else if (task.due === todayStr) {
        today.push(task);
      } else if (task.due === tomorrowStr) {
        tomorrow.push(task);
      } else if (task.due && task.due > todayStr && task.due <= weekEndStr) {
        thisWeek.push(task);
      }
    }

    // Get unique courses and types for filter options
    const courses = Array.from(new Set(tasks.map((t) => t.course).filter(Boolean)));
    const types = Array.from(new Set(tasks.map((t) => t.type).filter(Boolean)));

    return { 
      overdueTasks: overdue, 
      dueToday: today, 
      dueTomorrow: tomorrow, 
      dueThisWeek: thisWeek, 
      completedTasks: completed,
      courses,
      types
    };
  }, [tasks, courseFilter, typeFilter]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Notification Center</h1>
        <div className="nc-filters">
          <Dropdown label="All Courses" options={["All Courses", ...courses]} value={courseFilter} onChange={setCourseFilter} />
          <Dropdown label="All Types" options={["All Types", ...types]} value={typeFilter} onChange={setTypeFilter} />
        </div>
        {loading && <div className="loading-indicator">Loading tasks...</div>}
        {error && <div className="error-indicator">Error: {error.message}</div>}
      </header>
      <main>
        <Section title="Overdue" tasks={overdueTasks} onToggleComplete={handleToggleComplete} className="overdue" />
        <Section title="Due Today" tasks={dueToday} onToggleComplete={handleToggleComplete} />
        <Section title="Due Tomorrow" tasks={dueTomorrow} onToggleComplete={handleToggleComplete} />
        <Section title="Due This Week" tasks={dueThisWeek} onToggleComplete={handleToggleComplete} />
        <CompletedSection title="Completed" tasks={completedTasks} open={completedOpen} onToggle={() => setCompletedOpen(!completedOpen)} onToggleComplete={handleToggleComplete} />
      </main>
    </div>
  );
}