import { authAPI } from "api/todolists-api";

import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/src/createAction";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";
import { handleServerNetworkError } from "common/utils/error-utils";

const initialState: InitialStateType = {
  status: "idle",
  error: null,
  isInitialized: false
};
const slice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
    setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status;
    },
    setAppInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
      state.isInitialized = action.payload.isInitialized;
      console.log("setAppInitializedAC   " + state.isInitialized);
    }
  }

});
export const appReducer = slice.reducer;
export const appActions = slice.actions;


export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialStateType = {
  status: RequestStatusType;
  error: string | null;
  isInitialized: boolean;
};

export const initializeAppTC = createAppAsyncThunk<{ isLoggedIn: boolean }>(
  "auth/initializeApp",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await authAPI.me();
      if (res.data.resultCode === 0) {
        return { isLoggedIn: true };
      } else {
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppInitializedAC({ isInitialized: true }));
    }
  }
);

export const appThunks = { initializeAppTC };
