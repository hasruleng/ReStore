import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Basket } from "../../app/models/basket";
import { getCookie } from "../../app/util/util";

interface BasketState {
    basket: Basket | null;
    status: string;
}

const initialState: BasketState = {
    basket: null,
    status: 'idle'
}

export const fetchBasketAsync = createAsyncThunk<Basket>(
    'basket/fetchBasketAsync',
    async (_, thunkAPI) => {
        try {
            return await agent.Basket.get();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }, 
    {
        condition: () => {
            if(!getCookie('buyerId')) return false;
        }
    }
)

export const addBasketItemAsync = createAsyncThunk<Basket, { productId: number, quantity?: number }>( //quantity pake ? jadi optional
    'basket/addBasketItemAsync',
    async ({ productId, quantity = 1 }, thunkAPI) => { //quantity dikasih default value 1
        try {
            return await agent.Basket.addItem(productId, quantity);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const removeBasketItemAsync = createAsyncThunk<void, //when we do call this method, then we're going to have our name property available inside the metadata 
{ productId: number, quantity: number, name?:string }>( 
    'basket/removeBasketItemAysnc',
    async ({ productId, quantity  }, thunkAPI) => { //quantity dikasih default value 1
        try {
            await agent.Basket.removeItem(productId, quantity);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: { //di sini mirip dengan StoreContext.tsx
        setBasket: (state, action) => {
            console.log('set basketnya jalan');
            state.basket = action.payload; //ambil dari BE dotnet
        }
    },
    extraReducers: (builder => {
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            state.status = 'pendingAddItem' + action.meta.arg.productId;
        });
        builder.addCase(removeBasketItemAsync.pending, (state, action) => { //tanda tanya (?) artinya opsional
            state.status = 'pendingRemoveItem' + action.meta.arg.productId+action.meta.arg.name;
        });
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            // console.log(action.payload); //aneh action.payloadnya bisa beda dengan yang ada di addBasket
            const { productId, quantity } = action.meta.arg;
            const itemIndex = state.basket?.items.findIndex(i=> i.productId === productId); //itemIndex-nya basket bermasalah
            console.log("produk yang dihapus "+productId+" | itemIndex: "+itemIndex);
            if (itemIndex === -1 || itemIndex === undefined) return; 
            state.basket!.items[itemIndex].quantity -= quantity; //mengurangi quantity sebanyak 1. quantity bisa undefined krn ga ada kirim dari action.meta.arg (stlh dicek di redux browser toolkit)
            if (state.basket?.items[itemIndex].quantity === 0)
                state.basket.items.splice(itemIndex, 1);
            state.status = 'idle';
        });
        builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
            console.log(action);
            state.status = 'idle';
        });        
        builder.addMatcher(isAnyOf(addBasketItemAsync.fulfilled, fetchBasketAsync.fulfilled), (state, action) => {
            state.basket = action.payload;
            state.status = 'idle';
        });
        builder.addMatcher(isAnyOf(addBasketItemAsync.rejected, fetchBasketAsync.rejected), (state, action) => {
            console.log(action);
            state.status = 'idle';
        });
    })
})

export const { setBasket } = basketSlice.actions;