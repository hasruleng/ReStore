import { useEffect } from "react";
import { productSelectors, fetchProductsAsync, fetchFilters } from "../../features/catalog/catalogSlice";
import { useAppSelector, useAppDispatch } from "../store/configureStore";

export default function useProducts() {
    
    const products = useAppSelector(productSelectors.selectAll);
    const { productsLoaded, filtersLoaded, brands, types, metaData } = useAppSelector(state => state.catalog); //status: 'idle' | 'loading' | 'succeeded' | 'failed'
    const dispatch = useAppDispatch();

    useEffect(() => { //1st param: callback function
        if (!productsLoaded) dispatch(fetchProductsAsync());
    }, [productsLoaded, dispatch])

    useEffect(() => { //1st param: callback function
        if (!filtersLoaded) dispatch(fetchFilters());
    }, [filtersLoaded, dispatch])//2nd param: Dependency injector. if using empty array that means this is only ever going to be called once.
    //if forget to put the 2nd param, useEffect gonna be call everytime of render or rerender (could be infinite loop)

    return {
        products,
        productsLoaded,
        filtersLoaded,
        brands,
        types,
        metaData
    }
}