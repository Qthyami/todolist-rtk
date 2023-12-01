import { tasksSlice } from "features/TodolistsList/model/tasks/tasksSlice";
import { todolistsReducer } from "features/TodolistsList/model/todolists/todolists.reducer";
import { appReducer } from "app/app.reducer";
import { authReducer } from "features/auth/model/auth.reducer";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    tasks: tasksSlice,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
  }
});

export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// @ts-ignore
window.store = store;
