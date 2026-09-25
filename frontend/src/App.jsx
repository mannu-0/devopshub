import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setLoading(true);

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      setTitle("");
      setDescription("");
      await fetchTasks();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (task) => {
    try {
      await fetch(`${API_URL}/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      await fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      await fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>DevOpsHub</h1>
          <p>Docker • Kubernetes • CI/CD</p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          API Online
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h2>Task Dashboard</h2>
          <p>Manage your DevOps learning and project tasks.</p>
        </section>

        <section className="card">
          <h3>Create New Task</h3>

          <form onSubmit={createTask}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <textarea
              placeholder="Task description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows="4"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Add Task"}
            </button>
          </form>
        </section>

        <section className="tasks-section">
          <div className="section-header">
            <h3>Your Tasks</h3>
            <span>{tasks.length} tasks</span>
          </div>

          {tasks.length === 0 ? (
            <div className="empty">
              <p>No tasks yet.</p>
              <span>Create your first DevOps task above.</span>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <article
                  className={`task ${task.completed ? "completed" : ""}`}
                  key={task._id}
                >
                  <div className="task-content">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                  </div>

                  <div className="task-actions">
                    <button onClick={() => toggleTask(task)}>
                      {task.completed ? "Undo" : "Complete"}
                    </button>

                    <button
                      className="delete"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
