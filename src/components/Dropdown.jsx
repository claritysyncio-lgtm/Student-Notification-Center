
import React, { useCallback } from "react";

/**
 * Dropdown Component
 * 
 * A reusable dropdown/select component for filtering tasks by course or type.
 * Provides proper accessibility attributes and handles option changes.
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the dropdown (used for accessibility)
 * @param {Array} props.options - Array of option strings
 * @param {string} props.value - Currently selected value
 * @param {Function} props.onChange - Callback when selection changes
 */
export default function Dropdown({ 
  label, 
  options = [], 
  value, 
  onChange 
}) {
  /**
   * Handle dropdown value change with validation
   */
  const handleChange = useCallback((event) => {
    const newValue = event.target.value;
    
    if (typeof onChange === 'function') {
      try {
        onChange(newValue);
      } catch (error) {
        console.error('Error in dropdown onChange callback:', error);
      }
    }
  }, [onChange]);

  // Validate options array
  const validOptions = Array.isArray(options) ? options : [];
  
  return (
    <div className="dropdown">
      <select 
        value={value || ''} 
        onChange={handleChange}
        aria-label={label}
        title={`Filter by ${label.toLowerCase()}`}
      >
        {validOptions.map(option => {
          // Ensure option is a string and not empty
          const optionValue = String(option || '');
          if (!optionValue.trim()) return null;
          
          return (
            <option key={optionValue} value={optionValue}>
              {optionValue}
            </option>
          );
        }).filter(Boolean)}
      </select>
    </div>
  );
}
