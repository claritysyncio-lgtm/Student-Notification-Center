# Repo Info

- Name: notification-center
- Stack: React 18 + Vite 5
- Entry: index.html -> src/main.jsx -> src/App.jsx
- Styles: src/styles/global.css, src/styles/colors.js
- Components: NotificationCenter, Section, CompletedSection, TaskItem, Dropdown
- API: src/api/notionApi.js (browser-safe shim; expects backend at /api)
- Scripts: npm run dev | build | preview
- Env: .env.local (root). Example in .env.local.example

## Notes
- Vite loads env only from project root. Files under src/.../.env.local are ignored.
- @notionhq/client is server-only; use a backend route (or proxy) at /api/tasks and /api/tasks/:id.
- If backend is not present, UI shows an error instead of hard crashing.