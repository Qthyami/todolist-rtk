import {Dispatch} from 'redux'

import {authAPI, LoginParamsType} from "api/todolists-api"
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";

const initialState: InitialStateType = {
    isLoggedIn: false
}
const slice=createSlice({
  name:"auth",
  initialState:initialState,
  reducers:{
    setIsLoggedInAC(state, action:PayloadAction<{isLoggedIn:boolean}>){
state.isLoggedIn=action.payload.isLoggedIn
    }
  }

})
 export const authReducer =slice.reducer //(state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
export const {setIsLoggedInAC} = slice.actions
//     switch (action.type) {
//         case 'login/SET-IS-LOGGED-IN':
//             return {...state, isLoggedIn: action.value}
//         default:
//             return state
//     }
// }

// actions
export const authActions = slice.actions
// export const setIsLoggedInAC = (value: boolean) =>
//     ({type: 'login/SET-IS-LOGGED-IN', value} as const)


// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
    dispatch(appActions.setAppStatusAC({status: "loading" }))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
              dispatch(setIsLoggedInAC({ isLoggedIn: true }))



                dispatch(appActions.setAppStatusAC({status: "succeeded" }))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatusAC({status: "loading" }))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
              dispatch(setIsLoggedInAC({ isLoggedIn: false }))
              dispatch(clearTasksAndTodolists({tasks: {}, todolists:[]}))
                dispatch(appActions.setAppStatusAC({status: "succeeded" }))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

// types

// type ActionsType = ReturnType<typeof setIsLoggedInAC>
type InitialStateType = {
    isLoggedIn: boolean
}

// type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>
