import { User } from "./user.model";
import { Note } from "./note.model";
export declare class Admin extends User {
    constructor(id: number, name: string, email: string, password: string, phone: string, age: number);
    manageNotes(note: Note, newContent: string): void;
}
//# sourceMappingURL=admin.model.d.ts.map