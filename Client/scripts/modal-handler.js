function openAddModal() {
  var modal = document.getElementById("addNoteModal");
  var closeSpan = document.getElementById("closeAdd");
  var cancelButton = document.getElementById("cancelAddNoteBtn");

  clearAddModal();
  // closeAdd (x)
  // cancelAddNoteBtn (Cancel)
  modal.style.display = "block";

  closeSpan.onclick = () => {
    modal.style.display = "none";
  };

  cancelButton.onclick = () => {
    modal.style.display = "none";
  };
}

function clearAddModal() {
  document.getElementById("addTitle").value = "";
  document.getElementById("addContent").value = "";
  document.getElementById("addError").innerHTML = "";
}

async function saveNewNote() {
  const titleStr = document.getElementById("addTitle").value;
  const contentStr = document.getElementById("addContent").value;

  let errorCnt = 0;
  if (!titleStr) errorCnt++;
  if (!contentStr) errorCnt += 2;
  let error = null;
  if (errorCnt == 1) {
    error = "Title Is Required";
  } else if (errorCnt == 2) {
    error = "Content Is Required";
  } else if (errorCnt == 3) {
    error = "Title And Content Are Required";
  }
  if (errorCnt > 0) {
    document.getElementById("addError").innerHTML = error;
    return;
  }

  const noteData = {
    title: titleStr,
    content: contentStr,
  };

  addNote(noteData)
    .then((response) => {
      if (response.ok) {
        let modal = document.getElementById("addNoteModal");
        modal.style.display = "none";
        response.json().then((json) => {
          var newNoteId = json["_id"];
          updateNotesTable(newNoteId);
        });
      } else {
        response.json().then((error) => {
          // console.log(error.message);
          document.getElementById("addError").innerHTML = error.message;
        });
      }
    })
    .catch((error) => {
      // console.log(error);
      document.getElementById("addError").innerHTML = error.message;
    });
}

function openEditModal(noteId) {
  let modal = document.getElementById("editNoteModal");
  let closeSpan = document.getElementById("closeEdit");
  let cancelButton = document.getElementById("cancelEditNoteBtn");

  clearAddModal();

  modal.style.display = "block";

  closeSpan.onclick = () => {
    modal.style.display = "none";
  };

  cancelButton.onclick = () => {
    modal.style.display = "none";
  };

  loadNoteData(noteId);
}

function loadNoteData(noteId) {
  let modal = document.getElementById("editNoteModal");
  let noteIdAttribute = document.createAttribute("noteid");
  noteIdAttribute.value = noteId;
  modal.setAttributeNode(noteIdAttribute);
  getSingleNote(noteId).then((data) => {
    const note = data.data.note;
    document.getElementById("editTitle").value = note["title"];
    document.getElementById("editContent").value = note["content"];
  });
}

function saveEditNote() {
  let modal = document.getElementById("editNoteModal");
  const noteId = modal.getAttribute("noteid");
  const titleStr = document.getElementById("editTitle").value;
  const contentStr = document.getElementById("editContent").value;
  const noteData = {
    _id: noteId,
    title: titleStr,
    content: contentStr,
  };
  updateNote(noteData)
    .then((response) => {
      // console.log(response)
      let modal = document.getElementById("editNoteModal");
      modal.style.display = "none";
      updateNotesTable(noteId);
    })
    .catch((error) => {
      document.getElementById("editError").innerHTML = error;
    });
}
