function updateNotesTable(noteId, noteTitle) {
    var table = document.getElementById("notesTable");
    var rowCount = table.rows.length;
    while (-- rowCount) {
        table.deleteRow(rowCount);
    }
    getAllNotes(noteTitle).then(data => {
        const notes = data.data.notes;
        let rowIdx = 1;
        notes.forEach(note => {
            var row = table.insertRow(rowIdx ++);
            var idAttribute = document.createAttribute("id");
            idAttribute.value = note["_id"];
            row.setAttributeNode(idAttribute);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            cell1.innerHTML = note["title"];
            cell2.innerHTML = note["content"];
            cell3.innerHTML = showDate(note["updateDate"]);
            cell4.innerHTML = `<a onclick="openEditModel('${note["_id"]}')" href="#"><img src="images/edit.png" style="width: 22px;"></a>
                                <a onclick="confirmDeleteNote('${note["_id"]}')" href="#"><img src="images/delete.png" style="width: 22px;"></a>`
        })
    }).then(() => {
        if(noteId) {
            var row = document.getElementById(noteId);
            row.setAttribute("style", "animation: new-row 5s;");
        }
    }).catch((error) => {
        console.log("error: " + error)
    });;
}

function showDate(updateDate) { 
    let date = new Date(updateDate);
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth();
    let day = date.getUTCDate();
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let st = (hours > 11 ? 'pm' : 'am');
    hours = (hours === 0 ? '00' : hours % 12);
    dateNow = `${day}-${month}-${year} ${hours}:${minutes} ${st}`;  
    return dateNow;
}

const searchNotes = () => {
    const searchTitle = document.getElementById("searchInput").value;
    updateNotesTable(undefined, searchTitle);
}

const confirmDeleteNote = (noteId) => {
    const action = confirm("Are you sure you want to delete this note?");
    if(action == true) {
        deleteNote(noteId).then(()=> {
            updateNotesTable();
        })
    }
}