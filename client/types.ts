export interface User {
  email: string;
}

export interface Child {
  children: React.ReactNode;
}

export interface ServerResponse<T> {
  ok: boolean;
  message: string;
  data: T;
}

interface SystemField {
  id: string;
  createdAt: Date;
}

export interface Todo extends SystemField {
  title: string;
  isCompleted: boolean;
  description: string;
}

export interface Projects extends SystemField {
  title: string;
  todos: Todo[];
}
