import React from "react";
import { Task } from "features/TodolistsList/ui/Todolist/Task/Task";
import { TaskType } from "features/TodolistsList/api/taks/tasksApi.types";
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolists.reducer";

type Props = {
  tasksForTodolist: TaskType[];
  todolist: TodolistDomainType
}
export const Tasks = ({ tasksForTodolist, todolist }: Props) => {
  return (
    <>
      {tasksForTodolist.map((t) => (
        <Task
          key={t.id}
          task={t}
          todolistId={todolist.id}
        />
      ))}
    </>
  );
};

