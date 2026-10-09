import { User } from "./user.model";
export declare class Note {
    id: number;
    title: string;
    content: string;
    author: User;
    constructor(id: number, title: string, content: string, author: User);
    preview(): string;
}
//# sourceMappingURL=note.model.d.ts.map