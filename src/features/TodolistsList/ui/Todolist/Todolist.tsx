import React, { useCallback, useEffect } from "react";
import { Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { Task } from "features/TodolistsList/ui/Todolist/Task/Task";
import { FilterValuesType, TodolistDomainType } from "features/TodolistsList/model/todolists/todolists.reducer";
import { tasksThunks } from "features/TodolistsList/model/tasks/tasksSlice";
import { TaskStatuses } from "common/enums";
import { useAppDispatch } from "common/hooks";
import { AddItemForm, EditableSpan } from "common/components";
import { TaskType } from "features/TodolistsList/api/taks/tasksApi.types";
import { useActions } from "common/hooks/useActions";

type PropsType = {
  todolist: TodolistDomainType;
  tasks: TaskType[];
  changeFilter: (value: FilterValuesType, todolistId: string) => void;

  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void;
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void;
  removeTask: (taskId: string, todolistId: string) => void;
  removeTodolist: (id: string) => void;
  changeTodolistTitle: (id: string, newTitle: string) => void;
};


export const Todolist = React.memo(function(props: PropsType) {
  const { addTask } = useActions(tasksThunks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(tasksThunks.fetchTasks(props.todolist.id));
  }, []);

  const addTaskHandler = useCallback(
    (title: string) => {
      addTask({ title: title, todolistId: props.todolist.id });
    },
    [props.todolist.id]
  );

  const removeTodolist = () => {
    props.removeTodolist(props.todolist.id);
  };

  const changeTodolistTitle = useCallback(
    (title: string) => {
      props.changeTodolistTitle(props.todolist.id, title);
    },
    [props.todolist.id, props.changeTodolistTitle]
  );

  const onAllClickHandler = useCallback(
    () => props.changeFilter("all", props.todolist.id),
    [props.todolist.id, props.changeFilter]
  );
  const onActiveClickHandler = useCallback(
    () => props.changeFilter("active", props.todolist.id),
    [props.todolist.id, props.changeFilter]
  );
  const onCompletedClickHandler = useCallback(
    () => props.changeFilter("completed", props.todolist.id),
    [props.todolist.id, props.changeFilter]
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
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitle} />
        <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskHandler} disabled={props.todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task
            key={t.id}
            task={t}
            todolistId={props.todolist.id}


          />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <Button
          variant={props.todolist.filter === "all" ? "outlined" : "text"}
          onClick={onAllClickHandler}
          color={"inherit"}
        >
          All
        </Button>
        <Button
          variant={props.todolist.filter === "active" ? "outlined" : "text"}
          onClick={onActiveClickHandler}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={props.todolist.filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
