import { createContext, ReactNode, useContext, useReducer } from "react";

export type Timer = {
    name:string;
    duration:number;
}
type TimersState={
    isRunning : boolean;
    timers:Timer[];
}

const initialState: TimersState = {
    isRunning: true,
    timers: [],
}

type TimersContextValue = TimersState & {
    addTimer: (timerData : Timer)=> void,
    startTimers: () => void,
    stopTimers: () => void
}
const TimersContext= createContext<TimersContextValue | null>(null);


export function useTimersContext(){
    const timerCtx =useContext(TimersContext)
    if(timerCtx ===null){
        throw new Error("TimersContextProvider is null")
    }
    return timerCtx
}

type TimersContextProviderProps = {
    children: ReactNode;
}

type StartTimerAction = {
    type: "START_TIMERS"
}
type StopTimerAction = {
    type: "STOP_TIMERS"
}
type AddTimerAction = {
    type: "ADD_TIMERS";
    payload: Timer;
}
type Action = StartTimerAction | StopTimerAction | AddTimerAction

function timerReducer(state:TimersState,action:Action) : TimersState{
    if(action.type==="START_TIMERS"){
        return {
            ...state,
            isRunning: true
        }
    }
    if(action.type==="STOP_TIMERS"){
        return {
            ...state,
            isRunning: false
        }
    }
    if(action.type==="ADD_TIMERS"){
        return {
            ...state,
            timers : [...state.timers, 
                {
                name: action.payload.name,
                duration: action.payload.duration
            },
        ]
        }
    }
    return state;
}

export default function TimersContextProvider({children} : TimersContextProviderProps){
    const [timerState,dispatch]=useReducer(timerReducer,initialState)

    const ctx: TimersContextValue = {
        timers: timerState.timers,
        isRunning: timerState.isRunning,
        addTimer(timerData){
            dispatch({type:"ADD_TIMERS",payload:timerData})
        },
        startTimers(){
            dispatch({type:"START_TIMERS"})
        },
        stopTimers(){
            dispatch({type:"STOP_TIMERS"})
        },
    }
    return <TimersContext.Provider value={ctx}>{children}</TimersContext.P