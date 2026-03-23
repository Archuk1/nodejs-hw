import {Note} from '../models/note.js';
import createHttpError from 'http-errors';

export const getNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
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
      new: true,  
      runValidators: true 
    }
  );

  if (!updatedNote) {
    throw createHttpError(404, "Note not found");
  }

  res.status(200).json(updatedNote);
};