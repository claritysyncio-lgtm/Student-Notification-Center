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
dotenv.config({ path: new URL('./.env', import.meta.url).pathname });

const NOTION_TOKEN = process.env.NOTION_TOKEN || process.env.VITE_NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID || process.env.VITE_NOTION_DATABASE_ID;
const COURSE_DATABASE_ID = process.env.COURSE_DATABASE_ID || '273a5ebae7ac803cb153d163c9858720';
const COURSE_NOTION_TOKEN = process.env.COURSE_NOTION_TOKEN || NOTION_TOKEN;

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
    
    // First, get all courses to create a lookup table using Course database token
    let courseLookup = {};
    try {
      console.log('Fetching courses from database:', COURSE_DATABASE_ID);
      console.log('Using Course token:', COURSE_NOTION_TOKEN ? 'Present' : 'Missing');
      
      if (!COURSE_NOTION_TOKEN) {
        console.log('No Course token found, using main token');
      }
      
      const courseNotion = new Client({ auth: COURSE_NOTION_TOKEN });
      const courseResponse = await courseNotion.databases.query({ database_id: COURSE_DATABASE_ID });
      console.log('Course response:', courseResponse);
      console.log('Number of courses found:', courseResponse.results.length);
      
      courseLookup = courseResponse.results.reduce((acc, course) => {
        console.log('Processing course:', course.id);
        console.log('Course properties:', Object.keys(course.properties || {}));
        
        // Try all possible title properties
        const courseName = course.properties?.Name?.title?.[0]?.plain_text || 
                          course.properties?.Title?.title?.[0]?.plain_text || 
                          course.properties?.Course?.title?.[0]?.plain_text ||
                          course.properties?.Course Name?.title?.[0]?.plain_text ||
                          course.properties?.Course Title?.title?.[0]?.plain_text || '';
        
        console.log('Extracted course name:', courseName);
        if (courseName) {
          acc[course.id] = courseName;
        }
        return acc;
      }, {});
      console.log('Final course lookup table:', courseLookup);
    } catch (err) {
      console.log('Error fetching courses:', err.message);
      console.log('Error details:', err);
      console.log('Will continue without course names');
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

      // Get course name from lookup table
      let courseName = '';
      const courseRelation = page.properties?.['Course']?.relation?.[0];
      if (courseRelation) {
        courseName = courseLookup[courseRelation.id] || '';
        console.log('Course relation ID:', courseRelation.id);
        console.log('Course name from lookup:', courseName);
      } else {
        console.log('No course relation found for task:', page.properties?.['Name']?.title?.[0]?.plain_text);
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
      properties: {
        'Done': {
          checkbox: completed
        }
      },
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