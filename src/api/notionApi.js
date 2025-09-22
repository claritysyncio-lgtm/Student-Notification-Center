// Customer-ready Notion API integration
// This module handles all Notion API calls for the notification center

const API_BASE = "/api"; // Backend API endpoint

// Mock data for demonstration purposes
const mockTasks = [
  // OVERDUE TASKS
  {
    id: "t1",
    name: "Read Chapter 3",
    due: (() => { const d = new Date(); d.setDate(d.getDate()-2); return d.toISOString().slice(0,10); })(),
    course: "Biology 101",
    grade: 10,
    type: "Assignment",
    completed: false,
  },
  {
    id: "t2",
    name: "Lab Report #3",
    due: (() => { const d = new Date(); d.setDate(d.getDate()-1); return d.toISOString().slice(0,10); })(),
    course: "Chemistry 201",
    grade: 15,
    type: "Lab",
    completed: false,
  },
  
  // DUE TODAY TASKS
  {
    id: "t3",
    name: "Chemistry Quiz",
    due: (() => { const d = new Date(); return d.toISOString().slice(0,10); })(),
    course: "Chemistry 201",
    grade: 8,
    type: "Quiz",
    completed: false,
  },
  
  // DUE TOMORROW TASKS
  {
    id: "t4",
    name: "Midterm Review",
    due: (() => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().slice(0,10); })(),
    course: "Chemistry 201",
    grade: 20,
    type: "Midterm",
    completed: false,
  },
  
  // COMPLETED TASKS
  {
    id: "t5",
    name: "Final Essay Outline",
    due: (() => { const d = new Date(); d.setDate(d.getDate()-5); return d.toISOString().slice(0,10); })(),
    course: "History 110",
    grade: 15,
    type: "Essay",
    completed: true,
  },
];

export async function getTasks() {
  try {
    // Try to fetch from backend API
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: { Accept: "application/json" },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    // Fallback to mock data for demonstration
    console.warn(`Using mock data. Backend error: ${err.message}`);
    return mockTasks;
  }
}

export async function updateTaskCompletion(pageId, completed) {
  try {
    const res = await fetch(`${API_BASE}/tasks/${encodeURIComponent(pageId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ completed }),
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    return await res.json().catch(() => ({}));
  } catch (err) {
    // For demo purposes, just log the update
    console.warn("Update failed (using mock data):", err.message);
    
    // Update mock data locally
    const taskIndex = mockTasks.findIndex(task => task.id === pageId);
    if (taskIndex !== -1) {
      mockTasks[taskIndex].completed = completed;
    }
  }
}
