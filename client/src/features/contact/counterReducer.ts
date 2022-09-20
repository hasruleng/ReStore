export const INCREMENT_COUNTER = "INCREMENT_COUNTER" //action types
export const DECREMENT_COUNTER = "DECREMENT_COUNTER" //action types

export interface CounterState{
    data: number;
    title: string; 
}

const initialState: CounterState ={
    data: 42,
    title: 'YARC (yet another redux counter)'
}

export function increment(amount =1){ //action creators
    return {
        type: INCREMENT_COUNTER,
        payload: amount
    }
}

export function decrement(amount =1){ //action creators
    return {
        type: DECREMENT_COUNTER,
        payload: amount
    }
}

export default function counterReducer(state=initialState, action: any){
    switch(action.type){
        case INCREMENT_COUNTER:
            return {
                ...state, //creating a copy, not mutating state (Priority A Rules). Tapi kalau pake redux toolkit boleh mutate states krn menggunakan library "Immer".
                data: state.data + action.payload
            }
            break;
        case DECREMENT_COUNTER:
        return {
            ...state,
            data: state.data - action.payload
        }
        default:
            return state;
    }
    
    return state;
}