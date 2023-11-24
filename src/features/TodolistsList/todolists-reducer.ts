import { TodolistType } from "api/todolists-api";

import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/src/createAction";
import { appActions, RequestStatusType } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { todolistsAPI } from "features/TodolistsList/todolists.api";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";
import { ResultCode } from "common/enums/common-enums";

const initialState: Array<TodolistDomainType> = [];
const slice = createSlice({
  name: "todolists",
  initialState: initialState,
  reducers: {

    changeTodolistFilterAC(state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      if (index > -1) {
        state[index].filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string; status: RequestStatusType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      if (index > -1) {
        state[index].entityStatus = action.payload.status;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(clearTasksAndTodolists, (state, action) => {
      return action.payload.todolists;
      //return []
    });
    builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
      return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
    });
    builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId);
      if (index > -1) {
        state.splice(index, 1);
      }
    });
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
    });
    builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      if (index > -1) {
        state[index].title = action.payload.title;
      }
    });


  }
});


// thunks
export const fetchTodolistsTC = createAppAsyncThunk<{ todolists: TodolistType[] }, void>("todo/fetchTodolists", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatusAC({ status: "loading" }));
    const res = await todolistsAPI.getTodolists();
    dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
    return { todolists: res.data };
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});


export const removeTodolistTC = createAppAsyncThunk("todo/removeTodolist", async (todolistId: string, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatusAC({ status: "loading" }));
    dispatch(todolistsActions.changeTodolistEntityStatusAC({ id: todolistId, status: "loading" }));
    const res = await todolistsAPI.deleteTodolist(todolistId);
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      return { todolistId };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});
export const addTodolistTC = createAppAsyncThunk<{ todolist: TodolistType }, string>("todo/addTodolist", async (title: string, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatusAC({ status: "loading" }));
    const res = await todolistsAPI.createTodolist(title);
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      return { todolist: res.data.data.item };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

export const changeTodolistTitleTC = createAppAsyncThunk("todo/changeTodolistTitle", async (param: { id: string, title: string }, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatusAC({ status: "loading" }));
    const res = await todolistsAPI.updateTodolist(param.id, param.title);
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      return { id: param.id, title: param.title };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});


// types

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = { fetchTodolistsTC, removeTodolistTC, addTodolistTC, changeTodolistTitleTC };