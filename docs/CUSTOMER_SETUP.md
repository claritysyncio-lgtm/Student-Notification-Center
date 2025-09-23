# 🚀 Customer Setup Guide

Welcome to the Notion Notification Center! This guide will help you get your widget up and running in just a few minutes.

## 📋 What You'll Need

- A Notion account
- A Notion workspace where you can create databases
- 5-10 minutes of setup time

## 🗄️ Step 1: Create Your Notion Database

### 1.1 Create a New Database
1. In Notion, create a new page
2. Type `/database` and select "Table - Inline"
3. Name your database (e.g., "Tasks" or "Assignments")

### 1.2 Set Up Database Properties
Your database needs these exact properties:

| Property Name | Type | Description |
|---------------|------|-------------|
| **Name** | Title | The task name (this is the default title property) |
| **Due** | Date | When the task is due |
| **Course** | Relation | Link to a course database (optional) |
| **Type** | Select | Task type (Assignment, Quiz, Lab, etc.) |
| **Worth %** | Number | Grade percentage |
| **Done** | Checkbox | Whether the task is completed |

### 1.3 Configure Select Options
For the "Type" property, add these options:
- Assignment
- Quiz
- Lab
- Homework
- Essay
- Exam
- Presentation
- Project

### 1.4 (Optional) Create Course Database
If you want course names to display properly:

1. Create another database called "Courses"
2. Add a "Name" (Title) property
3. Add some sample courses
4. Link the "Course" property in your tasks database to this courses database

## 🔑 Step 2: Create Notion Integration

### 2.1 Create Integration
1. Go to [notion.so/my-integrations](https://notion.so/my-integrations)
2. Click "New integration"
3. Fill in the details:
   - **Name**: "Notification Center Widget"
   - **Logo**: (optional)
   - **Associated workspace**: Select your workspace
4. Click "Submit"

### 2.2 Get Integration Token
1. After creating the integration, you'll see a page with details
2. Copy the "Internal Integration Token" (starts with `secret_`)
3. Save this token - you'll need it for configuration

### 2.3 Share Database with Integration
1. Go to your tasks database
2. Click "Share" in the top right
3. Click "Add people, emails, groups, or integrations"
4. Search for your integration name
5. Select it and give it "Can read" permissions
6. Click "Invite"

### 2.4 Get Database ID
1. Open your database in Notion
2. Look at the URL: `https://www.notion.so/your-workspace/DATABASE_ID?v=...`
3. Copy the `DATABASE_ID` part (32 characters, with hyphens)
4. Save this ID - you'll need it for configuration

## 🎨 Step 3: Configure the Widget

### 3.1 Access Setup Page
1. Open the setup page in your browser
2. You'll see a configuration panel with three tabs

### 3.2 Notion Setup Tab
Fill in the required fields:
- **Database ID**: Paste your database ID from step 2.4
- **Integration Token**: Paste your token from step 2.2
- **Course Database ID**: (Optional) If you created a course database
- **Course Token**: (Optional) Usually the same as your main token

### 3.3 Display Tab
Customize how your widget looks:
- **Widget Title**: Change from "Notification Center" to whatever you want
- **Show Title**: Toggle the title on/off
- **Show Refresh Button**: Toggle the refresh button
- **Show Filter Dropdowns**: Toggle the course/type filters
- **Sections**: Enable/disable different task sections

### 3.4 Theme Tab
Customize colors:
- **Primary Color**: Main accent color
- **Background Color**: Widget background
- **Border Color**: Border around sections
- **Text Color**: Main text color
- **Muted Text Color**: Secondary text color

### 3.5 Preview and Test
1. Click "Preview Widget" to see how it looks
2. Test with some sample tasks in your Notion database
3. Make adjustments as needed
4. Click "Complete Setup" when satisfied

## 🔗 Step 4: Embed in Notion

### 4.1 Get Embed URL
After completing setup, you'll see an embed URL like:
```
https://your-domain.com/embed.html
```

### 4.2 Add to Notion Page
1. In Notion, go to the page where you want the widget
2. Type `/embed` and select "Embed"
3. Paste your embed URL
4. Click "Embed link"

### 4.3 Resize the Widget
1. Click on the embed block
2. Drag the corners to resize
3. The widget is responsive and will adapt to different sizes

## 🎯 Step 5: Add Sample Data

### 5.1 Create Sample Tasks
Add some tasks to your Notion database to test:

| Name | Due | Type | Worth % | Done |
|------|-----|------|---------|------|
| Math Homework | Today | Homework | 10 | No |
| Science Quiz | Tomorrow | Quiz | 15 | No |
| History Essay | Next Week | Essay | 25 | No |
| Lab Report | Yesterday | Lab | 20 | Yes |

### 5.2 Test the Widget
1. Refresh your Notion page with the embedded widget
2. You should see tasks organized by due date
3. Try checking off tasks in the widget
4. Verify they update in your Notion database

## 🎉 You're Done!

Your Notion Notification Center is now set up and ready to use. The widget will automatically sync with your Notion database and help you stay on top of your tasks.

### Next Steps

- Add more tasks to your database
- Customize the appearance to match your style
- Share the setup with others who might find it useful
- Consider creating different configurations for different purposes

### Tips for Best Results

- Keep your task names concise but descriptive
- Use consistent naming for task types
- Set realistic due dates
- Regularly check off completed tasks
- Use the filters to focus on specific courses or types

Happy task managing! 🎯
