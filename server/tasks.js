import fs from "fs";

const FILE_PATH = "./tasks.json";

// Cargar tareas desde archivo o inicializar vacío
export function loadTasks() {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([]));
  }
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(data);
}

// Guardar tareas en archivo
export function saveTasks(tasks) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}