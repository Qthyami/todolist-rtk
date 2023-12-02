import { instance } from "common/api";
import { BaseResponseType } from "common/types/common.types";
import {
  AddTaskArgType,
  GetTasksResponseType,
  RemoveTaskArgType,
  TaskType,
  UpdateTaskModelType,
} from "features/TodolistsList/api/taks/tasksApi.types";

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponseType>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(arg: RemoveTaskArgType) {
    return instance.delete<BaseResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`);
  },
  createTask(arg: AddTaskArgType) {
    return instance.post<
      BaseResponseType<{
        item: TaskType;
      }>
    >(`todo-lists/${arg.todolistId}/tasks`, { title: arg.title });
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<BaseResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};
