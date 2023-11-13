import {todolistsAPI, TodolistType} from "api/todolists-api"
import {Dispatch} from 'redux'

import {handleServerNetworkError} from "utils/error-utils"
import { AppDispatch, AppThunk } from "app/store";
import { createSlice} from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/src/createAction";
import { appActions, RequestStatusType } from "app/app-reducer";
import { fetchTasksTC } from "features/TodolistsList/tasks-reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";

const initialState: Array<TodolistDomainType> = []
const slice = createSlice({
    name:"todolists",
    initialState:initialState,
    reducers:{
        removeTodolistAC(state, action:PayloadAction<{id: string}>){
            const index=state.findIndex(tl=>tl.id===action.payload.id)
            if (index > -1){
                state.splice(index, 1)
            }
        },
        addTodolistAC(state, action:PayloadAction<{todolist: TodolistType}>){
            state.unshift({...action.payload.todolist,filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistTitleAC(state, action:PayloadAction<{id: string, title: string}>){
            const index=state.findIndex(tl=>tl.id===action.payload.id);
            if (index > -1){
                state[index].title=action.payload.title
            }

        },
        changeTodolistFilterAC(state, action:PayloadAction<{id: string, filter: FilterValuesType}>){
            const index=state.findIndex(tl=>tl.id===action.payload.id);
            if (index > -1){
                state[index].filter=action.payload.filter
            }
        },
        changeTodolistEntityStatusAC(state, action:PayloadAction<{id: string, status: RequestStatusType}>){
            const index=state.findIndex(tl=>tl.id===action.payload.id);
            if (index > -1){
                state[index].entityStatus=action.payload.status
            }
        },
        setTodolistsAC(state, action:PayloadAction<{todolists: Array<TodolistType>}>){
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        }


},
    extraReducers: builder => {
        builder.addCase(clearTasksAndTodolists, (state, action)=>{
            return action.payload.todolists
            //return []
        })
    }
    },

)
export const todolistsReducer=slice.reducer
export const todolistsActions = slice.actions
// export const _todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
//     switch (action.type) {
//         case 'REMOVE-TODOLIST':
//             return state.filter(tl => tl.id != action.id)
//         case 'ADD-TODOLIST':
//             return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
//
//         case 'CHANGE-TODOLIST-TITLE':
//             return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
//         case 'CHANGE-TODOLIST-FILTER':
//             return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
//         case 'CHANGE-TODOLIST-ENTITY-STATUS':
//             return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
//         case 'SET-TODOLISTS':
//             return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
//         default:
//             return state
//     }
// }

// actions
// export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
// export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
// export const changeTodolistTitleAC = (id: string, title: string) => ({
//     type: 'CHANGE-TODOLIST-TITLE',
//     id,
//     title
// } as const)
// export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
//     type: 'CHANGE-TODOLIST-FILTER',
//     id,
//     filter
// } as const)
// export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => ({
//     type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, status } as const)
// export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)

// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch:AppDispatch) => {
        dispatch(appActions.setAppStatusAC({status: "loading" }))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(todolistsActions.setTodolistsAC({todolists: res.data }))
                dispatch(appActions.setAppStatusAC({status: "succeeded" }))
                return res.data
            })
          .then((todos)=>{
              todos.forEach(tl=> dispatch(fetchTasksTC(tl.id)))
          })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {

        dispatch(appActions.setAppStatusAC({status: "loading" }))

        dispatch(todolistsActions.changeTodolistEntityStatusAC({id: todolistId,status: "loading" }))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(todolistsActions.removeTodolistAC({ id: todolistId }))

                dispatch(appActions.setAppStatusAC({status: "succeeded" }))
            })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch) => {
        dispatch(appActions.setAppStatusAC({status: "loading" }))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(todolistsActions.addTodolistAC({todolist: res.data.data.item }))
                dispatch(appActions.setAppStatusAC({status: "succeeded" }))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(todolistsActions.changeTodolistTitleAC({id: id, title: title }))
            })
    }
}

// types

// type ActionsType =
//     | RemoveTodolistActionType
//     | AddTodolistActionType
//     | ReturnType<typeof changeTodolistTitleAC>
//     | ReturnType<typeof changeTodolistFilterAC>
//     | SetTodolistsActionType
//     | ReturnType<typeof changeTodolistEntityStatusAC>
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

