// Update the todo item in the database

import { createClient } from "@/supabase/client";

export async function updateTodoInDB(id: string, newContent: string) {
  const { data, error } = await createClient()
    .from("todo_content")
    .update({ todo_content: newContent })
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error updating data:", error);
    return;
  }

  return data;
}

// Update the completed status of a todo item in the database

export async function updateCompletedTodoInDB(id: string, completed: boolean) {
  const { data, error } = await createClient()
    .from("todo_content")
    .update({ completed_todos: completed })
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error updating data:", error);
    return;
  }

  return data;
}
