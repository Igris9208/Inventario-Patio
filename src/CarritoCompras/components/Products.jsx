import "./Products.css";
import { AddToCartIcon, RemoveFromCartIcon } from "./Icons.jsx";
import { useCart } from "../hooks/useCart.js";

export function Products({ products }) {
  const { addToCart, removeFromCart, cart } = useCart();

  const checkProductInCart = (product) => {
    return cart.some((item) => item.id === product.id);
  };

  return (
    <main className="products">
      <ul>
        {products.slice(0, 10).map((products) => {
          const isProductInCart = checkProductInCart(products);
          return (
            <li key={products.id}>
              <img src={products.thumbnail} alt={products.title} />

              <div>
                <strong>{products.title}</strong> - ${products.price}
              </div>
              <div>
                <button style={{background : isProductInCart ? 'red' : '#09f'}}
                  onClick={() =>
                    isProductInCart
                      ? removeFromCart(products)
                      : addToCart(products)
                  }
                >
                  {isProductInCart ? <RemoveFromCartIcon /> : <AddToCartIcon />}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
