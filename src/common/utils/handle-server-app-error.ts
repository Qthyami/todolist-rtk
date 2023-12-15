import { Dispatch } from "redux";
import { appActions } from "app/app.reducer";
import { BaseResponseType } from "common/types/common.types";

/**
 * Обработчик ошибок сервера при взаимодействии с API.
 *
 * @template D - Тип данных, ожидаемых от сервера.
 * @param {BaseResponseType<D>} data - Объект ответа от сервера, содержащий данные и сообщения об ошибках.
 * @param {Dispatch} dispatch - Функция диспетчеризации для обновления состояния приложения.
 * @param {boolean} [showGlobalError=true] - Флаг, указывающий, следует ли отображать глобальное сообщение об ошибке.
 */
export const handleServerAppError = <D>(data: BaseResponseType<D>, dispatch: Dispatch, showGlobalError = true) => {

  if (showGlobalError) {
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  }

  dispatch(appActions.setAppStatus({ status: "failed" }));
};
