import { useEffect, useState } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";
import ProductList from "./ProductList";


export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll);
    const { productsLoaded, status } = useAppSelector(state => state.catalog); //status: 'idle' | 'loading' | 'succeeded' | 'failed'
    const dispatch = useAppDispatch();

    useEffect(() => { //1st param: callback function
        if (!productsLoaded) dispatch(fetchProductsAsync());
    }, [productsLoaded, dispatch])//2nd param: Dependency injector. if using empty array that means this is only ever going to be called once.
    //if forget to put the 2nd param, useEffect gonna be call everytime of render or rerender (could be infinite loop)

    if (status.includes('pending')) return <LoadingComponent message='Loading Products...' />

    return (
        <>
            <ProductList products={products} />
        </>
    )
}