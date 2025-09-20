// todo_content table structure in the database
export interface Todo {
  user_id: string;
  user_table_id: string;
  todo_content: string;
  completed_todos: boolean;
}
