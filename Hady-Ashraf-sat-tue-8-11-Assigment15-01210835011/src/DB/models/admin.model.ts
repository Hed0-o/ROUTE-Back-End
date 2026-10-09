import { User } from "./user.model";
import { Note } from "./note.model";

export class Admin extends User {
  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number,
  ) {
    super(id, name, email, password, phone, age);
  }

  manageNotes(note: Note, newContent: string): void {
    note.content = newContent;
    console.log(`Admin '${this.name}' updated Note #${note.id}`);
  }
}
