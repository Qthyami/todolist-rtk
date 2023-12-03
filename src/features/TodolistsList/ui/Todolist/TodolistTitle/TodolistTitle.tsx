import React from "react";
import { EditableSpan } from "common/components";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useActions } from "common/hooks/useActions";
import { TodolistDomainType, todolistsThunks } from "features/TodolistsList/model/todolists/todolists.reducer";

type PropsType = {
  todolist: TodolistDomainType
}
export const TodolistTitle = ({ todolist }: PropsType) => {
  const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks);
  const removeTodolistHandler = () => {
    removeTodolist(todolist.id);
  };

  const changeTodolistTitleHandler = (title: string) => {
    changeTodolistTitle({ todolistId: todolist.id, title });
  };
  return (
    <h3>
      <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler} />
      <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </h3>
  );
};

