import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { appActions } from "app/app.reducer";
import { authAPI, LoginParamsType } from "features/auth/api/auth.api";
import { clearTasksAndTodolists } from "common/actions";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { thunkTryCatch } from "common/utils/thunkTryCatch";
import { ResultCode } from "common/enums";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        authThunks.login.fulfilled,
        authThunks.logout.fulfilled,
        authThunks.initializeApp.fulfilled
      ),
      (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      }
    );
  }
});

// thunks
const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${slice.name}/initializeApp`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    return thunkTryCatch(thunkAPI, async () => {
      const token = localStorage.getItem("sn-token");
      if (!token) return { isLoggedIn: false };

      // авторизуемся через Bearer-токен
      const res = await authAPI.me(); // authAPI.me() использует instance с interceptor
      if (res.data.resultCode === 0) {
        return { isLoggedIn: true };
      } else {
        handleServerAppError(res.data, dispatch, false);
        return rejectWithValue(res.data);
      }
    }).finally(() => {
      dispatch(appActions.setAppInitialized({ isInitialized: true }));
    });
  }
);

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  `${slice.name}/login`,
  async (arg, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const res = await authAPI.login(arg);
      if (res.data.resultCode === ResultCode.Success) {
        const token = res.data.data.token;

        if (token) {
          // сохраняем Bearer-токен только если он существует
          localStorage.setItem("sn-token", token);
        }

        return { isLoggedIn: true };
      } else {
        return rejectWithValue(res.data);
      }
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${slice.name}/logout`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await authAPI.logout();
      if (res.data.resultCode === 0) {
        dispatch(clearTasksAndTodolists());
        localStorage.removeItem("sn-token"); // удаляем токен при логауте
        return { isLoggedIn: false };
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

export const authReducer = slice.reducer;
export const authThunks = { login, logout, initializeApp };
