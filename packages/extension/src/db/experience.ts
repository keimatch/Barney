import Dexie, { Table } from "dexie";
import { Experience } from "../types/experience";

export class MySubClassedDexie extends Dexie {
  experiences!: Table<Experience>;

  constructor() {
    super("myDatabase");
    this.version(2).stores({
      experiences: "&id, name, createdAt, url, folder",
    });
  }
}

export const db = new MySubClassedDexie();
