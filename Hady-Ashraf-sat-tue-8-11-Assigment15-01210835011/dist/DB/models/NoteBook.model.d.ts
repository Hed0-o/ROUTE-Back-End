import { Note } from "./note.model";
export declare class NoteBook {
    id: number;
    title: string;
    private notes;
    constructor(id: number, title: string);
    addNote(note: Note): void;
    removeNote(noteId: number): void;
    getNotes(): Note[];
}
//# sourceMappingURL=noteBook.model.d.ts.map