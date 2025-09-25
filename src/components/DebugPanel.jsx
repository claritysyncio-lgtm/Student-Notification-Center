import React, { useState, useEffect } from 'react';
import { getTasks } from '../api/notionApi';
import { getDateRangesInTimezone } from '../utils/dateUtils';

/**
 * Debug Panel Component
 * Shows detailed information about the current state for debugging
 */
export default function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadDebugInfo = async () => {
      try {
        // Get localStorage data
        const databaseId = localStorage.getItem('notionDatabaseId');
        const accessToken = localStorage.getItem('notionAccessToken');
        const workspace = localStorage.getItem('notionWorkspace');

        // Get date ranges
        const dateRanges = getDateRangesInTimezone();

        // Try to fetch tasks
        let tasks = [];
        let apiError = null;
        try {
          tasks = await getTasks();
        } catch (error) {
          apiError = error.message;
        }

        // Categorize tasks
        const { today, tomorrow, weekEnd } = dateRanges;
        const categorizedTasks = {
          overdue: tasks.filter(task => 
            task.due && task.due < today && !task.completed
          ),
          dueToday: tasks.filter(task => 
            !task.completed && task.due === today
          ),
          dueTomorrow: tasks.filter(task => 
            !task.completed && task.due === tomorrow
          ),
          dueThisWeek: tasks.filter(task => 
            !task.completed && task.due > today && task.due <= weekEnd && task.due !== tomorrow
          ),
          completed: tasks.filter(task => task.completed)
        };

        setDebugInfo({
          localStorage: {
            databaseId: databaseId ? `${databaseId.substring(0, 8)}...` : 'NOT_FOUND',
            accessToken: accessToken ? `${accessToken.substring(0, 8)}...` : 'NOT_FOUND',
            workspace: workspace || 'NOT_FOUND'
          },
          dateRanges,
          tasks: {
            total: tasks.length,
            sample: tasks[0] || null,
            all: tasks
          },
          categorizedTasks,
          apiError
        });
      } catch (error) {
        setDebugInfo({ error: error.message });
      }
    };

    loadDebugInfo();
  }, []);

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999,
          background: '#ff6b6b',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Debug
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.8)',
      zIndex: 10000,
      overflow: 'auto',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Debug Information</h2>
          <button 
            onClick={() => setIsVisible(false)}
            style={{
              background: '#ccc',
              border: 'none',
              padding: '10px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>LocalStorage</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(debugInfo.localStorage, null, 2)}
          </pre>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Date Ranges</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(debugInfo.dateRanges, null, 2)}
          </pre>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Tasks ({debugInfo.tasks?.total || 0})</h3>
          {debugInfo.tasks?.sample && (
            <div>
              <h4>Sample Task:</h4>
              <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                {JSON.stringify(debugInfo.tasks.sample, null, 2)}
              </pre>
            </div>
          )}
          <div>
            <h4>All Tasks:</h4>
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', maxHeight: '200px', overflow: 'auto' }}>
              {JSON.stringify(debugInfo.tasks?.all, null, 2)}
            </pre>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Categorized Tasks</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(debugInfo.categorizedTasks, null, 2)}
          </pre>
        </div>

        {debugInfo.apiError && (
          <div style={{ marginBottom: '20px' }}>
            <h3>API Error</h3>
            <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px' }}>
              {debugInfo.apiError}
            </div>
          </div>
        )}

        {debugInfo.error && (
          <div style={{ marginBottom: '20px' }}>
            <h3>Debug Error</h3>
            <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px' }}>
              {debugInfo.error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
