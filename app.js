// Global state
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentEditingNoteId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initNotes();
    renderNotes();
});

// Navigation
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPage = button.dataset.page;

            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update active page
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(`${targetPage}-page`).classList.add('active');

            // Refresh calendar if navigating to it
            if (targetPage === 'calendar') {
                renderCalendar();
            }

            // Refresh documents if navigating to it
            if (targetPage === 'documents') {
                renderDocuments();
            }

            // Refresh workout if navigating to it
            if (targetPage === 'workout') {
                renderWorkout();
            }
        });
    });
}

// Notes functionality
function initNotes() {
    const createNoteBtn = document.getElementById('create-note-btn');
    const noteModal = document.getElementById('note-modal');
    const closeModal = document.querySelector('.close');
    const saveNoteBtn = document.getElementById('save-note');
    const cancelNoteBtn = document.getElementById('cancel-note');
    const searchInput = document.getElementById('search-notes');
    const filterStatus = document.getElementById('filter-status');

    createNoteBtn.addEventListener('click', () => {
        currentEditingNoteId = null;
        document.getElementById('modal-title').textContent = 'Create Note';
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        document.getElementById('note-due-date').value = '';
        document.getElementById('note-priority').value = 'normal';
        noteModal.classList.add('active');
    });

    closeModal.addEventListener('click', () => {
        noteModal.classList.remove('active');
    });

    cancelNoteBtn.addEventListener('click', () => {
        noteModal.classList.remove('active');
    });

    saveNoteBtn.addEventListener('click', saveNote);

    searchInput.addEventListener('input', renderNotes);
    filterStatus.addEventListener('change', renderNotes);

    // Close modal on outside click
    noteModal.addEventListener('click', (e) => {
        if (e.target === noteModal) {
            noteModal.classList.remove('active');
        }
    });
}

function saveNote() {
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-content').value.trim();
    const dueDate = document.getElementById('note-due-date').value;
    const priority = document.getElementById('note-priority').value;

    if (!title) {
        alert('Please enter a title');
        return;
    }

    if (currentEditingNoteId !== null) {
        // Edit existing note
        const noteIndex = notes.findIndex(n => n.id === currentEditingNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex] = {
                ...notes[noteIndex],
                title,
                content,
                dueDate,
                priority
            };
        }
    } else {
        // Create new note
        const note = {
            id: Date.now(),
            title,
            content,
            dueDate,
            priority,
            createdAt: new Date().toISOString()
        };
        notes.push(note);
    }

    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
    document.getElementById('note-modal').classList.remove('active');
}

function renderNotes() {
    const notesList = document.getElementById('notes-list');
    const searchQuery = document.getElementById('search-notes').value.toLowerCase();
    const filterValue = document.getElementById('filter-status').value;

    let filteredNotes = notes;

    // Apply search filter
    if (searchQuery) {
        filteredNotes = filteredNotes.filter(note =>
            note.title.toLowerCase().includes(searchQuery) ||
            note.content.toLowerCase().includes(searchQuery)
        );
    }

    // Apply status filter
    if (filterValue !== 'all') {
        filteredNotes = filteredNotes.filter(note => note.priority === filterValue);
    }

    notesList.innerHTML = '';

    filteredNotes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = `note-card ${note.priority}`;

        noteCard.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content || 'No content'}</p>
            ${note.dueDate ? `<p style="color: #ffd700; font-size: 0.9rem;">Due: ${formatDate(note.dueDate)}</p>` : ''}
            <div class="note-meta">
                <span class="note-priority ${note.priority}">${note.priority.toUpperCase()}</span>
                <div class="note-actions">
                    <button onclick="editNote(${note.id})">âœï¸ Edit</button>
                    <button onclick="deleteNote(${note.id})">ðŸ—‘ï¸ Delete</button>
                </div>
            </div>
        `;

        notesList.appendChild(noteCard);
    });

    if (filteredNotes.length === 0) {
        notesList.innerHTML = '<p style="text-align: center; color: #b0b0b0; padding: 2rem;">No notes found</p>';
    }
}

function editNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    currentEditingNoteId = id;
    document.getElementById('modal-title').textContent = 'Edit Note';
    document.getElementById('note-title').value = note.title;
    document.getElementById('note-content').value = note.content;
    document.getElementById('note-due-date').value = note.dueDate;
    document.getElementById('note-priority').value = note.priority;
    document.getElementById('note-modal').classList.add('active');
}

function deleteNote(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(n => n.id !== id);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Export for calendar
window.notes = notes;
window.formatDate = formatDate;
