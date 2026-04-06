import {Note} from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
 const {search, tag,page ,perPage} = req.query;

  const notesQuery = Note.find({userId: req.user._id});
  
  const skip = (page - 1) * perPage;

  if (search) {
    notesQuery.where({$text: {$search: search}});
  };

  if (tag) {
    notesQuery.where("tag").equals(tag);
  };

  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage)
  ]);

  const totalPages = Math.ceil(totalNotes/perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes
});
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({_id: noteId, userId: req.user._id});

  if (!note) {
      throw createHttpError(404, 'Note not found');
    }


  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create({...req.body, userId: req.user._id});
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  const deletedNote = await Note.findOneAndDelete({_id: noteId, userId: req.user._id});

  if (!deletedNote) {
    throw createHttpError(404, "Note not found");
  }

  res.status(200).json(deletedNote);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const updateData = req.body;

  const updatedNote = await Note.findOneAndUpdate(
    {_id: noteId, userId: req.user._id},
    updateData,
    {
      returnDocument: 'after',
      runValidators: true 
    }
  );

  if (!updatedNote) {
    throw createHttpError(404, "Note not found");
  }

  res.status(200).json(updatedNote);
};