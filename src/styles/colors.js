
/**
 * Color System for Task Types
 * 
 * This module provides a comprehensive color mapping system for different task types.
 * It supports both predefined task type colors and Notion's native color system.
 */

/**
 * Predefined color mapping for common task types
 * Uses a consistent color palette that's accessible and visually distinct
 */
const typeColors = {
  Final: { bg: "#d7e6dd", text: "#2a533c" },
  Assignment: { bg: "#e8dbf2", text: "#573d6b" },
  Midterm: { bg: "#f4d8e4", text: "#68354e" },
  Quiz: { bg: "#f2e3b7", text: "#5d5237" },
  "Lab Report": { bg: "#f3ddcb", text: "#795338" },
  Lab: { bg: "#f3ddcb", text: "#795338" },
  Paper: { bg: "#ebdfd7", text: "#584437" },
  Presentation: { bg: "#e6e5e3", text: "#494846" },
  "Final Exam": { bg: "#d3e4f1", text: "#264a72" },
  Exam: { bg: "#d3e4f1", text: "#264a72" },
  Essay: { bg: "#f0efed", text: "#2c2c2b" },
  "Discussion Board": { bg: "#f7d9d5", text: "#6d3531" },
  Homework: { bg: "#dbeafe", text: "#1e40af" },
  Portfolio: { bg: "#fef3c7", text: "#92400e" },
};

/**
 * Notion's native color system mapping
 * Maps Notion's color names to our consistent color scheme
 */
const notionColorMap = {
  green: { bg: "#d7e6dd", text: "#2a533c" },
  purple: { bg: "#e8dbf2", text: "#573d6b" },
  pink: { bg: "#f4d8e4", text: "#68354e" },
  yellow: { bg: "#f2e3b7", text: "#5d5237" },
  orange: { bg: "#f3ddcb", text: "#795338" },
  brown: { bg: "#ebdfd7", text: "#584437" },
  gray: { bg: "#e6e5e3", text: "#494846" },
  blue: { bg: "#d3e4f1", text: "#264a72" },
  light_gray: { bg: "#f0efed", text: "#2c2c2b" },
  red: { bg: "#f7d9d5", text: "#6d3531" },
  default: { bg: "#e6e5e3", text: "#494846" }
};

/**
 * Get appropriate colors for a task type
 * 
 * This function provides a hierarchical color resolution system:
 * 1. First tries to match by exact task type name
 * 2. Falls back to Notion's color system
 * 3. Uses default colors as final fallback
 * 
 * @param {string} typeName - The task type name (e.g., "Assignment", "Quiz")
 * @param {string} notionColor - The Notion color name (e.g., "green", "purple")
 * @returns {Object} Color object with bg and text properties
 */
export function getTypeColors(typeName, notionColor = 'default') {
  // Validate input parameters
  if (!typeName || typeof typeName !== 'string') {
    console.warn('Invalid typeName provided to getTypeColors:', typeName);
    return notionColorMap.default;
  }

  // First priority: exact type name match
  if (typeColors[typeName]) {
    return typeColors[typeName];
  }
  
  // Second priority: Notion color mapping
  if (notionColor && notionColorMap[notionColor]) {
    return notionColorMap[notionColor];
  }
  
  // Final fallback: default colors
  return notionColorMap.default;
}
