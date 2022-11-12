import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Basket } from "../models/basket";

interface StoreContextValue { //berisi states (three properties) to go and set the baskets
    basket: Basket | null;
    setBasket: (basket: Basket) => void;
    removeItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function useStoreContext() { //this gives us access to our context, and three props above
    const context = useContext(StoreContext);

    if (context === undefined){
        throw Error('Oops - we do not seem to be inside the provider');
    }
    return context;
}

export function StoreProvider({children}: PropsWithChildren<any>){
    const [basket, setBasket] = useState<Basket | null>(null); //ur states is going to be our basket, or it's going to be null.
    function removeItem(productId: number, quantity: number){
        if(!basket) return;
        const items = [...basket.items]; //create a copy of items in our basket, and replace existing states (basket)
        const itemIndex = items.findIndex(i=> i.productId === productId)
        if (itemIndex >=0){
            items[itemIndex].quantity -= quantity;
            if(items[itemIndex].quantity ===0) items.splice(itemIndex, 1);
            setBasket(prevState =>{
                return {...prevState!, items}
            })
        }
    }
    return (
        <StoreContext.Provider value={{basket, setBasket, removeItem}}>
            {children}
        </StoreContext.Provider>
    )
}