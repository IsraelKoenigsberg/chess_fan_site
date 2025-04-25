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

    const response = await fetch('http://localhost:3000/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
    });

    const result = await response.json();
    alert(result.message || result.error);
});

// Search Contact
document.getElementById('search-btn').addEventListener('click', async () => {
    const name = document.getElementById('search-name').value;
    const response = await fetch(`http://localhost:3000/api/contacts/${name}`);
    const contacts = await response.json();
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = '';
    contacts.forEach(contact => {
        const div = document.createElement('div');
        div.textContent = `${contact.name} - ${contact.email}`;
        resultsDiv.appendChild(div);
    });
});

// Update Contact
document.getElementById('update-contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = e.target.id.value;
    const name = e.target.name.value;
    const updatedData = {
        name: name,
        email: e.target.email.value,
        birthday: e.target.birthday.value,
        interest: e.target.interest.value,
        chessExperience: e.target.chessExperience.value,
        message: e.target.message.value
    };

    // If ID is provided, update by ID, otherwise update by name
    let url;
    if (id && id.trim() !== '') {
        url = `http://localhost:3000/api/contacts/${id}`;
    } else if (name && name.trim() !== '') {
        url = `http://localhost:3000/api/contacts/name/${name}`;
        // When updating by name, don't include name in the update data
        delete updatedData.name;
    } else {
        return alert('Please enter either an ID or a Name to update.');
    }

    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    });

    const result = await response.json();
    alert(result.message || result.error);
});

// Delete Contact
document.getElementById('delete-btn').addEventListener('click', async () => {
    const id = document.getElementById('delete-id').value;
    const name = document.getElementById('delete-name').value;

    if (!id && !name) return alert('Please enter either an ID or a Name to delete.');

    let url;
    if (id && id.trim() !== '') {
        url = `http://localhost:3000/api/contacts/${id}`;
    } else {
        url = `http://localhost:3000/api/contacts/name/${name}`;
    }

    const response = await fetch(url, {
        method: 'DELETE'
    });

    const result = await response.json();
    alert(result.message || result.error);
});