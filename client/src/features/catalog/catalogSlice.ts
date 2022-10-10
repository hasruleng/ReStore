import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Product, ProductParams } from "../../app/models/product";
import { RootState } from "../../app/store/configureStore";

const productsAdapter = createEntityAdapter<Product>();

interface CatalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
}

function getAxiosParams(productParams: ProductParams){
    const params = new URLSearchParams();
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy', productParams.orderBy);
    if (productParams.searchTerm) params.append('searchTerm', productParams.searchTerm);
    if (productParams.brands) params.append('brands', productParams.brands.toString());
    if (productParams.types) params.append('types', productParams.types.toString());
    return params;
}

export const fetchProductsAsync = createAsyncThunk<Product[], void, {state: RootState}>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => { // underscore (_) as non-existent argument or void
        const params=getAxiosParams(thunkAPI.getState().catalog.productParams);
        try {
            return await agent.Catalog.list(params);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)
//AsyncThunk => Outer Function: if it goes to inner block, it thinks that it has been fulfilled
export const fetchProductAsync = createAsyncThunk<Product, number>(//tipe Product dan number
    'catalog/fetchProductAsync',
    async (productId, thunkAPI) => { //Inner Function
        try {
            return await agent.Catalog.details(productId);
        } catch (error: any) { //harus ditambahin 'any' jika ada pesan error di bagian error.data
            return thunkAPI.rejectWithValue({ error: error.data }); //jadi kalau error (produknya null), masuknya ke reject, bukan lagi ke fulfilled
        }
    }
)

export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async (_, thunkAPI) => {
        try {
            return agent.Catalog.fetchFilters();
        } catch (error: any) { //harus ditambahin 'any' jika ada pesan error di bagian error.data
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

function initParams() { //productParams yang default
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name'
    }
}


export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({ //mengatur variable state apa saja yang ada
        productsLoaded: false,
        filtersLoaded: false,
        status: 'idle',
        brands: [],
        types: [],
        productParams: initParams()
    }),
    reducers: {
        setProductParams: (state, action)=> {
            state.productsLoaded=false; //will trigger useEffect in catalog to load Product's API
            state.productParams = {...state.productParams, ...action.payload} //... titik 3: spread operator=> allows us to quickly copy all or part of an existing array or object into another array or object
        },
        resetProductParams: (state) =>{
            state.productParams = initParams();
        }
    }, //minimal requirement for creating slice
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload); //action.payload di sini isinya seluruh produk beserta detil produk
            //set all because we're going to set all of the products when we receive it back from our API
            state.status = 'idle';
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            console.log(action);
            state.status = 'idle';
        });
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);//the goal of this is not to use the async method to go and fetch the product from the API unless we actually need to.
            //we're in the case where it says fulfilled=>our request was successful and we got passed into the case is now trying to insert a product into our products entities.
            state.status = 'idle';
        });
        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            console.log(action);
            state.status = 'idle';
        });
        builder.addCase(fetchFilters.pending, (state) => {
            state.status = 'pendingFetchFilters';
        });
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.filtersLoaded = true;
            state.status = 'idle';
        });      
        builder.addCase(fetchFilters.rejected, (state, action) => {
            state.status= 'idle';
            console.log(action.payload)
        });
    })//so that we can do something with the products when we get them back
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);

export const {setProductParams, resetProductParams} = catalogSlice.actions;