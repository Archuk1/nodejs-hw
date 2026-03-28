import {Note} from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
 const {search, tag,page = 1,perPage = 10} = req.query;

  const notesQuery = Note.find();
  
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
  const note = await Note.findById(noteId);

  if (!note) {
      throw createHttpError(404, 'Note not found');
    }


  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  const deletedNote = await Note.findByIdAndDelete(noteId);

  if (!deletedNote) {
    throw createHttpError(404, "Note not found");
  }

  res.status(200).json(deletedNote);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const updateData = req.body;

  const updatedNote = await Note.findByIdAndUpdate(
    noteId,
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