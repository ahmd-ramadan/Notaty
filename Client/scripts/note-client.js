const baseUrl = "https://notaty-6ryr.onrender.com";

async function addNote(noteData) {
    const response = await fetch(`${baseUrl}/notes`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(noteData)
    });
    return response;
}

async function updateNote(noteData) {
    const noteId = noteData._id;
    const response = await fetch(`${baseUrl}/notes/${noteId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(noteData)
    });
    return response.json();
}

async function deleteNote(noteId) {
    const response = await fetch(`${baseUrl}/notes/${noteId}`, {
        method: "DELETE",
    })
    return response;
}

async function getSingleNote(noteId) {
    const response = await fetch(`${baseUrl}/notes/${noteId}`);
    return response.json();
}

async function getAllNotes(noteTitle) {
    let url = `${baseUrl}/notes`;
    if(noteTitle) {
        url += `?title=${noteTitle}`;
    }
    const response = await fetch(url);
    return response.json();
}