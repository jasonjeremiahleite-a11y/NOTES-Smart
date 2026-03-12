// Calendar functionality
let currentDate = new Date();

document.addEventListener('DOMContentLoaded', function() {
    initCalendar();
});

function initCalendar() {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthSpan = document.getElementById('current-month');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update month display
    currentMonthSpan.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Clear calendar
    calendarGrid.innerHTML = '';

    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Add previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayElement = createDayElement(day, year, month - 1, true);
        calendarGrid.appendChild(dayElement);
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = createDayElement(day, year, month, false);
        calendarGrid.appendChild(dayElement);
    }

    // Add next month's days to fill grid
    const totalCells = calendarGrid.children.length - 7; // Subtract headers
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElement(day, year, month + 1, true);
        calendarGrid.appendChild(dayElement);
    }
}

function createDayElement(day, year, month, isOtherMonth) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }

    const dayNumber = document.createElement('div');
    dayNumber.className = 'calendar-day-number';
    dayNumber.textContent = day;
    dayElement.appendChild(dayNumber);

    // Create date string in YYYY-MM-DD format for comparison
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Find notes for this date
    const tasksContainer = document.createElement('div');
    tasksContainer.className = 'calendar-tasks';

    if (window.notes) {
        const tasksForDay = window.notes.filter(note => note.dueDate === dateStr);

        tasksForDay.forEach(note => {
            const taskElement = document.createElement('div');
            taskElement.className = `calendar-task ${note.priority}`;
            taskElement.textContent = note.title;
            taskElement.addEventListener('click', () => {
                // Switch to notes page and highlight the note
                document.querySelector('[data-page="notes"]').click();
                setTimeout(() => {
                    const noteCards = document.querySelectorAll('.note-card');
                    noteCards.forEach(card => {
                        if (card.querySelector('h3').textContent === note.title) {
                            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            card.style.animation = 'pulse 1s';
                        }
                    });
                }, 100);
            });
            tasksContainer.appendChild(taskElement);
        });
    }

    dayElement.appendChild(tasksContainer);
    return dayElement;
}

// Add pulse animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(65, 105, 225, 0.6); }
    }
`;
document.head.appendChild(style);
