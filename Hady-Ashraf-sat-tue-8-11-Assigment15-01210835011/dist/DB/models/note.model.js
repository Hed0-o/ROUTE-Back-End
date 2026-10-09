import { User } from "./user.model";
export class Note {
    id;
    title;
    content;
    author;
    // 👈 اتأكد إن export مكتوبة قبل class مش default
    constructor(id, title, content, author) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
    }
    preview() {
        return this.content.length > 20
            ? `${this.content.substring(0, 20)}...`
            : this.content;
    }
}
//# sourceMappingURL=note.model.js.map