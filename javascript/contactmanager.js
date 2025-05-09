// Add Contact
document.getElementById('add-contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const contactData = {
        name: e.target.name.value,
        email: e.target.email.value,
        birthday: e.target.birthday.value,
        interest: e.target.interest.value,
        chessExperience: e.target.chessExperience.value,
        message: e.target.message.value
    };

    try {
        const response = await fetch('http://localhost:3000/api/mycontactinfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });

        const result = await response.json();
        showStatusMessage(result.message || result.error, response.ok ? 'success' : 'error');

        // Clear form on successful submission
        if (response.ok) {
            e.target.reset();
        }
    } catch (error) {
        console.error('Error adding contact:', error);
        showStatusMessage('Error adding contact. Please try again.', 'error');
    }
});

// Search Contact
document.getElementById('search-btn').addEventListener('click', async () => {
    const name = document.getElementById('search-name').value;
    if (!name || name.trim() === '') {
        showStatusMessage('Please enter a name to search', 'error');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/mycontactinfo/${name}`);

        // Parse the response data
        const data = await response.json();

        // If there was an error
        if (!response.ok) {
            showStatusMessage(data.error || 'Error searching for contacts', 'error');
            document.getElementById('search-results').innerHTML = '';
            return;
        }

        // Display the results
        displaySearchResults(data);
    } catch (error) {
        console.error('Error searching for contacts:', error);
        showStatusMessage('Error searching for contacts. Please try again.', 'error');
    }
});

// Update Contact
document.getElementById('update-contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = e.target.id.value.trim();
    const name = e.target.name.value.trim();

    if (!id && !name) {
        showStatusMessage('Please enter either an ID or a Name to update.', 'error');
        return;
    }

    const updatedData = {
        email: e.target.email.value,
        birthday: e.target.birthday.value,
        interest: e.target.interest.value,
        chessExperience: e.target.chessExperience.value,
        message: e.target.message.value
    };

    // If name is provided, add it to updatedData when using ID route
    if (id) {
        updatedData.name = name;
    }

    // If ID is provided, update by ID, otherwise update by name
    let url;
    if (id) {
        url = `http://localhost:3000/api/mycontactinfo/${id}`;
    } else {
        url = `http://localhost:3000/api/mycontactinfo/name/${name}`;
    }

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();
        showStatusMessage(result.message || result.error, response.ok ? 'success' : 'error');

        // Clear form on successful update
        if (response.ok) {
            e.target.reset();
        }
    } catch (error) {
        console.error('Error updating contact:', error);
        showStatusMessage('Error updating contact. Please try again.', 'error');
    }
});

// Delete Contact
document.getElementById('delete-btn').addEventListener('click', async () => {
    const id = document.getElementById('delete-id').value.trim();
    const name = document.getElementById('delete-name').value.trim();

    if (!id && !name) {
        showStatusMessage('Please enter either an ID or a Name to delete.', 'error');
        return;
    }

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete ${name || id}?`)) {
        return;
    }

    try {
        let url;

        // If name is provided, use the /name/:name route
        if (name) {
            url = `http://localhost:3000/api/mycontactinfo/name/${name}`;
            console.log(`Deleting by name: ${name}, URL: ${url}`);
        } else {
            url = `http://localhost:3000/api/mycontactinfo/${id}`;
            console.log(`Deleting by ID: ${id}, URL: ${url}`);
        }

        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        console.log('Delete response status:', response.status);
        const result = await response.json();
        console.log('Delete response data:', result);

        showStatusMessage(result.message || result.error, response.ok ? 'success' : 'error');

        // Clear inputs on successful deletion
        if (response.ok) {
            document.getElementById('delete-id').value = '';
            document.getElementById('delete-name').value = '';
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        showStatusMessage('Error deleting contact. Please try again.', 'error');
    }
});

// Helper function to display search results
function displaySearchResults(contacts) {
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = '';

    contacts.forEach(contact => {
        const div = document.createElement('div');
        div.className = 'contact-result';
        div.innerHTML = `
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email || 'N/A'}</p>
            ${contact.birthday ? `<p><strong>Birthday:</strong> ${new Date(contact.birthday).toLocaleDateString()}</p>` : ''}
            ${contact.interest ? `<p><strong>Interest:</strong> ${contact.interest}</p>` : ''}
            ${contact.chessExperience ? `<p><strong>Chess Experience:</strong> ${contact.chessExperience}</p>` : ''}
            ${contact.message ? `<p><strong>Message:</strong> ${contact.message}</p>` : ''}
            <div class="contact-actions">
                <button class="edit-btn" data-name="${contact.name}">Edit</button>
                <button class="delete-btn" data-name="${contact.name}">Delete</button>
            </div>
        `;
        resultsDiv.appendChild(div);
    });

    // Add event listeners to the edit and delete buttons
    document.querySelectorAll('.contact-result .edit-btn').forEach(button => {
        button.addEventListener('click', function () {
            const name = this.getAttribute('data-name');
            document.getElementById('update-contact-form').name.value = name;
            document.getElementById('update-contact-form').scrollIntoView({ behavior: 'smooth' });
        });
    });

    document.querySelectorAll('.contact-result .delete-btn').forEach(button => {
        button.addEventListener('click', async function () {
            const name = this.getAttribute('data-name');
            if (confirm(`Are you sure you want to delete ${name}?`)) {
                try {
                    const response = await fetch(`http://localhost:3000/api/mycontactinfo/name/${name}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' }
                    });

                    const result = await response.json();
                    showStatusMessage(result.message || result.error, response.ok ? 'success' : 'error');

                    if (response.ok) {
                        // Refresh the search results
                        document.getElementById('search-btn').click();
                    }
                } catch (error) {
                    console.error('Error deleting contact:', error);
                    showStatusMessage('Error deleting contact. Please try again.', 'error');
                }
            }
        });
    });
}

// Helper function to show status messages
function showStatusMessage(message, type = 'info') {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    statusDiv.className = type;
    statusDiv.style.display = 'block';

    // Scroll to the message
    statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Clear message after 3 seconds
    setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = '';
        statusDiv.style.display = 'none';
    }, 3000);
}

// Add some basic CSS for better UI
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .contact-result {
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        .contact-result p {
            margin: 5px 0;
        }
        .contact-actions {
            margin-top: 10px;
        }
        .contact-actions button {
            padding: 5px 10px;
            margin-right: 5px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        .contact-actions .edit-btn {
            background-color: #4CAF50;
            color: white;
        }
        .contact-actions .delete-btn {
            background-color: #f44336;
            color: white;
        }
        #status-message {
            padding: 10px;
            margin: 15px 0;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
        }
        #status-message.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        #status-message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        #status-message.info {
            background-color: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
    `;
    document.head.appendChild(style);
});