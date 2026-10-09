import { NoteBook } from "./noteBook.model";
export declare class User {
    id: number;
    name: string;
    email: string;
    private password;
    protected phone: string;
    private _age;
    notebooks: NoteBook[];
    constructor(id: number, name: string, email: string, password: string, phone: string, age: number);
    verifyPassword(inputPassword: string): boolean;
    get age(): number;
    set age(value: number);
    addNotebook(notebook: NoteBook): void;
    removeNotebook(notebookId: number): void;
    displayInfo(): void;
}
//# sourceMappingURL=user.model.d.ts.map