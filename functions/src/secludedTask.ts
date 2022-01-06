import { CloudTasksClient } from '@google-cloud/tasks'
import * as protos from '@google-cloud/tasks/build/protos/protos'

const client = new CloudTasksClient()

interface Payload {
  [key: string]: any
}

const project = 'pomodoro-3b7d3'
const queue = 'history'
const location = 'europe-west1'

export async function createSecludedTask(
  taskName: string,
  url: string,
  inSeconds: number,
  payload?: Payload
): Promise<void> {
  const parent = client.queuePath(project, location, queue)

  const task: protos.google.cloud.tasks.v2.ITask = {
    name: client.taskPath(project, location, queue, taskName),
    httpRequest: {
      httpMethod: 'POST',
      url,
      body: payload ? Buffer.from(JSON.stringify(payload)).toString('base64') : undefined
    }
  }

  if (inSeconds) {
    task.scheduleTime = {
      seconds: inSeconds + Date.now() / 1000
    }
  }

  const request: protos.google.cloud.tasks.v2.ICreateTaskRequest = {
    parent: parent,
    task: task
  }

  await client.createTask(request)
}

export async function removeSecludedTask(taskName: string): Promise<void> {
  const taskPath = client.taskPath(project, location, queue, taskName)
  await client.deleteTask({ name: taskPath })
}
