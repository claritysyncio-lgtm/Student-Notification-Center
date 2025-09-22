// User-specific configuration system
// This allows each user to have their own personalized settings

export const createUserConfig = (userId, userData = {}) => {
  return {
    // User identification
    userId: userId,
    userEmail: userData.email || '',
    userName: userData.name || '',
    
    // Personalization settings
    personalization: {
      // Widget appearance
      title: userData.title || "My Task Center",
      showTitle: userData.showTitle !== false,
      showRefreshButton: userData.showRefreshButton !== false,
      showFilters: userData.showFilters !== false,
      
      // Color scheme
      theme: {
        primaryColor: userData.primaryColor || "#374151",
        backgroundColor: userData.backgroundColor || "#ffffff",
        borderColor: userData.borderColor || "#e1e5e9",
        textColor: userData.textColor || "#111827",
        mutedColor: userData.mutedColor || "#6b7280"
      },
      
      // Layout preferences
      layout: {
        width: userData.width || "100%",
        maxHeight: userData.maxHeight || "600px",
        compactMode: userData.compactMode || false,
        showCompleted: userData.showCompleted !== false
      },
      
      // Notification preferences
      notifications: {
        enableOverdue: userData.enableOverdue !== false,
        enableDueToday: userData.enableDueToday !== false,
        enableDueTomorrow: userData.enableDueTomorrow !== false,
        enableDueThisWeek: userData.enableDueThisWeek !== false,
        showCountdown: userData.showCountdown !== false
      }
    },
    
    // Notion integration (user-specific)
    notion: {
      databaseId: userData.databaseId || '',
      token: userData.token || '',
      courseDatabaseId: userData.courseDatabaseId || '',
      courseToken: userData.courseToken || '',
      workspaceId: userData.workspaceId || '',
      workspaceName: userData.workspaceName || ''
    },
    
    // User preferences
    preferences: {
      defaultView: userData.defaultView || 'all',
      sortBy: userData.sortBy || 'due',
      groupBy: userData.groupBy || 'course',
      showGrades: userData.showGrades !== false,
      showProgress: userData.showProgress !== false
    },
    
    // Analytics (optional)
    analytics: {
      enabled: userData.analyticsEnabled !== false,
      trackUsage: userData.trackUsage !== false,
      userId: userId
    }
  };
};

// Generate unique user ID
export const generateUserId = () => {
  return 'user_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Load user configuration from localStorage
export const loadUserConfig = (userId) => {
  try {
    const saved = localStorage.getItem(`notificationCenter_${userId}`);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load user config:', error);
    return null;
  }
};

// Save user configuration to localStorage
export const saveUserConfig = (userId, config) => {
  try {
    localStorage.setItem(`notificationCenter_${userId}`, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Failed to save user config:', error);
    return false;
  }
};

// Get or create user configuration
export const getUserConfig = (userData = {}) => {
  try {
    let userId = userData.userId;
    
    if (!userId) {
      // Try to get existing user ID
      userId = localStorage.getItem('notificationCenter_userId');
      
      if (!userId) {
        // Create new user ID
        userId = generateUserId();
        localStorage.setItem('notificationCenter_userId', userId);
      }
    }
    
    // Load existing config or create new one
    let config = loadUserConfig(userId);
    
    if (!config) {
      config = createUserConfig(userId, userData);
      saveUserConfig(userId, config);
    }
    
    return config;
  } catch (error) {
    console.error('Error getting user config:', error);
    // Return a default config if there's an error
    return createUserConfig(generateUserId(), userData);
  }
};

// Update user configuration
export const updateUserConfig = (userId, updates) => {
  const config = loadUserConfig(userId);
  
  if (config) {
    const updatedConfig = {
      ...config,
      ...updates,
      personalization: {
        ...config.personalization,
        ...updates.personalization
      },
      notion: {
        ...config.notion,
        ...updates.notion
      },
      preferences: {
        ...config.preferences,
        ...updates.preferences
      }
    };
    
    saveUserConfig(userId, updatedConfig);
    return updatedConfig;
  }
  
  return null;
};

// Reset user configuration
export const resetUserConfig = (userId) => {
  localStorage.removeItem(`notificationCenter_${userId}`);
  localStorage.removeItem('notificationCenter_userId');
};
