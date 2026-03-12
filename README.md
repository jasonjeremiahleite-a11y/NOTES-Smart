# Royal Smart Notes

A complete web application for managing notes, documents, calendar events, and workout planning.

## Features

### ðŸ“ Notes System
- Create, edit, and delete notes
- Set due dates and priority levels (Easy, Normal, Hard/Urgent)
- Search and filter notes
- Notes automatically appear on the calendar when a due date is set

### ðŸ“„ Documents System
- Create and manage rich text documents
- Full-featured text editor with:
  - Bold, Italic, Underline formatting
  - Heading styles (H1, H2)
  - Bullet and numbered lists
- Auto-save functionality
- Last edited timestamps
- Dark mode optimized editor

### ðŸ“… Calendar System
- Monthly calendar view
- Task names displayed directly on calendar dates
- Color-coded by priority (Easy = Green, Normal = Blue, Hard = Red)
- Click on tasks to jump to the note
- Navigate between months easily

### ðŸ’ª Workout Planner
- Weekly workout planning (Monday - Sunday)
- Track exercises, muscle groups, and max reps
- Automatic set calculation (3 sets at 70-80% of max reps)
- Checkbox to mark workouts as complete
- Progress tracking system
- After 14 completed workouts:
  - Suggests rep increases (15% boost)
  - Suggests exercise progressions (e.g., Push Ups â†’ Diamond Push Ups)

## Installation

1. Download all files to a single folder
2. Open `index.html` in any modern web browser
3. No server or installation required!

## Files

- `index.html` - Main HTML structure
- `styles.css` - Complete styling with dark mode theme
- `app.js` - Core app logic and notes functionality
- `calendar.js` - Calendar rendering and interaction
- `documents.js` - Document editor functionality
- `workout.js` - Workout planner logic
- `README.md` - This file

## Usage

### Creating a Note
1. Click the "Create Note" button
2. Enter title, content, due date, and priority
3. Click "Save Note"
4. The note will appear in both the Notes page and Calendar (if a due date is set)

### Creating a Document
1. Navigate to the "Documents" page
2. Click "Create Document"
3. Use the toolbar to format your text
4. The document auto-saves as you type

### Planning Workouts
1. Navigate to the "Workout Planner" page
2. Enter exercise name, muscle group, and max reps for each day
3. The system automatically calculates your workout sets
4. Check off completed workouts
5. After 14 completions, receive progression suggestions

## Data Storage

All data is stored locally in your browser using localStorage:
- Notes
- Documents
- Workout progress

Your data persists between sessions but is specific to the browser you're using.

## Design

- Modern dark mode interface
- Royal blue and gold color scheme
- Smooth animations and transitions
- Responsive layout for all screen sizes

## Browser Compatibility

Works best in modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Free to use and modify for personal or commercial projects.

---

Built with vanilla JavaScript - no frameworks required!
