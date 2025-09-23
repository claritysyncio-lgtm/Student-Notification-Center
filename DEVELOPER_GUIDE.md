# Developer Guide - Notion Notification Center

## 🏗️ Architecture Overview

This application is built with modern React patterns and follows industry best practices for maintainability and scalability.

### Core Technologies
- **React 18** with functional components and hooks
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **CSS Modules** for component-scoped styling

### Project Structure
```
src/
├── api/                 # API integration layer
│   └── notionApi.js    # Notion API client with retry logic
├── components/         # Reusable UI components
│   ├── NotificationCenter.jsx  # Main widget component
│   ├── TaskItem.jsx           # Individual task display
│   ├── Section.jsx            # Task grouping component
│   └── ...
├── config/             # Configuration management
│   ├── widgetConfig.js # Widget settings and themes
│   └── oauthConfig.js  # OAuth flow configuration
├── pages/              # Route-level components
│   └── Dashboard.jsx   # Dashboard page with OAuth handling
├── styles/             # Global styles and utilities
│   ├── global.css      # Base styles
│   └── colors.js       # Color system utilities
└── main.jsx           # Application entry point
```

## 🔧 Development Patterns

### State Management
- Uses React's built-in state management with `useState` and `useReducer`
- Implements optimistic updates for better UX
- Memoization with `useMemo` and `useCallback` for performance

### Error Handling
- Comprehensive error boundaries at the application level
- Categorized error types for better debugging
- Graceful fallbacks for API failures
- Retry logic with exponential backoff

### Performance Optimizations
- Component memoization to prevent unnecessary re-renders
- Lazy loading for route components
- Efficient date calculations with memoization
- Optimized bundle splitting

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Configuration
The application uses environment variables for configuration:
- `NODE_ENV` - Development/production mode
- `VITE_*` - Vite-specific environment variables

## 🔌 API Integration

### Notion API Client
The `notionApi.js` module provides a robust client for Notion integration:

```javascript
// Fetch tasks with automatic retry and error handling
const tasks = await getTasks();

// Update task completion with optimistic updates
await updateTaskCompletion(taskId, completed);
```

### Error Handling Strategy
- **Network Errors**: Automatic retry with exponential backoff
- **Authentication Errors**: Clear user messaging and re-auth flow
- **Validation Errors**: Detailed error messages for debugging
- **Fallback Data**: Graceful degradation when API is unavailable

## 🎨 Styling System

### CSS Architecture
- **Global Styles**: Base typography, reset, and utilities
- **Component Styles**: Scoped styles for individual components
- **Theme System**: Dynamic theming with CSS custom properties

### Color System
The color system provides consistent theming:
```javascript
// Get colors for task types
const colors = getTypeColors(taskType, notionColor);
```

## 🧪 Testing Strategy

### Component Testing
- Unit tests for utility functions
- Integration tests for API interactions
- E2E tests for critical user flows

### Error Scenarios
- Network connectivity issues
- API rate limiting
- Authentication failures
- Invalid data responses

## 📦 Build & Deployment

### Build Process
- Vite handles bundling and optimization
- Automatic code splitting
- Asset optimization and compression
- Source map generation (development only)

### Deployment
- Static hosting on Vercel
- Environment-specific configurations
- Automatic builds on git push

## 🔒 Security Considerations

### Data Handling
- No sensitive data stored in localStorage
- Secure token handling
- CORS configuration for API endpoints

### OAuth Flow
- Secure redirect URI validation
- State parameter for CSRF protection
- Token expiration handling

## 🐛 Debugging

### Development Tools
- React Developer Tools
- Browser DevTools
- Console logging with appropriate levels

### Common Issues
1. **CORS Errors**: Check API endpoint configuration
2. **Authentication Issues**: Verify OAuth configuration
3. **Build Errors**: Check for TypeScript/ESLint issues

## 📈 Performance Monitoring

### Metrics to Track
- Initial load time
- API response times
- Error rates
- User engagement metrics

### Optimization Opportunities
- Implement service worker for offline support
- Add request caching
- Optimize bundle size
- Implement virtual scrolling for large task lists

## 🤝 Contributing

### Code Standards
- ESLint configuration for code quality
- Prettier for consistent formatting
- Conventional commits for changelog generation

### Pull Request Process
1. Create feature branch from main
2. Implement changes with tests
3. Update documentation
4. Submit PR with clear description

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Notion API Reference](https://developers.notion.com/)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)
