import { useEffect, useState } from "react";


function App() { // functional component, a function that return jsx (html a look-alike)
  const [products, setProducts] = useState([
    {name: 'product1', price: 100.00},
    {name: 'product2', price: 200.00}
  ]);

  useEffect(()=>{ //1st param: callback function
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
  }, [])//2nd param: empty array, if use empty array that means this is only ever going to be called once.
  //if forget to put the 2nd param, useEffect gonna be call everytime of render or rerender (could be infinite loop)

  function addProduct(){
    setProducts(prevState => [...prevState, 
      {name: 'product'+(prevState.length+1) , price: ((prevState.length*100)+100)}])
  }

  return ( 
    <div className='app'>
      <h1 style={{color:'blue'}}>Re-store</h1>
      <ul>
        {products.map((item, index) =>(
          <li key={index}>{item.name} - {item.price}</li>
        ))}
      </ul>
      <button onClick={addProduct}>Add Product</button>
   
    </div>
  );
}

export default App;
