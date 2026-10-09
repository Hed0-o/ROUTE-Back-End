import { Note } from "./note.model";

export class NoteBook {
  private notes: Note[] = [];

  constructor(
    public id: number,
    public title: string,
  ) {}

  addNote(note: Note): void {
    this.notes.push(note);
  }

  removeNote(noteId: number): void {
    this.notes = this.notes.filter((note) => note.id !== noteId);
  }

  getNotes(): Note[] {
    return this.notes;
  }
}
