import { products as initialProducts } from "./mocks/products.json";
import { Products } from "./components/Products.jsx";
import { useState } from "react";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { Cart } from "./components/Cart.jsx";
import { CartProvider } from "./context/cart.jsx";

function useFilters() {
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: 0,
  });

  const filterProducts = (products) => {
    return products.filter((product) => {
      return (
        product.price >= filters.minPrice &&
        (filters.category === "all" || product.category === filters.category)
      );
    });
  };

  return { filters, filterProducts, setFilters };
}

function CarritoCompras() {
  const [products] = useState(initialProducts);
  const { filters, filterProducts, setFilters } = useFilters(products);
  const filteredProducts = filterProducts(products);

  return (
    <>
      <div>
        <CartProvider>
          <Header changeFilters={setFilters} />
          <Cart></Cart>
          <Products products={filteredProducts} />;
          <Footer filters={filters} />
        </CartProvider>
      </div>
    </>
  );
}

export default CarritoCompras;
