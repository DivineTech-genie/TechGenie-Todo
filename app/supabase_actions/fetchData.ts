import { Todo } from "@/data/types";
import { createClient } from "@/supabase/client";

// Fetch data from the todos table in the database

export async function fetchTodos(): Promise<Todo[]> {
  const { data, error } = await createClient()
    .from("todo_content")
    .select("*")
    .order("user_table_id", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }
  return data || [];
}

// Fetch avatas from the avatar bucket in the storage
export async function fetchAvatars() {
  const { data: listData, error: listError } = await createClient()
    .storage.from("avatar")
    .list("", {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "desc" },
    });

  if (listError) {
    console.error("Error listing avatars:", listError);
    return null;
  }

  if (listData && listData.length > 0) {
    const avatarPath = listData[2].name; // Get the path of the avatar

    const { data: avatarData } = createClient()
      .storage.from("avatar")
      .getPublicUrl(avatarPath);

    if (!avatarData) {
      console.error("Error getting public URL for avatar");
      return null;
    }

    return avatarData.publicUrl; // Return the public URL of the avatar
  }
}
