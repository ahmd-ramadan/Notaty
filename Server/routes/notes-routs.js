const notesController = require('../Controllers/notes-controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .get(notesController.getAllNotes)
    .post(notesController.addNote)

router.route('/:noteId')
    .get(notesController.getSingleNote)
    .patch(notesController.updateNote)
    .delete(notesController.deleteNote)

module.exports = router;