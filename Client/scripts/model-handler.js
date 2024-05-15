
function openAddModel() {
    var model = document.getElementById("addNoteModel");
    var closeSpan = document.getElementById("closeAdd");
    var cancelButton = document.getElementById("cancelAddNoteBtn");

    clearAddModel();
    // closeAdd (x)
    // cancelAddNoteBtn (Cancel)
    model.style.display = "block";

    closeSpan.onclick = () => {
        model.style.display = "none";
    }

    cancelButton.onclick = () => {
        model.style.display = "none";
    }
}

function clearAddModel() {
    document.getElementById("addTitle").value = "";
    document.getElementById("addContent").value = "";
    document.getElementById("addError").innerHTML = "";
}

async function saveNewNote() {
    const titleStr = document.getElementById("addTitle").value;
    const contentStr = document.getElementById("addContent").value;
    
    let errorCnt = 0;
    if(!titleStr) errorCnt ++;
    if(!contentStr) errorCnt += 2;
    let error = null;
    if(errorCnt == 1) {
        error = 'Title Is Required';
    } else if(errorCnt == 2) {
        error = 'Content Is Required'
    } else if(errorCnt == 3) {
        error = 'Title And Content Are Required';
    }
    if(errorCnt > 0) {
        document.getElementById("addError").innerHTML = error;
        return;
    }

    const noteData = { 
        title: titleStr, 
        content: contentStr
    };

    addNote(noteData)
    .then(response => {
        // console.log(response)
        if (response.ok) {
            let model = document.getElementById("addNoteModel");
            model.style.display = "none";
            response.json().then(json => {
                var newNoteId = json["_id"];
                updateNotesTable(newNoteId);
            });
        } else {
            response.json().then(error => {
                console.log(error.message)
                document.getElementById("addError").innerHTML = error.message;
            })
        }
    })
    .catch(error => {
        // console.log(error);
        document.getElementById("addError").innerHTML = error.message;
    })
}

function openEditModel(noteId) {
    let model = document.getElementById("editNoteModel");
    let closeSpan = document.getElementById("closeEdit");
    let cancelButton = document.getElementById("cancelEditNoteBtn");

    clearAddModel();

    model.style.display = "block";

    closeSpan.onclick = () => {
        model.style.display = "none";
    }

    cancelButton.onclick = () => {
        model.style.display = "none";
    }

    loadNoteData(noteId);
}

function loadNoteData(noteId) {
    let model = document.getElementById("editNoteModel");
    let noteIdAttribute = document.createAttribute("noteid");
    noteIdAttribute.value = noteId;
    model.setAttributeNode(noteIdAttribute);
    getSingleNote(noteId).then(data => {
        const note = data.data.note;
        document.getElementById("editTitle").value = note["title"];
        document.getElementById("editContent").value = note["content"];
    });
}

function saveEditNote() {
    let model = document.getElementById("editNoteModel");
    const noteId = model.getAttribute("noteid");
    const titleStr = document.getElementById("editTitle").value;
    const contentStr = document.getElementById("editContent").value;
    const noteData = {_id: noteId, title: titleStr, content: contentStr};
    updateNote(noteData).then(response => {
        // console.log(response)
        let model = document.getElementById("editNoteModel");
        model.style.display = "none";
        updateNotesTable(noteId);
    })
    .catch(error => {
        document.getElementById("editError").innerHTML = error;
    }) 
}