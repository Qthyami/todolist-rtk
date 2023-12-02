import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FilterValuesType,
  todolistsActions,
  todolistsThunks
} from "features/TodolistsList/model/todolists/todolists.reducer";
import { tasksThunks } from "features/TodolistsList/model/tasks/tasksSlice";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components";
import { Todolist } from "features/TodolistsList/ui/Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "features/auth/model/auth.selectors";
import { selectTasks } from "features/TodolistsList/model/tasks/tasksSelectors";
import { selectTodolists } from "features/TodolistsList/model/todolists/todolists.selectors";
import { TaskStatuses } from "common/enums";
import { useActions } from "common/hooks/useActions";

export const TodolistsList = () => {
  const todolists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const {
    fetchTodolists,
    removeTodolist,
    addTodolist,
    changeTodolistTitle,
    removeTask,
    updateTask,
    changeTodolistFilter,
  } = useActions({
    ...todolistsThunks,
    ...tasksThunks,
    ...todolistsActions,
  });

  // const { removeTask, addTask, updateTask } = useActions(tasksThunks);
  // const { changeTodolistFilter } = useActions(todolistsActions);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    fetchTodolists();
  }, []);

  const removeTaskCb = useCallback(function(taskId: string, todolistId: string) {
    removeTask({ taskId, todolistId });
  }, []);

  // const addTaskCb = useCallback(function(title: string, todolistId: string) {
  //   addTask({ title, todolistId });
  // }, []);

  const changeStatus = useCallback(function(taskId: string, status: TaskStatuses, todolistId: string) {
    updateTask({ taskId, domainModel: { status }, todolistId });
  }, []);

  const changeTaskTitle = useCallback(function(taskId: string, title: string, todolistId: string) {
    updateTask({ taskId, domainModel: { title }, todolistId });
  }, []);

  const changeFilter = useCallback(function(filter: FilterValuesType, id: string) {
    changeTodolistFilter({ id, filter });
  }, []);

  const removeTodolistCb = useCallback(function(id: string) {
    removeTodolist(id);
  }, []);

  const changeTodolistTitleCb = useCallback(function(id: string, title: string) {
    changeTodolistTitle({ id, title });
  }, []);

  const addTodolistCb = useCallback((title: string) => {
    addTodolist(title);
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolistCb} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTaskCb}
                  changeFilter={changeFilter}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolistCb}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitleCb}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
