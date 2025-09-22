/*
Simple Express backend to interact with Notion securely.
Exposes:
- GET /api/tasks
- PATCH /api/tasks/:id { completed: boolean }

Setup:
1) Create c:\Users\lizsp\Downloads\ncvite2 - Copy\ncvite1main\server\.env with:
   NOTION_TOKEN=... 
   NOTION_DATABASE_ID=...
2) npm install (to install express, dotenv, @notionhq/client)
3) Run: npm run server (port 8787)

The Vite dev server proxies /api to this backend.
*/

import express from 'express';
import dotenv from 'dotenv';
import { Client } from '@notionhq/client';

// Load server-only env
dotenv.config();

const NOTION_TOKEN = process.env.NOTION_TOKEN || process.env.VITE_NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID || process.env.VITE_NOTION_DATABASE_ID;
const COURSE_DATABASE_ID = process.env.COURSE_DATABASE_ID || '273a5ebae7ac803cb153d163c9858720';
const COURSE_NOTION_TOKEN = process.env.COURSE_NOTION_TOKEN || NOTION_TOKEN;

console.log('Environment variables loaded:');
console.log('NOTION_TOKEN:', NOTION_TOKEN ? 'Present' : 'Missing');
console.log('DATABASE_ID:', DATABASE_ID ? 'Present' : 'Missing');
console.log('COURSE_DATABASE_ID:', COURSE_DATABASE_ID);
console.log('COURSE_NOTION_TOKEN:', COURSE_NOTION_TOKEN ? 'Present' : 'Missing');

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.warn('[server] Missing NOTION_TOKEN or NOTION_DATABASE_ID in server/.env');
}

const notion = new Client({ auth: NOTION_TOKEN });
const app = express();
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Fetch tasks
app.get('/api/tasks', async (_req, res) => {
  try {
    if (!NOTION_TOKEN || !DATABASE_ID) {
      return res.status(500).json({ error: 'Server missing Notion credentials.' });
    }
    
    // Simple course lookup - if it fails, we'll just show empty course names
    let courseLookup = {};
    try {
      console.log('Fetching courses...');
      const courseNotion = new Client({ auth: COURSE_NOTION_TOKEN });
      const courseResponse = await courseNotion.databases.query({ 
        database_id: COURSE_DATABASE_ID,
        page_size: 100
      });
      
      console.log(`Found ${courseResponse.results.length} courses`);
      
      // Simple course name extraction
      courseResponse.results.forEach(course => {
        console.log('Course properties:', Object.keys(course.properties || {}));
        
        // Try different possible course name properties
        let courseName = '';
        const possibleNames = [
          course.properties?.Course?.title?.[0]?.plain_text,
          course.properties?.Name?.title?.[0]?.plain_text,
          course.properties?.Title?.title?.[0]?.plain_text,
          course.properties?.['Course Name']?.title?.[0]?.plain_text,
          course.properties?.['Course Title']?.title?.[0]?.plain_text
        ];
        
        courseName = possibleNames.find(name => name) || 'Unknown Course';
        courseLookup[course.id] = courseName;
        console.log(`Course: ${course.id} -> ${courseName}`);
      });
      
    } catch (err) {
      console.log('Course lookup failed, continuing without course names:', err.message);
      // Don't crash the server, just continue with empty course names
    }
    
    const response = await notion.databases.query({ database_id: DATABASE_ID });
    const tasks = await Promise.all(response.results.map(async (page) => {
      const dueDate = page.properties?.['Due']?.date?.start || null;
      let countdown = null;

      if (dueDate) {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          countdown = 'Today';
        } else if (diffDays === 1) {
          countdown = 'Tomorrow';
        } else if (diffDays > 1) {
          countdown = `${diffDays} days`;
        } else {
          countdown = `${Math.abs(diffDays)} days overdue`;
        }
      }

      // Get course name - try multiple methods
      let courseName = '';
      try {
        // Method 1: Try formula property first
        const courseFormula = page.properties?.['Course notif form']?.formula?.string;
        if (courseFormula) {
          courseName = courseFormula;
          console.log(`✓ Course from formula: ${courseName}`);
        } else {
          // Method 2: Try relation lookup
          const courseRelation = page.properties?.['Course']?.relation?.[0];
          if (courseRelation && courseLookup[courseRelation.id]) {
            courseName = courseLookup[courseRelation.id];
            console.log(`✓ Course from relation: ${courseName}`);
          } else if (courseRelation) {
            console.log(`✗ Course ID ${courseRelation.id} not found in lookup table`);
          }
        }
      } catch (err) {
        console.log('Error getting course name:', err.message);
      }

      return {
        id: page.id,
        name: page.properties?.['Name']?.title?.[0]?.plain_text || 'Untitled',
        due: dueDate,
        countdown: countdown,
        course: courseName,
        grade: page.properties?.['Worth %']?.number ?? null,
        type: page.properties?.['Type']?.select?.name || '',
        typeColor: page.properties?.['Type']?.select?.color || 'default',
        completed: page.properties?.['Done']?.checkbox || page.properties?.['Status']?.select?.name === 'Completed' || false,
      };
    }));
    res.json(tasks);
  } catch (err) {
    console.error('[GET /api/tasks] Error:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

// Update completion
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body || {};
    if (!NOTION_TOKEN || !DATABASE_ID) {
      return res.status(500).json({ error: 'Server missing Notion credentials.' });
    }
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'completed must be boolean' });
    }
    await notion.pages.update({
      page_id: id,
      properties: { Completed: { checkbox: completed } },
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('[PATCH /api/tasks/:id] Error:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`);
});