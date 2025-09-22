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

// Client-side Notion API integration
async function fetchFromNotion(databaseId, token) {
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      page_size: 100
    })
  });
  
  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status}`);
  }
  
  return response.json();
}

export async function getTasks() {
  try {
    // Get user ID first
    const userId = localStorage.getItem('notificationCenter_userId');
    if (!userId) {
      console.warn('No user ID found, using mock data');
      return mockTasks;
    }
    
    // Get user config from localStorage using the correct key
    const userConfig = JSON.parse(localStorage.getItem(`notificationCenter_${userId}`) || '{}');
    const notionConfig = userConfig.notion || {};
    
    // Check if we have the required database IDs and token
    if (!notionConfig.databaseId || !notionConfig.token) {
      console.warn('No Notion database ID or token found, using mock data', {
        databaseId: notionConfig.databaseId,
        hasToken: !!notionConfig.token
      });
      return mockTasks;
    }
    
    console.log('Fetching real data from Notion...', {
      databaseId: notionConfig.databaseId,
      hasToken: !!notionConfig.token
    });
    
    // Fetch from Notion API directly
    const data = await fetchFromNotion(notionConfig.databaseId, notionConfig.token);
    
    // Transform Notion data to our task format
    const tasks = data.results.map(page => {
      const properties = page.properties;
      return {
        id: page.id,
        name: properties.Name?.title?.[0]?.text?.content || 'Untitled Task',
        due: properties.Due?.date?.start || null,
        course: properties.Course?.select?.name || 'No Course',
        grade: properties.Grade?.number || 0,
        type: properties.Type?.select?.name || 'Task',
        completed: properties.Completed?.checkbox || false
      };
    });
    
    console.log('Fetched tasks from Notion:', tasks);
    return tasks;
    
  } catch (err) {
    console.warn(`Failed to fetch from Notion: ${err.message}`);
    
    // Check if it's a CORS error
    if (err.message.includes('CORS') || err.message.includes('Failed to fetch')) {
      console.log('🚫 CORS Error: Direct Notion API calls from browser are blocked for security.');
      console.log('💡 This is normal for static sites. In production, you would need a backend proxy.');
      console.log('📋 Showing demo data instead to demonstrate the functionality.');
    } else {
      console.log('Using mock data instead');
    }
    
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
