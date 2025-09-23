/**
 * Widget Configuration System
 * 
 * This module provides a comprehensive configuration system for the notification center.
 * It includes default settings, validation, and utility functions for theme generation.
 * 
 * The configuration system is designed to be:
 * - Extensible: Easy to add new configuration options
 * - Validated: Ensures configuration integrity
 * - Themeable: Supports dynamic theming
 * - Backward Compatible: Graceful handling of missing options
 */

// Configuration version for migration handling
const CONFIG_VERSION = '1.0.0';

// Default section titles for internationalization support
const DEFAULT_SECTION_TITLES = {
  overdue: 'Overdue',
  dueToday: 'Due Today', 
  dueTomorrow: 'Due Tomorrow',
  dueThisWeek: 'Due This Week',
  completed: 'Completed'
};

/**
 * Default configuration object for the notification center
 * All settings can be overridden by passing custom config to components
 */
export const defaultConfig = {
  // Display and UI settings
  title: "Notification Center",
  showTitle: true,
  showRefreshButton: true,
  
  // Filter and navigation settings
  showFilters: true,
  defaultCourseFilter: "All Courses",
  defaultTypeFilter: "All Types",
  
  // Section configuration - controls which task sections are displayed
  sections: {
    overdue: { 
      enabled: true, 
      title: DEFAULT_SECTION_TITLES.overdue, 
      showCountdown: true,
      priority: 1 // Higher priority = displayed first
    },
    dueToday: { 
      enabled: true, 
      title: DEFAULT_SECTION_TITLES.dueToday, 
      showCountdown: false,
      priority: 2
    },
    dueTomorrow: { 
      enabled: true, 
      title: DEFAULT_SECTION_TITLES.dueTomorrow, 
      showCountdown: false,
      priority: 3
    },
    dueThisWeek: { 
      enabled: true, 
      title: DEFAULT_SECTION_TITLES.dueThisWeek, 
      showCountdown: true,
      collapsible: true,
      priority: 4
    },
    completed: { 
      enabled: true, 
      title: DEFAULT_SECTION_TITLES.completed, 
      collapsible: true,
      priority: 5
    }
  },
  
  // Theme configuration for custom styling
  theme: {
    primaryColor: "#374151",
    backgroundColor: "#ffffff",
    borderColor: "#e1e5e9",
    textColor: "#111827",
    mutedColor: "#6b7280"
  },
  
  // Notion integration settings
  notion: {
    databaseId: "",
    token: "",
    courseDatabaseId: "",
    courseToken: ""
  },
  
  // Widget behavior and performance settings
  autoRefresh: false,
  refreshInterval: 300000, // 5 minutes in milliseconds
  showLoadingState: true,
  showErrorState: true
};

/**
 * Validate configuration object for required fields and data types
 * 
 * @param {Object} config - Configuration object to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export function validateConfig(config) {
  const errors = [];
  
  if (!config.notion.databaseId) {
    errors.push("Notion database ID is required");
  }
  
  if (!config.notion.token) {
    errors.push("Notion token is required");
  }
  
  // Validate theme colors are valid hex codes
  if (config.theme) {
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const themeColors = ['primaryColor', 'backgroundColor', 'borderColor', 'textColor', 'mutedColor'];
    
    themeColors.forEach(colorKey => {
      if (config.theme[colorKey] && !colorRegex.test(config.theme[colorKey])) {
        errors.push(`Invalid color format for ${colorKey}: ${config.theme[colorKey]}`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Deep merge user configuration with default configuration
 * Preserves nested object structure while allowing partial overrides
 * 
 * @param {Object} userConfig - User-provided configuration overrides
 * @returns {Object} Merged configuration object
 */
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

/**
 * Migrate configuration from older versions
 * Ensures backward compatibility when configuration structure changes
 * 
 * @param {Object} config - Configuration object to migrate
 * @returns {Object} Migrated configuration
 */
export function migrateConfig(config) {
  if (!config || typeof config !== 'object') {
    return defaultConfig;
  }

  // Add version tracking
  if (!config.version) {
    config.version = CONFIG_VERSION;
  }

  // Migrate section titles if missing
  if (config.sections) {
    Object.keys(DEFAULT_SECTION_TITLES).forEach(sectionKey => {
      if (config.sections[sectionKey] && !config.sections[sectionKey].title) {
        config.sections[sectionKey].title = DEFAULT_SECTION_TITLES[sectionKey];
      }
    });
  }

  return config;
}

/**
 * Generate CSS custom properties from theme configuration
 * Creates CSS variables that can be used throughout the component styles
 * 
 * @param {Object} theme - Theme configuration object
 * @returns {string} CSS string with custom properties
 */
export function generateThemeCSS(theme) {
  if (!theme) return '';
  
  const safeTheme = { ...defaultConfig.theme, ...theme };
  
  return `
    :root {
      --nc-primary: ${safeTheme.primaryColor};
      --nc-background: ${safeTheme.backgroundColor};
      --nc-border: ${safeTheme.borderColor};
      --nc-text: ${safeTheme.textColor};
      --nc-muted: ${safeTheme.mutedColor};
    }
  `;
}

/**
 * Get sorted sections by priority
 * Returns sections sorted by their priority value for consistent ordering
 * 
 * @param {Object} sections - Sections configuration
 * @returns {Array} Sorted sections array
 */
export function getSortedSections(sections) {
  return Object.entries(sections)
    .filter(([_, config]) => config.enabled)
    .sort(([_, a], [__, b]) => (a.priority || 999) - (b.priority || 999));
}
