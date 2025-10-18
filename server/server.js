import express from "express";
import fetch from "node-fetch";
import "dotenv/config";
import { loadTasks, saveTasks } from "./tasks.js";

const app = express();
app.use(express.json());

app.post("/api/tasks", (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Missing title" });
  }

  const tasks = loadTasks();
  const newTask = {
    id: Date.now().toString(),
    title,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasks(tasks);

  res.status(201).json(newTask);
});

app.get("/api/tasks", (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  let tasks = loadTasks();

  const exists = tasks.some((t) => t.id === id);
  if (!exists) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks = tasks.filter((t) => t.id !== id);
  saveTasks(tasks);

  res.json({ message: "Task deleted successfully" });
});

app.post("/api/chatbot", async (req, res) => {
  const { text, lang } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing text" });
  }

  try {
    const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;
    const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

    if (!CLOUDFLARE_API_KEY || !ACCOUNT_ID) {
      return res.status(500).json({ error: "Cloudflare credentials missing" });
    }

    // 🔹 Stricter prompt so it only returns the task
    let customPrompt = "";
    console.log(lang)
    if (lang === "es-PE") {
      customPrompt = `
Convierte el siguiente texto en un **nombre breve pero descriptivo de tarea (5 a 15 palabras)**.
- Responde en el mismo idioma del texto (español).
- No expliques.
- No uses comillas ni adornos.
- Incluye acción + objeto + contexto si aplica.
- Si el texto menciona una fecha u hora, inclúyela tal cual en la tarea.

Ejemplos:
Entrada: "Crear un sistema de login con JWT"
Salida: Crear sistema de login JWT

Entrada: "Implementar base de datos con PostgreSQL para usuarios"
Salida: Configurar base de datos usuarios PostgreSQL

Entrada: "Mañana debería de recoger a Marcos en la escuela"
Salida: Recoger a Marcos en la escuela mañana

Entrada: "Reunión con Juan el viernes a las 5pm"
Salida: Reunión con Juan viernes 5pm

Texto: ${text}
      `;
    } else {
      customPrompt = `
Convert the following text into a **short but descriptive task name (5 to 15 words)**.
- Answer in the same language as the input text (English).
- Do not explain.
- Do not use quotes or extra words.
- Include action + object + context if relevant.
- If the text mentions a date or time, include it as part of the task.

Examples:
Input: "Build a login system with JWT"
Output: Build login system with JWT

Input: "Implement a PostgreSQL database for user management"
Output: Setup PostgreSQL user database

Input: "Tomorrow I should pick up Marcos at school"
Output: Pick up Marcos at school tomorrow

Input: "Meeting with John on Friday at 5pm"
Output: Meeting with John Friday 5pm

Text: ${text}
      `;
    }

    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: customPrompt }),
      }
    );

    const data = await cfRes.json();

    if (!cfRes.ok) {
      console.error("Error Cloudflare:", data);
      return res
        .status(500)
        .json({ error: "Cloudflare API failed", details: data });
    }

    // 🔹 Clean response (remove line breaks, quotes, extra spaces)
    const task =
      data?.result?.response?.trim().replace(/^["']|["']$/g, "") || text;

    res.json({ task });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Error processing request" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Backend corriendo en http://localhost:3000");
});
