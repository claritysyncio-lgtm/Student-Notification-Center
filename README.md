# Student Notification Center

A React-based notification center that integrates with Notion to display and manage tasks from your Notion database.

## Features

- **Notion Integration**: Connect to your Notion workspace and database
- **Task Management**: View, filter, and manage tasks from Notion
- **Real-time Updates**: Refresh tasks to get the latest data
- **Responsive Design**: Works on desktop and mobile devices
- **Clean UI**: Notion-inspired design with modern aesthetics

## Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Styling**: CSS with Notion-inspired design
- **Backend**: Vercel Serverless Functions
- **API**: Notion API v1
- **Authentication**: OAuth 2.0 with Notion

## Project Structure

```
src/
├── components/           # React components
│   ├── NotificationCenter.jsx    # Main notification center
│   ├── MakeItYours.jsx          # OAuth initiation component
│   ├── SimpleDatabaseSetup.jsx  # Database selection
│   ├── Section.jsx              # Task section component
│   ├── TaskItem.jsx             # Individual task component
│   └── ...
├── api/                 # API integration
│   └── notionApi.js     # Notion API client
├── config/              # Configuration files
│   ├── oauthConfig.js   # OAuth settings
│   └── widgetConfig.js  # Widget configuration
├── styles/              # Global styles
│   └── global.css       # Main stylesheet
├── utils/               # Utility functions
│   └── dateUtils.js     # Date handling utilities
├── App.jsx              # Main app component
└── main.jsx             # Application entry point

api/                     # Vercel serverless functions
├── oauth.js             # OAuth callback handler
├── notion.js            # Notion API proxy
└── databases.js         # Database listing API
```

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-notification-center
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```
   VITE_NOTION_CLIENT_ID=your_notion_client_id
   VITE_NOTION_CLIENT_SECRET=your_notion_client_secret
   VITE_BASE_URL=https://your-domain.vercel.app
   ```

4. **Set up Notion Integration**
   - Go to [Notion Integrations](https://www.notion.so/my-integrations)
   - Create a new integration
   - Copy the Client ID and Client Secret
   - Add the integration to your Notion database

5. **Run development server**
   ```bash
   npm run dev
   ```

## Deployment

This project is configured for Vercel deployment:

1. **Connect to Vercel**
   - Import the repository in Vercel
   - Set environment variables in Vercel dashboard

2. **Deploy**
   ```bash
   npm run build
   vercel --prod
   ```

## Usage

1. **Connect to Notion**
   - Click "Make it yours" button
   - Authorize with Notion
   - Select your database

2. **View Tasks**
   - Tasks are automatically loaded from your Notion database
   - Use filters to view specific courses or types
   - Toggle task completion status

3. **Refresh Data**
   - Click the refresh button to get latest tasks
   - Use the reset button to start over

## API Endpoints

- `GET /api/oauth` - OAuth callback handler
- `POST /api/notion` - Notion API proxy
- `GET /api/databases` - List available databases

## Configuration

### OAuth Configuration
Edit `src/config/oauthConfig.js` to update OAuth settings.

### Widget Configuration
Edit `src/config/widgetConfig.js` to customize the notification center appearance.

## Troubleshooting

### Common Issues

1. **OAuth not working**
   - Check that Client ID and Secret are correct
   - Ensure redirect URI matches your domain

2. **Tasks not loading**
   - Verify database ID is correct
   - Check that integration has access to database
   - Ensure database has required properties

3. **Styling issues**
   - Check browser console for CSS errors
   - Verify all style imports are correct

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.