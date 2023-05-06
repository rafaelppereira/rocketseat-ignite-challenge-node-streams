import { randomUUID } from "node:crypto";
import { Database } from "../services/database.js";
import { buildRoutePath } from "../utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null,
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks");
      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const findTask = database.findUnique("tasks", id);

      if (!findTask) {
        throw new Error("Task not found");
      }

      database.update("tasks", id, req.body);

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const findTask = database.findUnique("tasks", id);

      if (!findTask) {
        throw new Error("Task not found");
      }

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const findTask = database.findUnique("tasks", id);

      if (!findTask) {
        throw new Error("Task not found");
      }

      database.update("tasks", id, { completed_at: true });
      return res.writeHead(200).end();
    },
  },
];
