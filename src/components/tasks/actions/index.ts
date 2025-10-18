import { Task } from "../types";

const STORAGE_KEY = "tasks";

function readTasks() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function writeTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export async function getAllTasks() {
  // simulamos comportamiento async
  return Promise.resolve(readTasks());
}

export async function deleteTask(id: string) {
  const tasks = readTasks();
  const filtered = tasks.filter((t: Task) => t.id !== id);
  writeTasks(filtered);
  return Promise.resolve({ success: true });
}

export async function createTask(title: string) {
  const tasks = readTasks();
  const newTask = {
    id: crypto.randomUUID(),
    title,
    created_at: new Date().toISOString(),
  };
  tasks.push(newTask);
  writeTasks(tasks);
  return Promise.resolve(newTask);
}