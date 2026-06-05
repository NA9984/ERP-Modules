"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AppLayout from "../components/layout/AppLayout";

import { API_BASE_URL } from "../services/api";

type TodoItem = {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  isDone: boolean;
  location: string;
};

export default function TodoPage() {
  const [todos, setTodos] =
    useState<TodoItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const [form, setForm] =
    useState({
      name: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
    });

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      setLoading(true);

      const response =
        await fetch(
          `${API_BASE_URL}/api/app/todo`
        );

      if (!response.ok) {
        throw new Error(
          "Failed to load todos"
        );
      }

      const data =
        await response.json();

      setTodos(data || []);
    } catch (error) {
      console.error(error);

      alert(
        "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  }

  async function createTodo() {
    try {
      if (!form.name.trim()) {
        alert(
          "Task name required"
        );

        return;
      }

      setSaving(true);

      const response =
        await fetch(
          `https://tulip.rubik-webtel.in/api/app/todo`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name: form.name,
              description:
                form.description,
              startTime:
                form.startTime,
              endTime:
                form.endTime,
              location:
                form.location,
              isDone: false,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Create failed"
        );
      }

      setForm({
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
      });

      loadTodos();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to create task"
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleTodo(
    todo: TodoItem
  ) {
    try {
      const response =
        await fetch(
          `${API_BASE_URL}/api/app/todo/${todo.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              ...todo,
              isDone:
                !todo.isDone,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Update failed"
        );
      }

      loadTodos();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update"
      );
    }
  }

  async function deleteTodo(
    id: string
  ) {
    const confirmed =
      confirm(
        "Delete this task?"
      );

    if (!confirmed) return;

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/api/app/todo/${id}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {
        throw new Error(
          "Delete failed"
        );
      }

      loadTodos();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to delete"
      );
    }
  }

  const filteredTodos =
    useMemo(() => {
      return todos.filter(
        (todo) => {
          const matchesSearch =
            todo.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesFilter =
            filter === "All"
              ? true
              : filter ===
                "Completed"
              ? todo.isDone
              : !todo.isDone;

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      todos,
      search,
      filter,
    ]);

  const pendingCount =
    todos.filter(
      (x) => !x.isDone
    ).length;

  const completedCount =
    todos.filter(
      (x) => x.isDone
    ).length;

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* HEADER */}

        <div className="erp-card rounded-3xl border erp-border p-6 shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                ● Smart Task
                Workspace
              </div>

              <h1 className="text-3xl font-black text-gray-900 mt-3">
                Todo Manager
              </h1>

              <p className="text-gray-500 mt-2">
                Plan, track and
                complete your daily
                ERP activities.
              </p>
            </div>
          </div>

          {/* CREATE */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 mt-6">
            <input
              type="text"
              placeholder="Task name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name:
                    e.target.value,
                })
              }
              className="border erp-border erp-page rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Description"
              value={
                form.description
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
              className="border erp-border erp-page rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="datetime-local"
              value={
                form.startTime
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  startTime:
                    e.target.value,
                })
              }
              className="border erp-border erp-page rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="datetime-local"
              value={
                form.endTime
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  endTime:
                    e.target.value,
                })
              }
              className="border erp-border erp-page rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              disabled={saving}
              onClick={createTodo}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition disabled:bg-gray-400"
            >
              {saving
                ? "Saving..."
                : "Create Task"}
            </button>
          </div>

          <div className="mt-3">
            <input
              type="text"
              placeholder="Location"
              value={
                form.location
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  location:
                    e.target.value,
                })
              }
              className="w-full border erp-border erp-page rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* FILTERS */}

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search task..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="flex-1 border erp-border erp-card rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value
              )
            }
            className="border erp-border erp-card rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>
              All
            </option>

            <option>
              Pending
            </option>

            <option>
              Completed
            </option>
          </select>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="erp-card rounded-2xl border erp-border p-5 shadow-sm">
            <div className="text-sm text-gray-500">
              Total Tasks
            </div>

            <div className="text-3xl font-black text-gray-900 mt-2">
              {todos.length}
            </div>
          </div>

          <div className="erp-card rounded-2xl border erp-border p-5 shadow-sm">
            <div className="text-sm text-gray-500">
              Pending
            </div>

            <div className="text-3xl font-black text-yellow-600 mt-2">
              {pendingCount}
            </div>
          </div>

          <div className="erp-card rounded-2xl border erp-border p-5 shadow-sm">
            <div className="text-sm text-gray-500">
              Completed
            </div>

            <div className="text-3xl font-black text-green-600 mt-2">
              {completedCount}
            </div>
          </div>
        </div>

        {/* TASKS */}

        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {Array.from({
              length: 6,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="erp-card h-40 rounded-3xl animate-pulse border erp-border"
                ></div>
              )
            )}
          </div>
        ) : filteredTodos.length ===
          0 ? (
          <div className="erp-card rounded-3xl border erp-border p-16 text-center shadow-sm">
            <div className="text-7xl">
              📋
            </div>

            <h2 className="text-2xl font-black text-gray-900 mt-5">
              No Tasks Found
            </h2>

            <p className="text-gray-500 mt-2">
              Create your first
              task.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredTodos.map(
              (todo) => (
                <div
                  key={todo.id}
                  className={`rounded-3xl border p-5 shadow-sm transition ${
                    todo.isDone
                      ? "bg-green-50 border-green-200"
                      : "erp-card erp-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <button
                        onClick={() =>
                          toggleTodo(
                            todo
                          )
                        }
                        className={`w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center ${
                          todo.isDone
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {todo.isDone
                          ? "✓"
                          : ""}
                      </button>

                      <div>
                        <h2
                          className={`text-xl font-black ${
                            todo.isDone
                              ? "line-through text-gray-400"
                              : "text-gray-900"
                          }`}
                        >
                          {
                            todo.name
                          }
                        </h2>

                        <p className="text-gray-500 mt-2">
                          {
                            todo.description
                          }
                        </p>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                            📍{" "}
                            {todo.location ||
                              "No location"}
                          </div>

                          <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                            ⏰{" "}
                            {new Date(
                              todo.startTime
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        deleteTodo(
                          todo.id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl text-sm font-semibold transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}