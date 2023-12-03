import React, { useCallback, useEffect } from "react";
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolists.reducer";
import { tasksThunks } from "features/TodolistsList/model/tasks/tasksSlice";
import { TaskStatuses } from "common/enums";
import { AddItemForm } from "common/components";
import { TaskType } from "features/TodolistsList/api/taks/tasksApi.types";
import { useActions } from "common/hooks/useActions";
import { FilterTasksButtons } from "features/TodolistsList/ui/Todolist/FilterTasksButtons/FilterTasksButtons";
import { TodolistTitle } from "features/TodolistsList/ui/Todolist/TodolistTitle/TodolistTitle";
import { Tasks } from "features/TodolistsList/ui/Todolist/Tasks/Tasks";

type PropsType = {
  todolist: TodolistDomainType;
  tasks: TaskType[];

};


export const Todolist = React.memo(function(props: PropsType) {
  const { addTask } = useActions(tasksThunks);
  const { fetchTasks } = useActions(tasksThunks);


  useEffect(() => {
    fetchTasks(props.todolist.id);
  }, []);

  const addTaskHandler = useCallback(
    (title: string) => {
      addTask({ title: title, todolistId: props.todolist.id });
    },
    [props.todolist.id]
  );


  let tasksForTodolist = props.tasks;

  if (props.todolist.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (props.todolist.filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <TodolistTitle todolist={props.todolist} />
      <AddItemForm addItem={addTaskHandler} disabled={props.todolist.entityStatus === "loading"} />
      <div>
        <Tasks tasksForTodolist={tasksForTodolist} todolist={props.todolist} />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons todolist={props.todolist} />
      </div>
    </div>
  );
});
