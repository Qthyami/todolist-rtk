import { TaskPriorities, TaskStatuses, TaskType, UpdateTaskArgType, UpdateTaskModelType } from "api/todolists-api";

import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/src/createAction";
import { appActions } from "app/app-reducer";
import { todolistsThunks } from "features/TodolistsList/todolists-reducer";
import { clearTasksAndTodolists, ClearTasksAndTodolistsType } from "common/actions/common.actions";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";
import { RemoveTaskArgType, todolistsAPI } from "features/TodolistsList/todolists.api";
import { ResultCode } from "common/enums/common-enums";

const initialState: TasksStateType = {};
const slice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(todolistsThunks.addTodolistTC.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = [];
    });
    builder.addCase(todolistsThunks.removeTodolistTC.fulfilled, (state, action) => {
      delete state[action.payload.todolistId];
    });
    builder.addCase(todolistsThunks.fetchTodolistsTC.fulfilled, (state, action) => {
      action.payload.todolists.forEach((tl) => {
        state[tl.id] = [];
      });
    });
    builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks;
    });

    builder
      .addCase(clearTasksAndTodolists.type, (state, action: PayloadAction<ClearTasksAndTodolistsType>) => {
        // return {}
        return action.payload.tasks; // identical return {}
      })
      .addCase(removeTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((tl) => tl.id === action.payload.taskId);

        if (index > -1) {
          tasks.splice(index, 1);
        }
      });
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      state[action.payload.task.todoListId].unshift(action.payload.task);
    });
    builder.addCase(updateTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((tl) => tl.id === action.payload.taskId);
      if (index > -1) {
        tasks[index] = { ...tasks[index], ...action.payload.domainModel };
      }
    });
  }
});

// actions
export const tasksActions = slice.actions;

export const fetchTasksTC = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${slice.name}/fetchTasks`,
  async (todolistId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await todolistsAPI.getTasks(todolistId);
      const tasks = res.data.items;
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      return { tasks, todolistId };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const removeTaskTC = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>(
  "tasks/removeTask",
  async (param: RemoveTaskArgType, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId);
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        return param;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const addTaskTC = createAppAsyncThunk<{ task: TaskType }, { title: string; todolistId: string }>(
  `${slice.name}/addTask`,
  async (arg: { title: string; todolistId: string }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatusAC({ status: "loading" }));

    try {
      const res = await todolistsAPI.createTask(arg.todolistId, arg.title);
      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        return { task };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const updateTaskTC = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>(
  `${slice.name}/updateTask`,
  async (param: { taskId: string; domainModel: UpdateDomainTaskModelType; todolistId: string }, thunkAPI) => {
    const { getState, dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const state = getState();
      const task = state.tasks[param.todolistId].find((t) => t.id === param.taskId);
      if (!task) {
        //throw new Error("task not found in the state");
        dispatch(appActions.setAppErrorAC({ error: "task not found in the state" }));
        return rejectWithValue(null);
      }

      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...param.domainModel
      };

      const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel);
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        return param;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

export const tasksReducer = slice.reducer;
export const tasksThunks = { fetchTasksTC, addTaskTC, updateTaskTC, removeTaskTC };
