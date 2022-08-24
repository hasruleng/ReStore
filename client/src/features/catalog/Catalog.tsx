import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";


export default function Catalog() { //desctructured from {props}: Props
    const [products, setProducts] = useState<Product[]>([]); //state
    const [loading, setLoading] = useState(true);

    useEffect(() => { //1st param: callback function
        agent.Catalog.list()
        .then(products => setProducts(products))
        .catch(error=>console.log(error))
        .finally(()=>setLoading(false))
    }, [])//2nd param: empty array, if use empty array that means this is only ever going to be called once.
    //if forget to put the 2nd param, useEffect gonna be call everytime of render or rerender (could be infinite loop)

    if (loading) return <LoadingComponent message='Loading Products...'/>

    return (
        <>
            <ProductList products={products} />
        </>
    )
}