import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Bounce } from "react-toastify";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI ) => { // underscore (_) as non-existent argument or void
        try {
            return await agent.Catalog.list();
        }catch (error: any){
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)
//AsyncThunk => Outer Function: if it goes to inner block, it thinks that it has been fulfilled
export const fetchProductAsync = createAsyncThunk<Product, number>(//tipe Product dan number
    'catalog/fetchProductAsync',
    async (productId, thunkAPI) => { //Inner Function
        try {
            return await agent.Catalog.details(productId);
        }catch (error: any){ //sebelum ditambahin any ada pesan error di bagian error.data
            return thunkAPI.rejectWithValue({error: error.data}); //jadi kalau error (produknya null), masuknya ke reject, bukan lagi ke fulfilled
        }
    }
)

export const catalogSlice = createSlice ({
    name: 'catalog',
    initialState: productsAdapter.getInitialState({
        productsLoaded: false,
        status: 'idle'
    }),
    reducers: {}, //minimal requirement for creating slice
    extraReducers: (builder =>{
        builder.addCase(fetchProductsAsync.pending, (state)=> {
            state.status='pendingFetchProducts';

        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action)=> {
            productsAdapter.setAll(state, action.payload); //action.payload di sini isinya seluruh produk beserta detil produk
            //set all because we're going to set all of the products when we receive it back from our API
            state.status='idle';
            state.productsLoaded=true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action)=>{            
            console.log(action);
            state.status='idle';
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action)=>{
            productsAdapter.upsertOne(state, action.payload);//the goal of this is not to use the async method to go and fetch the product from the API unless we actually need to.
            //we're in the case where it says fulfilled=>our request was successful and we got passed into the case is now trying to insert a product into our products entities.
            state.status='idle';
        });
        builder.addCase(fetchProductAsync.rejected, (state,action)=>{
            console.log(action);
            state.status='idle';
        })
    })//so that we can do something with the products when we get them back
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);
