import { ResponseType } from "api/todolists-api";
import { Dispatch } from "redux";
import { appActions } from "app/app-reducer";
import axios from "axios";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppErrorAC({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setAppErrorAC({ error: "Some error occurred" }));
  }
  dispatch(appActions.setAppStatusAC({ status: "failed" }));
};

// export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
//     dispatch(appActions.setAppErrorAC({error: error.message ? error.message : "Some error occurred" }))
//     dispatch(appActions.setAppStatusAC({status: "failed" }))
// }

export const handleServerNetworkError = (err: unknown, dispatch: Dispatch): void => {
  let errorMessage = "Some error occurred";
  if (axios.isAxiosError(err)) {
    // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
    // ⏺️ err?.message - например при создании таски в offline режиме
    errorMessage = err.response?.data?.message || err?.message || errorMessage;
    // ❗ Проверка на наличие нативной ошибки
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
    // ❗Какой-то непонятный кейс
  } else {
    errorMessage = JSON.stringify(err);
  }

  dispatch(appActions.setAppErrorAC({ error: errorMessage }));
  dispatch(appActions.setAppStatusAC({ status: "failed" }));
};
