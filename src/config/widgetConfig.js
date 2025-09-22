// Widget Configuration System
// This allows users to easily customize the notification center

export const defaultConfig = {
  // Display settings
  title: "Notification Center",
  showTitle: true,
  showRefreshButton: true,
  
  // Filter settings
  showFilters: true,
  defaultCourseFilter: "All Courses",
  defaultTypeFilter: "All Types",
  
  // Section settings
  sections: {
    overdue: { enabled: true, title: "Overdue", showCountdown: true },
    dueToday: { enabled: true, title: "Due Today", showCountdown: false },
    dueTomorrow: { enabled: true, title: "Due Tomorrow", showCountdown: false },
    dueThisWeek: { enabled: true, title: "Due This Week", showCountdown: true },
    completed: { enabled: true, title: "Completed", collapsible: true }
  },
  
  // Styling
  theme: {
    primaryColor: "#374151",
    backgroundColor: "#ffffff",
    borderColor: "#e1e5e9",
    textColor: "#111827",
    mutedColor: "#6b7280"
  },
  
  // Notion integration
  notion: {
    databaseId: "",
    token: "",
    courseDatabaseId: "",
    courseToken: ""
  },
  
  // Widget behavior
  autoRefresh: false,
  refreshInterval: 300000, // 5 minutes
  showLoadingState: true,
  showErrorState: true
};

// Configuration validation
export function validateConfig(config) {
  const errors = [];
  
  if (!config.notion.databaseId) {
    errors.push("Notion database ID is required");
  }
  
  if (!config.notion.token) {
    errors.push("Notion token is required");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Merge user config with defaults
export function mergeConfig(userConfig = {}) {
  return {
    ...defaultConfig,
    ...userConfig,
    sections: {
      ...defaultConfig.sections,
      ...userConfig.sections
    },
    theme: {
      ...defaultConfig.theme,
      ...userConfig.theme
    },
    notion: {
      ...defaultConfig.notion,
      ...userConfig.notion
    }
  };
}

// Generate CSS variables from theme
export function generateThemeCSS(theme) {
  return `
    :root {
      --nc-primary: ${theme.primaryColor};
      --nc-background: ${theme.backgroundColor};
      --nc-border: ${theme.borderColor};
      --nc-text: ${theme.textColor};
      --nc-muted: ${theme.mutedColor};
    }
  `;
}
