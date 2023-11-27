import { ActionCreator, ActionCreatorsMapObject, AsyncThunk, bindActionCreators } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useAppDispatch } from "common/hooks/useAppDispatch";

/**
 * приблуда, чтобы  раскукожить прямо в компоненте вида const { initializeApp, logout } = useActions(authThunks), а не писать authThunks.logout и самое главное просто вызываем
 * logout и не надо диспатчить типа dispatch (authThunks.logout())
 *
 * @param actions -принимает структурированные санки типа authThunks
 *  //страшные типизации чтобы отличать AC от TC


 */

export const useActions = <Actions extends ActionCreatorsMapObject = ActionCreatorsMapObject>
(actions: Actions): BoundActions<Actions> => {
  const dispatch = useAppDispatch();

  return useMemo(() => bindActionCreators(actions, dispatch), []);
};

// Types
type BoundActions<Actions extends ActionCreatorsMapObject> = {
  [key in keyof Actions]: Actions[key] extends AsyncThunk<any, any, any>
    ? BoundAsyncThunk<Actions[key]>
    : Actions[key];
};

type BoundAsyncThunk<Action extends ActionCreator<any>> = (
  ...args: Parameters<Action>
) => ReturnType<ReturnType<Action>>;

