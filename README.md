# 🔔 Notion Notification Center Template

A beautiful, customizable notification center widget that integrates with your Notion task database. Perfect for students, professionals, or anyone who wants to stay on top of their tasks directly in Notion.

## ✨ Features

- **Real-time Notion Integration**: Syncs with your Notion task database
- **Smart Task Organization**: Automatically categorizes tasks by due date (Overdue, Due Today, Due Tomorrow, Due This Week)
- **Customizable Design**: Full theme customization with color pickers
- **Filter Controls**: Filter by course and task type
- **Responsive Design**: Works perfectly in Notion embeds
- **Easy Setup**: Guided configuration with live preview

## 🚀 Quick Start

### 1. Setup Your Notion Database

Create a Notion database with these properties:
- **Name** (Title): Task name
- **Due** (Date): Due date
- **Course** (Relation or Formula): Course name
- **Type** (Select): Task type (Assignment, Quiz, Lab, etc.)
- **Worth %** (Number): Grade percentage
- **Done** (Checkbox): Completion status

### 2. Create Notion Integration

1. Go to [notion.so/my-integrations](https://notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "Notification Center")
4. Select your workspace
5. Copy the "Internal Integration Token"
6. Share your database with the integration

### 3. Deploy the Widget

#### Option A: Use the Live Demo
1. Visit the setup page
2. Enter your Notion credentials
3. Customize the appearance
4. Copy the embed URL

#### Option B: Self-Host
1. Clone this repository
2. Run `npm install`
3. Set up environment variables
4. Deploy to your hosting platform

### 4. Embed in Notion

1. In Notion, type `/embed`
2. Paste your embed URL
3. Resize the embed block as needed

## 🎨 Customization

The widget is fully customizable through the configuration panel:

### Display Settings
- Show/hide title
- Toggle refresh button
- Enable/disable filters
- Configure sections

### Theme Colors
- Primary color
- Background color
- Border color
- Text colors

### Notion Integration
- Database ID
- Integration token
- Course database (optional)

## 📁 File Structure

```
src/
├── components/
│   ├── NotificationCenter.jsx    # Main widget component
│   ├── ConfigPanel.jsx          # Configuration interface
│   ├── Section.jsx              # Task section component
│   ├── TaskItem.jsx             # Individual task component
│   └── ...
├── config/
│   └── widgetConfig.js          # Configuration system
└── styles/
    └── global.css               # Styling and themes
```

## 🔧 Configuration

The widget uses a JSON configuration system. You can:

1. Use the visual configuration panel
2. Manually edit the configuration JSON
3. Export/import configurations

### Example Configuration

```json
{
  "title": "My Tasks",
  "showTitle": true,
  "showRefreshButton": true,
  "showFilters": true,
  "sections": {
    "overdue": { "enabled": true, "title": "Overdue", "showCountdown": true },
    "dueToday": { "enabled": true, "title": "Due Today", "showCountdown": false },
    "dueTomorrow": { "enabled": true, "title": "Due Tomorrow", "showCountdown": false },
    "dueThisWeek": { "enabled": true, "title": "Due This Week", "showCountdown": true },
    "completed": { "enabled": true, "title": "Completed", "collapsible": true }
  },
  "theme": {
    "primaryColor": "#374151",
    "backgroundColor": "#ffffff",
    "borderColor": "#e1e5e9",
    "textColor": "#111827",
    "mutedColor": "#6b7280"
  },
  "notion": {
    "databaseId": "your-database-id",
    "token": "your-integration-token"
  }
}
```

## 🛠️ Development

### Prerequisites
- Node.js 16+
- npm or yarn
- Notion account with database access

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open `http://localhost:5173` for setup
5. Open `http://localhost:5173/embed.html` for embed preview

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Other Platforms
The widget can be deployed to any static hosting platform that supports:
- Static file serving
- Environment variables
- Custom domains

## 📱 Mobile Support

The widget is fully responsive and works great on:
- Desktop Notion
- Mobile Notion apps
- Tablet devices

## 🔒 Security

- All Notion API calls are made server-side
- Integration tokens are never exposed to the client
- CORS is properly configured
- No sensitive data is stored in localStorage

## 🐛 Troubleshooting

### Common Issues

**"Cannot reach backend API"**
- Check that your server is running
- Verify environment variables are set
- Ensure CORS is configured correctly

**"Missing Notion credentials"**
- Verify your integration token is correct
- Check that the database ID is valid
- Ensure the integration has access to the database

**Tasks not showing**
- Check your database properties match the expected format
- Verify the integration has read access
- Check the browser console for errors

### Getting Help

1. Check the browser console for error messages
2. Verify your Notion database structure
3. Test your integration token with the Notion API
4. Review the configuration settings

## 📄 License

This template is provided as-is for educational and commercial use. Feel free to modify and distribute according to your needs.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the troubleshooting section
- Review the Notion API documentation

---

**Made with ❤️ for the Notion community**