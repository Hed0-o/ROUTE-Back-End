import { User } from "./user.model";
import { Note } from "./note.model";
export class Admin extends User {
    constructor(id, name, email, password, phone, age) {
        super(id, name, email, password, phone, age);
    }
    // Method لإدارة النوتات (تعديل محتواها كـ Admin)
    manageNotes(note, newContent) {
        note.content = newContent;
        console.log(`Admin '${this.name}' updated Note #${note.id}`);
    }
}
//# sourceMappingURL=admin.model.js.map