import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Bounce } from "react-toastify";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
    async () => {
        try {
            return await agent.Catalog.list();
        }catch (error){
            console.log(error);
        }
    }
)

export const fetchProductAsync = createAsyncThunk<Product, number>(//tipe Product dan number
    'catalog/fetchProductAsync',
    async (productId) => {
        try {
            return await agent.Catalog.details(productId);
        }catch (error){
            console.log(error);
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
        builder.addCase(fetchProductsAsync.rejected, (state)=>{            
            state.status='idle';
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action)=>{
            productsAdapter.upsertOne(state, action.payload);//the goal of this is not to use the async method to go and fetch the product from the API unless we actually need to.
            state.status='idle';
        });
        builder.addCase(fetchProductAsync.rejected, (state)=>{
            state.status='idle';
        })
    })//so that we can do something with the products when we get them back
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);
