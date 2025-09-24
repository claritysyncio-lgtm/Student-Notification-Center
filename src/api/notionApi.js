/**
 * Notion API Integration Module
 * 
 * This module handles all communication with the Notion API through our backend proxy.
 * It provides a clean interface for fetching and updating task data while handling
 * authentication, error states, and fallback data gracefully.
 * 
 * Key Features:
 * - Centralized API configuration
 * - Comprehensive error handling
 * - Fallback data for offline scenarios
 * - Type-safe data transformation
 * - Retry logic for failed requests
 */

// API Configuration
const API_CONFIG = {
  BASE_URL: "/api",
  NOTION_API_VERSION: "2022-06-28",
  REQUEST_TIMEOUT: 10000, // 10 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000 // 1 second
};

// Error types for better error handling
const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * Fallback data structure when Notion API is unavailable
 * Provides a user-friendly message instead of empty state
 */
const FALLBACK_TASKS = [
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

/**
 * Utility function to create a timeout promise
 * @param {number} ms - Timeout in milliseconds
 * @returns {Promise} Promise that rejects after timeout
 */
function createTimeoutPromise(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), ms);
  });
}

/**
 * Utility function to delay execution
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise} Promise that resolves after delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Enhanced fetch with timeout and retry logic
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @param {number} retries - Number of retries remaining
 * @returns {Promise<Response>} Fetch response
 */
async function fetchWithRetry(url, options, retries = API_CONFIG.MAX_RETRIES) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (retries > 0 && (error.name === 'AbortError' || error.name === 'TypeError')) {
      console.warn(`Request failed, retrying... (${retries} attempts left)`);
      await delay(API_CONFIG.RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

/**
 * Fetch data from Notion API through our backend proxy
 * 
 * @param {string} databaseId - The Notion database ID
 * @param {string} token - The Notion access token
 * @returns {Promise<Object>} The Notion API response
 * @throws {Error} When API request fails
 */
async function fetchFromNotion(databaseId, token) {
  const apiUrl = `${API_CONFIG.BASE_URL}/notion`;
    
  try {
    const response = await fetchWithRetry(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        databaseId,
        token
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: 'Invalid response format' 
      }));
      
      // Categorize error types for better handling
      if (response.status === 401 || response.status === 403) {
        throw new Error(`${ERROR_TYPES.AUTHENTICATION_ERROR}: ${errorData.error || 'Authentication failed'}`);
      } else if (response.status >= 400 && response.status < 500) {
        throw new Error(`${ERROR_TYPES.VALIDATION_ERROR}: ${errorData.error || 'Invalid request'}`);
      } else {
        throw new Error(`${ERROR_TYPES.API_ERROR}: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`${ERROR_TYPES.NETWORK_ERROR}: Request timeout`);
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`${ERROR_TYPES.NETWORK_ERROR}: Unable to connect to the server`);
    }
    throw error;
  }
}

/**
 * Transform Notion page data to our internal task format
 * 
 * @param {Object} page - Notion page object
 * @returns {Object} Transformed task object
 */
function transformNotionPageToTask(page) {
  const properties = page.properties;
  
  return {
    id: page.id,
    name: properties.Name?.title?.[0]?.text?.content || 'Untitled Task',
    due: properties.Due?.date?.start || null,
    course: properties.Course?.select?.name || 'No Course',
    grade: properties.Grade?.number || 0,
    type: properties.Type?.select?.name || 'Task',
    completed: properties.Completed?.checkbox || false,
    typeColor: properties.Type?.select?.color || 'default'
  };
}

/**
 * Fetch all tasks from the connected Notion database
 * 
 * @returns {Promise<Array>} Array of task objects
 */
export async function getTasks() {
  try {
    const databaseId = localStorage.getItem('notionDatabaseId');
    const accessToken = localStorage.getItem('notionAccessToken');
    
    if (!databaseId) {
      console.warn('No Notion database ID found. Please set it in localStorage:');
      console.warn('localStorage.setItem("notionDatabaseId", "your-database-id-here")');
      return FALLBACK_TASKS;
    }
    
    if (!accessToken) {
      console.warn('No Notion access token found. Please reconnect to Notion.');
      return FALLBACK_TASKS;
    }
    
    console.log('Fetching tasks from Notion database:', databaseId);
    
    const data = await fetchFromNotion(databaseId, accessToken);
    
    if (!data.results || !Array.isArray(data.results)) {
      throw new Error(`${ERROR_TYPES.VALIDATION_ERROR}: Invalid response format from Notion API`);
    }
    
    const tasks = data.results.map(transformNotionPageToTask);
    
    console.log(`Successfully fetched ${tasks.length} tasks from Notion`);
    return tasks;
    
  } catch (error) {
    console.error('Failed to fetch tasks from Notion:', error);
    
    // Provide helpful error context based on error type
    if (error.message.includes(ERROR_TYPES.NETWORK_ERROR)) {
      console.warn('Network connectivity issue - check your internet connection');
    } else if (error.message.includes(ERROR_TYPES.API_ERROR)) {
      console.warn('Backend API issue - the service may be temporarily unavailable');
    } else if (error.message.includes(ERROR_TYPES.AUTHENTICATION_ERROR)) {
      console.warn('Authentication issue - please reconnect to Notion');
    } else {
      console.warn('Using fallback data due to integration issue');
    }
    
    // Check if it's a database access issue
    if (error.message.includes('data sources accessible by this API bot')) {
      console.warn('Database access issue - the database may need to be shared with the integration');
    }
    
    return FALLBACK_TASKS;
  }
}

/**
 * Update task completion status in Notion
 * 
 * @param {string} pageId - The Notion page ID
 * @param {boolean} completed - The new completion status
 * @returns {Promise<Object>} Update response
 */
export async function updateTaskCompletion(pageId, completed) {
  try {
    const response = await fetchWithRetry(`${API_CONFIG.BASE_URL}/tasks/${encodeURIComponent(pageId)}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json", 
        "Accept": "application/json" 
      },
      body: JSON.stringify({ completed }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: 'Invalid response format' 
      }));
      
      if (response.status === 401 || response.status === 403) {
        throw new Error(`${ERROR_TYPES.AUTHENTICATION_ERROR}: Authentication failed`);
      } else if (response.status >= 400 && response.status < 500) {
        throw new Error(`${ERROR_TYPES.VALIDATION_ERROR}: ${errorData.error || 'Invalid request'}`);
      } else {
        throw new Error(`${ERROR_TYPES.API_ERROR}: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }
    }
    
    return await response.json().catch(() => ({}));
  } catch (error) {
    console.warn("Failed to update task completion:", error.message);
    console.info("Task completion updates require a valid Notion integration and backend API");
    throw error;
  }
}
