import { AnyAction, createSlice, isFulfilled, isRejected, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false
};

export type AppInitialStateType = typeof initialState;
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher((action: AnyAction) => {
      return action.type.endsWith("/pending"); //если тут true то включает крутилку, т.е. если пендится любая санка в приложении
    }, (state, action) => {

      state.status = "loading";
    });
    builder.addMatcher(isRejected, (state, action: AnyAction) => {
      debugger
      state.status = "failed";
      if (action.payload) {

        if ((action.type === "todo/addTodolist/rejected") || (action.type === "tasks/addTask/rejected") || (action.type === "auth/initializeApp/rejected")) {
          debugger
          return;
        }

        state.error = action.payload.messages[0];
        debugger
      } else {
        state.error = action.error.message ? action.error.message : "Some error occurred";
        debugger

      }

    });

    builder.addMatcher(isFulfilled, (state, action) => { // деалет то же самое, что и action.type.endsWith

      state.status = "succeeded";
    });
  }
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
