// Documents functionality
let documents = JSON.parse(localStorage.getItem('documents')) || [];
let currentDocumentId = null;
let autoSaveTimer = null;

document.addEventListener('DOMContentLoaded', function() {
    initDocuments();
});

function initDocuments() {
    const createDocumentBtn = document.getElementById('create-document-btn');
    const backToDocumentsBtn = document.getElementById('back-to-documents');
    const documentTitle = document.getElementById('document-title');
    const documentContent = document.getElementById('document-content');
    const toolbarButtons = document.querySelectorAll('.toolbar-btn');

    createDocumentBtn.addEventListener('click', createNewDocument);
    backToDocumentsBtn.addEventListener('click', backToDocumentsList);

    // Toolbar buttons
    toolbarButtons.forEach(button => {
        button.addEventListener('click', () => {
            const command = button.dataset.command;
            const value = button.dataset.value;

            if (command === 'formatBlock') {
                document.execCommand(command, false, value);
            } else {
                document.execCommand(command, false, null);
            }

            documentContent.focus();
        });
    });

    // Auto-save on content change
    documentTitle.addEventListener('input', () => {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(saveCurrentDocument, 1000);
    });

    documentContent.addEventListener('input', () => {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(saveCurrentDocument, 1000);
    });
}

function renderDocuments() {
    const documentsList = document.getElementById('documents-list');
    documentsList.innerHTML = '';

    if (documents.length === 0) {
        documentsList.innerHTML = '<p style="text-align: center; color: #b0b0b0; padding: 2rem;">No documents yet. Create your first document!</p>';
        return;
    }

    documents.forEach(doc => {
        const docCard = document.createElement('div');
        docCard.className = 'document-card';
        docCard.innerHTML = `
            <h3>${doc.title || 'Untitled Document'}</h3>
            <p>Last edited: ${formatLastEdited(doc.lastEdited)}</p>
        `;

        docCard.addEventListener('click', () => openDocument(doc.id));
        documentsList.appendChild(docCard);
    });
}

function createNewDocument() {
    const newDoc = {
        id: Date.now(),
        title: 'Untitled Document',
        content: '',
        lastEdited: new Date().toISOString()
    };

    documents.push(newDoc);
    localStorage.setItem('documents', JSON.stringify(documents));
    openDocument(newDoc.id);
}

function openDocument(id) {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    currentDocumentId = id;

    document.getElementById('document-title').value = doc.title;
    document.getElementById('document-content').innerHTML = doc.content;
    document.getElementById('document-last-edited').textContent = formatLastEdited(doc.lastEdited);

    // Show editor, hide list
    document.getElementById('documents-page').style.display = 'none';
    document.getElementById('document-editor').style.display = 'block';
}

function backToDocumentsList() {
    saveCurrentDocument();
    document.getElementById('document-editor').style.display = 'none';
    document.getElementById('documents-page').style.display = 'block';
    renderDocuments();
}

function saveCurrentDocument() {
    if (currentDocumentId === null) return;

    const docIndex = documents.findIndex(d => d.id === currentDocumentId);
    if (docIndex === -1) return;

    const title = document.getElementById('document-title').value.trim() || 'Untitled Document';
    const content = document.getElementById('document-content').innerHTML;

    documents[docIndex].title = title;
    documents[docIndex].content = content;
    documents[docIndex].lastEdited = new Date().toISOString();

    localStorage.setItem('documents', JSON.stringify(documents));

    // Update last edited display
    document.getElementById('document-last-edited').textContent = formatLastEdited(documents[docIndex].lastEdited);
}

function formatLastEdited(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
