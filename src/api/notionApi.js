// Browser-safe API shim
// NOTE: @notionhq/client is server-only and cannot run in the browser with Vite 5.
// This module calls a backend endpoint instead. If none is configured, the UI
// will display a clear error message via NotificationCenter. In dev, we provide
// a mock fallback so the UI can render without a backend.

const API_BASE = "/api"; // configure a proxy or backend to serve these routes
const IS_DEV = typeof location !== "undefined" && location.hostname === "localhost";

const mockTasks = [
  // OVERDUE TASKS
  {
    id: "t1",
    name: "Read Chapter 3",
    due: (() => { const d = new Date(); d.setDate(d.getDate()-2); return d.toISOString().slice(0,10); })(), // 2 days ago
    course: "Biology 101",
    grade: 10,
    type: "Assignment",
    completed: false,
  },
  {
    id: "t2",
    name: "Lab Report #3",
    due: (() => { const d = new Date(); d.setDate(d.getDate()-1); return d.toISOString().slice(0,10); })(), // yesterday
    course: "Chemistry 201",
    grade: 15,
    type: "Lab",
    completed: false,
  },
  {
    id: "t3",
    name: "Math Problem Set 4",
    due: (() => { const d = new Date(); d.setDate(d.getDate()-3); return d.toISOString().slice(0,10); })(), // 3 days ago
    course: "Calculus 101",
    grade: 8,
    type: "Homework",
    completed: false,
  },
  {
    id: "t4",
    name: "History Reading Response",
    due: (() => { const d = new Date(); d.setDate(d.getDate()-5); return d.toISOString().slice(0,10); })(), // 5 days ago
    course: "History 110",
    grade: 12,
    type: "Assignment",
    completed: false,
  },
  
  // DUE TODAY TASKS
  {
    id: "t5",
    name: "Chemistry Quiz",
    due: (() => { const d = new Date(); return d.toISOString().slice(0,10); })(), // today
    course: "Chemistry 201",
    grade: 8,
    type: "Quiz",
    completed: false,
  },
  {
    id: "t6",
    name: "Physics Lab Report",
    due: (() => { const d = new Date(); return d.toISOString().slice(0,10); })(), // today
    course: "Physics 102",
    grade: 15,
    type: "Lab",
    completed: false,
  },
  
  // DUE TOMORROW TASKS
  {
    id: "t7",
    name: "Midterm Review",
    due: (() => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().slice(0,10); })(), // tomorrow
    course: "Chemistry 201",
    grade: 20,
    type: "Midterm",
    completed: false,
  },
  {
    id: "t8",
    name: "English Essay Draft",
    due: (() => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().slice(0,10); })(), // tomorrow
    course: "English 201",
    grade: 18,
    type: "Essay",
    completed: false,
  },
  
  // DUE THIS WEEK TASKS
  {
    id: "t9",
    name: "Research Paper Draft",
    due: (() => { const d = new Date(); d.setDate(d.getDate()+3); return d.toISOString().slice(0,10); })(), // 3 days from now
    course: "English 201",
    grade: 25,
    type: "Essay",
    completed: false,
  },
  {
    id: "t10",
    name: "Statistics Problem Set",
    due: (() => { const d = new Date(); d.setDate(d.getDate()+4); return d.toISOString().slice(0,10); })(), // 4 days from now
    course: "Statistics 200",
    grade: 10,
    type: "Homework",
    completed: false,
  },
  {
    id: "t11",
    name: "Biology Lab 5",
    due: (() => { const d = new Date(); d.setDate(d.getDate()+5); return d.toISOString().slice(0,10); })(), // 5 days from now
    course: "Biology 101",
    grade: 12,
    type: "Lab",
    completed: false,
  },
  {
    id: "t12",
    name: "Group Project Presentation",
    due: (() => { const d = new Date(); d.setDate(d.getDate()+6); return d.toISOString().slice(0,10); })(), // 6 days from now
    course: "Business 300",
    grade: 30,
    type: "Presentation",
    completed: false,
  },
  {
    id: "t13",
    name: "Spanish Oral Exam",
    due: (() => { const d = new Date(); d.setDate(d.getDate()+7); return d.toISOString().slice(0,10); })(), // 7 days from now
    course: "Spanish 201",
    grade: 15,
    type: "Exam",
    completed: false,
  },
  
  // COMPLETED TASKS
  {
    id: "t14",
    name: "Final Essay Outline",
    due: (() => { const d = new Date(); d.setDate(d.getDate()-5); return d.toISOString().slice(0,10); })(), // 5 days ago
    course: "History 110",
    grade: 15,
    type: "Essay",
    completed: true,
  },
  {
    id: "t15",
    name: "Programming Assignment 2",
    due: (() => { const d = new Date(); d.setDate(d.getDate()-3); return d.toISOString().slice(0,10); })(), // 3 days ago
    course: "Computer Science 101",
    grade: 20,
    type: "Assignment",
    completed: true,
  },
  {
    id: "t16",
    name: "Art Portfolio Review",
    due: (() => { const d = new Date(); d.setDate(d.getDate()-1); return d.toISOString().slice(0,10); })(), // yesterday
    course: "Art 150",
    grade: 10,
    type: "Portfolio",
    completed: true,
  },
  {
    id: "t17",
    name: "Math Quiz 3",
    due: (() => { const d = new Date(); d.setDate(d.getDate()-2); return d.toISOString().slice(0,10); })(), // 2 days ago
    course: "Calculus 101",
    grade: 8,
    type: "Quiz",
    completed: true,
  },
  {
    id: "t18",
    name: "Physics Problem Set",
    due: (() => { const d = new Date(); d.setDate(d.getDate()-4); return d.toISOString().slice(0,10); })(), // 4 days ago
    course: "Physics 102",
    grade: 12,
    type: "Homework",
    completed: true,
  },
];

export async function getTasks() {
  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    if (IS_DEV) {
      console.warn(`Falling back to mock tasks in development. Backend error: ${err.message}`);
      return mockTasks;
    }
    throw new Error(
      `Cannot reach backend API at ${API_BASE}/tasks. Move Notion API calls to a backend (server or serverless) or configure a dev proxy. Original error: ${err.message}`
    );
  }
}

export async function updateTaskCompletion(pageId, completed) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${encodeURIComponent(pageId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json().catch(() => ({}));
  } catch (err) {
    if (IS_DEV) {
      // Update mock locally (best-effort)
      const idx = mockTasks.findIndex((t) => t.id === pageId);
      if (idx !== -1) mockTasks[idx].completed = completed;
      console.warn("Mock update in development mode due to backend error:", err.message);
      return;
    }
    console.warn("Update failed:", err);
  }
}
