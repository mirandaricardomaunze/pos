import React, { createContext, useContext, useState} from "react";
import type { ProductFormData } from "../../types/product";


interface cartItem extends ProductFormData{
    quantityInCart:number;
}

interface CartContextProps{
    items:cartItem[];
    addToCart:(product:ProductFormData)=>void;
    removeFromCart:(id:number)=>void;
    clearCart:()=>void;
}


const CartContext=createContext<CartContextProps| undefined>(undefined)
export const CartProvider=({children}:{children:React.ReactNode})=>{
   const [items,setItems]=useState<cartItem[]>([])
   const addToCart=(product:ProductFormData)=>{
    setItems((preveItems)=>{
        const existing=preveItems.find((item)=>item.id==product.id)
        if (existing) {
            return preveItems.map((item)=>item.id===product.id?
            {...item, quantityInCart:item.quantityInCart+1}:item
        );
            
        }
        return [...preveItems,{...product,quantityInCart:1}]
    })
   };

   const removeFromCart=(id:number)=>{
     setItems((prevItems)=>prevItems.filter((item)=>item.id!==id))
   };

   const clearCart=()=>setItems([]);

   return (
     <CartContext.Provider value={{addToCart,removeFromCart,clearCart,items}}>
       {children}
     </CartContext.Provider> 
   )
}

export const useShoppingCart=()=>{
    const context=useContext(CartContext);
    if (!context) {
        throw new Error('useShoppingCart deve estar dentro do CartProvider');
        
    }
    return context;
}