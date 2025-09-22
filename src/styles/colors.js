
// Static color mapping for type names
export const typeColors = {
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

// Notion color mapping to our color scheme
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

// Function to get colors for a task type
export function getTypeColors(typeName, notionColor = 'default') {
  // First try to get colors by type name
  if (typeColors[typeName]) {
    return typeColors[typeName];
  }
  
  // Then try to get colors by Notion color
  if (notionColorMap[notionColor]) {
    return notionColorMap[notionColor];
  }
  
  // Default fallback
  return notionColorMap.default;
}
