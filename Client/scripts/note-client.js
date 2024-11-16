const baseUrl = "https://notaty-6ryr.onrender.com";
// const baseUrl = "http://localhost:5000";

function getToken() {
  return `Bearer ${localStorage.getItem("token")}`;
}

async function addNote(noteData) {
  const response = await fetch(`${baseUrl}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken(),
    },
    body: JSON.stringify(noteData),
  });
  return response;
}

async function updateNote(noteData) {
  const noteId = noteData._id;
  const response = await fetch(`${baseUrl}/notes/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken(),
    },
    body: JSON.stringify(noteData),
  });
  return response.json();
}

async function deleteNote(noteId) {
  const response = await fetch(`${baseUrl}/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      Authorization: getToken(),
    },
  });
  return response;
}

async function getSingleNote(noteId) {
  const response = await fetch(`${baseUrl}/notes/${noteId}`, {
    headers: {
      Authorization: getToken(),
    },
  });
  return response.json();
}

async function getAllNotes(noteTitle) {
  let url = `${baseUrl}/notes`;
  if (noteTitle) {
    url += `?title=${noteTitle}`;
  }
  const response = await fetch(url, {
    headers: {
      Authorization: getToken(),
    },
  });
  return response.json();
}
