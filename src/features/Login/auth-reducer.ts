import { authAPI, LoginParamsType } from "api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice } from "@reduxjs/toolkit";
import { appActions, initializeAppTC } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";

import { createAppAsyncThunk } from "utils/create-app-async-thunk";

const initialState: InitialStateType = {
  isLoggedIn: false
};
const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    //setIsLoggedInAC(state, action:PayloadAction<{isLoggedIn:boolean}>){
    //state.isLoggedIn=action.payload.isLoggedIn}
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logoutTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(initializeAppTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  }
});

export const loginTC = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  "auth/login",
  async (param: LoginParamsType, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatusAC({ status: "loading" }));
    try {
      const res = await authAPI.login(param);

      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));

        return { isLoggedIn: true };
      } else {
        handleServerAppError(res.data, thunkAPI.dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error as { message: string }, dispatch);
      return rejectWithValue(null);
    }
  }
);
const logoutTC = createAppAsyncThunk<{ isLoggedIn: boolean }>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatusAC({ status: "loading" }));

  try {
    const res = await authAPI.logout();
    if (res.data.resultCode === 0) {
      dispatch(clearTasksAndTodolists({ tasks: {}, todolists: [] }));
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));

      return { isLoggedIn: false };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});
//   export const _logoutTC = () => (dispatch: Dispatch) => {
//   dispatch(appActions.setAppStatusAC({status: "loading" }))
//   authAPI.logout()
//     .then(res => {
//       if (res.data.resultCode === 0) {
//         dispatch(authActions.setIsLoggedInAC({ isLoggedIn: false }))
//         dispatch(clearTasksAndTodolists({tasks: {}, todolists:[]}))
//         dispatch(appActions.setAppStatusAC({status: "succeeded" }))
//       } else {
//         handleServerAppError(res.data, dispatch)
//       }
//     })
//     .catch((error) => {
//       handleServerNetworkError(error, dispatch)
//     })
// }

export const authReducer = slice.reducer;
// actions
export const authActions = slice.actions;

export const authThunks = { loginTC, logoutTC };

// types

type InitialStateType = {
  isLoggedIn: boolean;
};
