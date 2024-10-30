import { useCart } from "../hooks/useCart";
import "./Footer.css";

export function Footer({ filters }) {
 // const { filters } = useFilters();
  const { cart } = useCart();

  return (
    <footer className="footer">
      <h4>
        Prueba técnica de React ⚛️ － <span>@midudev</span>
      </h4>
      <h5>Shopping Cart con useContext & useReducer</h5>
    </footer>
  );
}
