// Insert data into the database
import { createClient } from "@/supabase/client";
import { toast } from "sonner";

// insert data into the todos table in the database
export async function insertTodos(todo_content: string, user_id: string) {
  const { data, error } = await createClient()
    .from("todo_content")
    .insert({
      todo_content,
      user_id,
    })
    // .single()
    .order("user_table_id", { ascending: false })
    // .eq("user_id", user_id)
    .single();

  if (error) {
    // console.error("Error inserting data:", error);
    toast.error("Error creating Todo");
    return;
  }

  return data;
}

// insert avatar into the avatar bucket in the storage

export async function insertAvatar(file: File, userName: string) {
  // Generate a unique filename to avoid collisions
  const timestamp = Date.now();
  const fileExtension = file.name.split(".").pop();
  const fileName = `${userName}-avatar-${timestamp}.${fileExtension}`;

  const { data, error } = await createClient()
    .storage.from("avatar")
    .upload(fileName, file);

  if (error) {
    console.error("Error inserting avatar:", error);
    return;
  }

  return data;
}
