import Dexie, { Table } from "dexie";
import { Experience } from "../types/experience";
import { Setting } from "../types/editor";

export class MySubClassedDexie extends Dexie {
  experiences!: Table<Experience>;
  settings!: Table<Setting>;

  constructor() {
    super("myDatabase");
    this.version(3).stores({
      experiences: "&id, name, createdAt, url, folder",
      settings: "&id, enableBundle, esmVersion",
    });
  }
}

export const db = new MySubClassedDexie();
