// Customer-ready Notion API integration
// This module handles all Notion API calls for the notification center

const API_BASE = "/api"; // Backend API endpoint

// Fallback data when Notion API is not available
const fallbackTasks = [
  {
    id: "no-data",
    name: "No tasks found",
    due: null,
    course: "Setup Required",
    grade: 0,
    type: "Info",
    completed: false,
  }
];

// Backend API integration to avoid CORS issues
async function fetchFromNotion(databaseId, token) {
  // Use local proxy in development, direct API in production
  const apiUrl = import.meta.env.DEV 
    ? '/api/notion'
    : 'https://notification-center-for-customers.vercel.app/api/notion';
    
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      databaseId,
      token
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error, not valid JSON' }));
    throw new Error(`API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
  }
  
  return response.json();
}

export async function getTasks() {
  try {
    // Get user ID first
    const userId = localStorage.getItem('notificationCenter_userId');
    if (!userId) {
      console.warn('No user ID found, using fallback data');
      return fallbackTasks;
    }
    
    // Get user config from localStorage using the correct key
    const userConfig = JSON.parse(localStorage.getItem(`notificationCenter_${userId}`) || '{}');
    const notionConfig = userConfig.notion || {};
    
    console.log('🔍 User config from localStorage:', userConfig);
    console.log('🔍 Notion config:', notionConfig);
    
    // Check if we have the required database IDs and token
    if (!notionConfig.databaseId || !notionConfig.token) {
      console.warn('No Notion database ID or token found, using fallback data', {
        databaseId: notionConfig.databaseId,
        hasToken: !!notionConfig.token,
        tokenValue: notionConfig.token
      });
      return fallbackTasks;
    }
    
    console.log('🔑 Using token for API call:', notionConfig.token);
    console.log('📊 Database ID:', notionConfig.databaseId);
    console.log('🚀 About to fetch from Notion API...');
    
    console.log('Fetching real data from Notion...', {
      databaseId: notionConfig.databaseId,
      hasToken: !!notionConfig.token
    });
    
    // Fetch from Notion via our backend API
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
    
    console.log('✅ Successfully fetched tasks from Notion:', tasks);
    return tasks;
    
  } catch (err) {
    console.error('❌ ERROR DETAILS:', err);
    console.warn(`Failed to fetch from Notion: ${err.message}`);
    
    // Check if it's a network or API error
    if (err.message.includes('Failed to fetch') || err.message.includes('API error')) {
      console.log('🚫 API Error: Unable to connect to backend API.');
      console.log('💡 This might be a deployment issue or the API endpoint is not available.');
      console.log('📋 Please check your Notion integration and try again.');
    } else {
      console.log('Using fallback data instead');
    }
    
    return fallbackTasks;
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
    console.warn("Update failed:", err.message);
    console.log("Task completion updates require a valid Notion integration.");
  }
}
