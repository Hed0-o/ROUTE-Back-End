import { User } from "./user.model";

export class Note {
  constructor(
    public id: number,
    public title: string,
    public content: string,
    public author: User,
  ) {}

  preview(): string {
    return `Note Title: ${this.title}, Note Content: ${this.content}.`;
  }
}
