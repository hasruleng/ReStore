import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Catalog from "../../features/catalog/Catalog";
import { Product } from "../models/product";


function App() { // functional component, a function that return jsx (html a look-alike)
  const [products, setProducts] = useState<Product[]>([]); //state

  useEffect(()=>{ //1st param: callback function
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
  }, [])//2nd param: empty array, if use empty array that means this is only ever going to be called once.
  //if forget to put the 2nd param, useEffect gonna be call everytime of render or rerender (could be infinite loop)

  function addProduct(){
    setProducts(prevState => [...prevState, 
    {
      id:prevState.length*101,
      name: 'product'+(prevState.length+1), 
      price: ((prevState.length*100)+100),
      brand: 'some brand',
      pictureUrl: 'http://picsum.photos/'+prevState.length*101
    }])
  }

  return ( 
    <>
      <Typography variant='h1'>Re-Store</Typography>
      {/* <h1 style={{color:'blue'}}>Re-store</h1> */}
      <Catalog products={products} addProduct={addProduct} /> 
   
    </>
  );
}

export default App;
