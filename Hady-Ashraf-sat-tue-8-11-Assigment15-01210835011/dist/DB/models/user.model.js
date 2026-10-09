import { NoteBook } from "./noteBook.model";
export class User {
    id;
    name;
    email;
    password;
    phone;
    _age;
    notebooks = [];
    constructor(id, name, email, password, phone, age) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.age = age;
    }
    verifyPassword(inputPassword) {
        return this.password === inputPassword;
    }
    get age() {
        return this._age;
    }
    set age(value) {
        if (value < 18 || value > 60) {
            throw new Error("Age must be between 18 and 60.");
        }
        this._age = value;
    }
    addNotebook(notebook) {
        this.notebooks.push(notebook);
    }
    removeNotebook(notebookId) {
        this.notebooks = this.notebooks.filter((nb) => nb.id !== notebookId);
    }
    displayInfo() {
        console.log(`[User] ID: ${this.id} | Name: ${this.name} | Email: ${this.email} | Phone: ${this.phone} | Age: ${this.age}`);
    }
}
//# sourceMappingURL=user.model.js.map