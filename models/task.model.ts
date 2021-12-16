type todoitemStatus = 'todo' | 'inprogress' | 'completed'

export interface ITask {
  id: string;
  status: todoitemStatus;
  text: string;
  timeStart: string;
  timeEnd: string
  ownerId: string;
}
