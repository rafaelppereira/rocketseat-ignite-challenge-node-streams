import fs from "node:fs/promises";

const databasePath = new URL("../../database/api.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table) {
    const data = this.#database[table] ?? [];
    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    const rowItem = this.#database[table].find((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        id,
        ...rowItem,
        title: data.title ? data.title : rowItem.title,
        description: data.description ? data.description : rowItem.description,
        completed_at: data.completed_at
          ? data.completed_at
          : rowItem.completed_at,
        updated_at: new Date(),
      };
      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  findUnique(table, id) {
    const rowItem = this.#database[table].find((row) => row.id === id);

    if (rowItem) {
      return rowItem;
    }

    return null;
  }
}
