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
    const response = await notion.databases.query({ database_id: DATABASE_ID });
    const tasks = response.results.map((page) => ({
      id: page.id,
      name: page.properties?.Name?.title?.[0]?.plain_text || 'Untitled',
      due: page.properties?.Due?.date?.start || null,
      course: page.properties?.Course?.rich_text?.[0]?.plain_text || '',
      grade: page.properties?.Grade?.number ?? null,
      type: page.properties?.Type?.select?.name || '',
      completed: page.properties?.Completed?.checkbox || false,
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