import { Basket } from "../models/basket";

export function getCookie(key: string) {
    const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
}

export function currencyFormat (amount: number){
    return '$'+(amount/100).toFixed(2);
}

export function totalQuantity (basket: Basket | null){
    if (basket ===null){
        return 0;
    }
    return basket?.items.reduce((sum, item) => sum + item.quantity, 0) ;
}