import { useReducer, createContext, useState } from "react";
import { cartReducer, cartInitialState } from "../reducers/cart.js";

export const CartContext = createContext();
/*
function useCartReducer () {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState)

  const addToCart = product => dispatch({
    type: 'ADD_TO_CART',
    payload: product
  })

  const removeFromCart = product => dispatch({
    type: 'REMOVE_FROM_CART',
    payload: product
  })

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  return { state, addToCart, removeFromCart, clearCart }
}
*/
// la dependencia de usar React Context
// es MÍNIMA
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const productInCartIndex = cart.findIndex((item) => item.id === product.id);

    // Si el producto esta en el carrito
    if (productInCartIndex >= 0) {
      const newCart = structuredClone(cart);
      newCart[productInCartIndex].quantity += 1;
      return setCart(newCart);
    }

    // Si no esta en el carrito
    setCart(prevState => ([...prevState, {...product, quantity: 1}]))
  };

  const removeFromCart = product => {
    setCart(prevState => prevState.filter(item => item.id != product.id))
  }

  const clearCart = () => {
    setCart([])
  };

  // const { state, addToCart, removeFromCart, clearCart } = useCartReducer()

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
