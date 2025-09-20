"use client";
import { useEffect, useState } from "react";
import { Todo } from "@/data/types";
import Link from "next/link";
import { createClient } from "@/supabase/client";
import { fetchAvatars, fetchTodos } from "@/actions/fetchData";
import { deleteTodoFromDB } from "@/actions/deleteData";
import { insertTodos } from "@/actions/insertData";
import { updateCompletedTodoInDB, updateTodoInDB } from "@/actions/updateData";
import ProfileCom from "./ProfileCom";

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">(
    "active"
  );
  const [avatar, setAvatar] = useState<string>("");

  // Add new todo or save edited todo
  const handleSubmit = async () => {
    const {
      data: { user },
    } = await createClient().auth.getUser();

    if (inputValue.trim() !== "") {
      if (editingId) {
        // Save edited todo
        updateTodoInDB(editingId, inputValue).then(() => {
          setTodos(
            todos.map((todo) =>
              todo.user_table_id === editingId
                ? { ...todo, todo_content: inputValue }
                : todo
            )
          );
          setInputValue("");
          setEditingId(null);
        });
      } else {
        // Add new todo
        insertTodos(inputValue, user!.id);
        setInputValue("");
      }
    }
  };

  // Start editing a todo
  const startEdit = (todo: Todo) => {
    setInputValue(todo.todo_content);
    setEditingId(todo.user_table_id);
  };

  // Cancel editing
  const cancelEdit = () => {
    setInputValue("");
    setEditingId(null);
  };

  const toggleTodo = (id: string, completed: boolean) => {
    updateCompletedTodoInDB(id, !completed);
  };

  const deleteTodo = (id: string) => {
    deleteTodoFromDB(id);
    // If we're deleting the todo we're editing, cancel edit mode
    if (editingId === id) {
      cancelEdit();
    }
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed_todos));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed_todos;
    if (filter === "completed") return todo.completed_todos;
    return true;
  });

  useEffect(() => {
    // Display todos and avatars on initial load
    fetchTodos().then((data) => setTodos(data));

    // Avatar display on initial load
    fetchAvatars().then((profileUrl) => {
      if (profileUrl) {
        setAvatar(profileUrl);
      }
    });
  }, []);

  // Realtime subscription effect
  useEffect(() => {
    // listen for changes in the todos table
    const todosSubscription = createClient()
      .channel("todosChannel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todo_content" },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              setTodos((prev) => [...prev, payload.new as Todo]);
              break;

            case "UPDATE":
              // Use functional update to avoid dependency on todos
              setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                  todo.user_table_id === (payload.new as Todo).user_table_id
                    ? (payload.new as Todo)
                    : todo
                )
              );
              break;

            case "DELETE":
              setTodos((prev) =>
                prev.filter(
                  (todo) =>
                    todo.user_table_id !== (payload.old as Todo).user_table_id
                )
              );
              break;
          }
        }
      );
    todosSubscription.subscribe();

    // const avatarSubscription = createClient()
    //   .channel("avatarChannel")
    //   .on("storage", { event: "*", bucket: "avatar" }, (payload) => {
    //     switch (payload.eventType) {
    //       case "OBJECT_CREATED":

    //         break;

    //       default:
    //         break;
    //     }
    //   });

    return () => {
      todosSubscription.unsubscribe();
    };
  }, []);

  const activeTodosCount = todos.filter((todo) => !todo.completed_todos).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-200 to-fuchsia-400 py-8 px-2 sm:px-6 lg:px-8">
      <Link href="/profile/22">
        <ProfileCom size="12" avatarUrl={avatar} />
      </Link>
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Todo App</h1>
          <p className="text-amber-900 font-semibold">
            Organize your tasks efficiently
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={
                editingId ? "Edit your todo" : "What needs to be done?"
              }
              className="flex-grow w-full px-3 py-3 border border-gray-200 rounded-l-lg"
            />
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-br from-fuchsia-200 to-fuchsia-400  hover:bg-fuchsia-700 text-neutral-800 px-3 py-1 rounded-r-md font-semibold transition duration-200"
            >
              {editingId ? "Save" : "Add"}
            </button>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md font-medium ml-0.5 transition duration-200"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {todos.length === 0
                  ? "No todos yet. Add one above!"
                  : "No todos match this filter."}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredTodos.map((todo) => (
                  <li
                    key={todo.user_table_id}
                    className="px-4 py-3 flex items-center group"
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed_todos}
                      onChange={() =>
                        toggleTodo(todo.user_table_id, todo.completed_todos)
                      }
                      className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span
                      className={`ml-3 flex-grow ${
                        todo.completed_todos
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {todo.todo_content}
                    </span>
                    <div className="opacity-100 transition-opacity flex">
                      <button
                        onClick={() => startEdit(todo)}
                        className="text-indigo-700  ml-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.user_table_id)}
                        className="text-red-700  ml-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {todos.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <span className="text-gray-600 mb-4 sm:mb-0">
                {activeTodosCount} item{activeTodosCount !== 1 ? "s" : ""} left
              </span>

              <div className="flex space-x-2 mb-4 sm:mb-0">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 rounded-lg ${
                    filter === "all"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("active")}
                  className={`px-3 py-1 rounded-lg ${
                    filter === "active"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-3 py-1 rounded-lg ${
                    filter === "completed"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Completed
                </button>
              </div>

              <button
                onClick={clearCompleted}
                className="text-gray-600 hover:text-indigo-700"
              >
                Clear completed
              </button>
            </div>
          )}
        </div>

        <div className="text-center text-gray-600 text-sm">
          <p>Click on a todo to edit it</p>
        </div>
      </div>
    </div>
  );
};

export default Todos;
