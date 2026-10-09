import { Note } from "./note.model";
export class NoteBook {
    id;
    title;
    // Composition: الكشكول بيحتوي على قائمة من الـ Notes
    notes = [];
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }
    addNote(note) {
        this.notes.push(note);
    }
    removeNote(noteId) {
        this.notes = this.notes.filter((note) => note.id !== noteId);
    }
    getNotes() {
        return this.notes;
    }
}
//# sourceMappingURL=noteBook.model.js.map