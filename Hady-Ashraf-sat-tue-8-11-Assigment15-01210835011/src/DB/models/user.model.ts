import { NoteBook } from "./NoteBook.model";

export class User {
  private _age!: number;
  public notebooks: NoteBook[] = [];

  constructor(
    public id: number,
    public name: string,
    public email: string,
    private password: string,
    protected phone: string,
    age: number,
  ) {
    this.age = age;
  }

  verifyPassword(inputPassword: string): boolean {
    return this.password === inputPassword;
  }
  get age(): number {
    return this._age;
  }
  set age(value: number) {
    if (value < 18 || value > 60) {
      throw new Error("Age must be between 18 and 60.");
    }
    this._age = value;
  }
  addNotebook(notebook: NoteBook): void {
    this.notebooks.push(notebook);
  }
  removeNotebook(notebookId: number): void {
    this.notebooks = this.notebooks.filter((nb) => nb.id !== notebookId);
  }
  displayInfo(): void {
    console.log(
      `[User] ID: ${this.id} | Name: ${this.name} | Email: ${this.email} | Phone: ${this.phone} | Age: ${this.age}`,
    );
  }
}
