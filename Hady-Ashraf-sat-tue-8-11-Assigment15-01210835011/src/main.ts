import { User } from "./DB/models/user.model";
import { Admin } from "./DB/models/admin.model";
import { Note } from "./DB/models/note.model";
import { NoteBook } from "./DB/models/NoteBook.model";
import { Storage } from "./DB/models/genericDB";

try {
  const user1 = new User(
    1,
    "Hady Ashraf",
    "hady@example.com",
    "pass123",
    "01210835011",
    21,
  );
  user1.displayInfo();

  const admin1 = new Admin(
    2,
    "System Admin",
    "admin@example.com",
    "admin123",
    "01000000000",
    30,
  );

  const note1 = new Note(101, "Note Title", "Note Content.", user1);
  console.log("Note Preview:", note1.preview());

  const myNoteBook = new NoteBook(1, "Notes Collection");
  myNoteBook.addNote(note1);
  user1.addNotebook(myNoteBook);

  admin1.manageNotes(note1, "Updated: Updated Note.");
  console.log("Updated Preview:", note1.preview());

  const userStorage = new Storage<User>();
  userStorage.addItem(user1);
  userStorage.addItem(admin1);
  console.log("Users in Storage:", userStorage.getItems().length);
} catch (error: any) {
  console.error("Error:", error.message);
}
