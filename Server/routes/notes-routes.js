const notesController = require("../controllers/notes-controller");
const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth.js");

router
  .route("/")
  .get(auth(), notesController.getAllNotes)
  .post(auth(), notesController.addNote);

router
  .route("/:noteId")
  .get(auth(), notesController.getSingleNote)
  .patch(auth(), notesController.updateNote)
  .delete(auth(), notesController.deleteNote);

module.exports = router;
