import {Dispatch} from 'redux'
import {authAPI} from "api/todolists-api"
import {setIsLoggedInAC} from "features/Login/auth-reducer"
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/src/createAction";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}
const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppErrorAC (state, action: PayloadAction<{ error: string | null }>){
         state.error = action.payload.error;
        },
        setAppStatusAC(state,action: PayloadAction<{status: RequestStatusType}>){
            state.status=action.payload.status
        },
        setAppInitializedAC(state,action: PayloadAction<{isInitialized: boolean}>){
            state.isInitialized=action.payload.isInitialized
        }
    }
})
export const appReducer=slice.reducer;
export const appActions = slice.actions
export type AppInitialState = ReturnType<typeof slice.getInitialState>


// export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-STATUS':
//             return {...state, status: action.status}
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         case 'APP/SET-IS-INITIALIED':
//             return {...state, isInitialized: action.value}
//         default:
//             return {...state}
//     }
// }

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
    isInitialized: boolean
}

// export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
// export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
// export const setAppInitializedAC = (value: boolean) => ({type: 'APP/SET-IS-INITIALIED', value} as const)

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({ isLoggedIn: true }));
        } else {

        }

        dispatch(appActions.setAppInitializedAC({ isInitialized: true }));
    })
}


