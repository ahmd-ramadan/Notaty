const Note = require("../models/notes-model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appErrors");
const asyncWrapper = require("../middlewares/asyncWrapper");

const getAllNotes = asyncWrapper(async (req, res, next) => {
  const { _id: userId } = req.authUser;

  let notes = [];
  if (req.query.title) {
    notes = await searchOnNotes(userId, req.query.title);
    if (notes.length < 0) {
      const error = appError.create("Could not find", 404, httpStatusText.FAIL);
      return next(error);
    }
  } else {
    notes = await Note.find({ userId }, { __v: false });
  }

  res.status(200).json({ status: httpStatusText.SUCCESS, data: { notes } });
});

const searchOnNotes = async (userId, noteTitle) => {
  const query = {
    userId,
    title: {
      $regex: new RegExp(noteTitle, "i"),
    },
  };
  const findedNotes = await Note.find(query);
  return findedNotes;
};

const getSingleNote = asyncWrapper(async (req, res, next) => {
  const note = await Note.findById(req.params.noteId);
  if (!note) {
    const error = appError.create(
      "Note Is Not Found",
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }
  res.json({ status: httpStatusText.SUCCESS, data: { note } });
});

const addNote = asyncWrapper(async (req, res, next) => {
  const { _id: userId } = req.authUser;
  const { title, content } = req.body;
  const newNote = new Note({
    userId,
    title: title,
    content: content,
    createDate: new Date(),
    updateDate: new Date(),
  });
  await newNote.save();
  res.status(201).json({ status: httpStatusText.SUCCESS, data: newNote });
});

const updateNote = asyncWrapper(async (req, res, next) => {
  const noteId = req.params.noteId;
  let note = await Note.findByIdAndUpdate(
    noteId,
    { $set: { ...req.body } },
    { new: true }
  );
  // let course = await Course.updateOne({_id: courseId}, {$set: {... req.body}})
  if (!note) {
    const error = appError.create(
      "Note IS Not Found",
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { note } });
});

const deleteNote = asyncWrapper(async (req, res, next) => {
  const noteId = req.params.noteId;
  const check = await Note.findOne({ _id: noteId });
  if (!check) {
    const error = appError.create(
      "Note Is Not Found",
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }
  await Note.deleteOne({ _id: noteId });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getAllNotes,
  getSingleNote,
  addNote,
  updateNote,
  deleteNote,
};
