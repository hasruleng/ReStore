
import { useEffect, useState } from "react";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";


export default function Catalog() { //desctructured from {props}: Props
    const [products, setProducts] = useState<Product[]>([]); //state

    useEffect(() => { //1st param: callback function
        fetch('http://localhost:5000/api/products')
            .then(response => response.json())
            .then(data => setProducts(data))
    }, [])//2nd param: empty array, if use empty array that means this is only ever going to be called once.
    //if forget to put the 2nd param, useEffect gonna be call everytime of render or rerender (could be infinite loop)


    return (
        <>
            <ProductList products={products} />
        </>
    )
}