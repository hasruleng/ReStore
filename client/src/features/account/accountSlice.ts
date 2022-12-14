import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { User } from "../../app/models/user";
import { history } from "../..";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";


interface AccountState {
    user: User | null;
}

const initialState: AccountState = {
    user: null
}

export const signInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser',
    async (data, thunkAPI) => {
        try {
            console.log("userDto:");
            const userDto = await agent.Account.login(data);
            const { basket, ...user } = userDto;
            if (basket) thunkAPI.dispatch(setBasket(basket)); //set basket ke DB untuk anonymous user yg baru login
            // const user = await agent.Account.currentUser();
            console.log(userDto);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
        try {
            const userDto = await agent.Account.currentUser();
            const { basket, ...user } = userDto;
            if (basket) thunkAPI.dispatch(setBasket(basket));
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    },
    {
        condition: () => { //we're not gonna make API call if we don't have user key inside the local storage
            if (!localStorage.getItem('user')) return false;
        }
    }
)
export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            history.push('/');
        },
        setUser: (state, action) => {
            let claims = JSON.parse(atob(action.payload.token.split('.')[1])); //0: header, 1: payload (roles di sini), 2: signature(secret)
            let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']; //roles ada di dalam key ini
            state.user = { ...action.payload, roles: typeof (roles) === 'string' ? [roles] : roles };
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.user = null;
            localStorage.removeItem('user');
            toast.error('Session expired - please login again');
            history.push('/');
        }
        )
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            let claims = JSON.parse(atob(action.payload.token.split('.')[1]));
            let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = { ...action.payload, roles: typeof (roles) === 'string' ? [roles] : roles };
        });
        builder.addMatcher(isAnyOf(signInUser.rejected, fetchCurrentUser.rejected), (state, action) => {
            throw action.payload;
        });

    })
})

export const { signOut, setUser } = accountSlice.actions;
