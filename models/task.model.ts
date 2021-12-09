type todoitemStatus = 'todo' | 'inprogress' | 'completed'

export interface Task {
  id: string;
  status: todoitemStatus;
  text: string;
  timeStart: string;
  timeEnd: string
  ownerId: string;
}
