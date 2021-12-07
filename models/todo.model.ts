type todoitemStatus = 'todo' | 'inprogress' | 'completed'

export interface Todo {
  status: todoitemStatus;
  text: string;
  time: string;
}
