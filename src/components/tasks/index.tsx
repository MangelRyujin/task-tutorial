import { useEffect, useState } from "react";
import TasksChat from "./chat";
import TasksList from "./list";
import { Task } from "./types";
import { createTask, deleteTask, getAllTasks } from "./actions";
import { addToast } from "@heroui/react";

export default function TasksSection() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
      const data = await getAllTasks();
      setTasks(data);
      setLoading(false);
  };

  const handelDelete = async (id: string) => {
    await deleteTask(id);
    addToast({ title: `Remove task id: ${id}`, color: "success", shouldShowTimeoutProgress: true, timeout: 3000 });
    load();
  };

  const handelCreate = async (text: string) => {
    await createTask(text);
    addToast({ title: `Create task: ${text}`, color: "success", shouldShowTimeoutProgress: true, timeout: 3000 });
    load();
  };

  return (
    <>
      {loading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>
      ) : tasks.length == 0 ? (
        <p className="text-center text-gray-500">You don't have tasks</p>
      ) : (
        <TasksList tasks={tasks} onDelete={handelDelete} />
      )}
      <TasksChat onCreate={handelCreate} />
    </>
  );
}
