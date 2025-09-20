// Delet items from the database
import { createClient } from "@/supabase/client";

// delete data from the todos table in the database

export async function deleteTodoFromDB(id: string) {
  const { data, error } = await createClient()
    .from("todo_content")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting data:", error);
    return;
  }

  return data;
}
