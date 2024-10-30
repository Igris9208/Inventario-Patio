import { useState, useEffect, useRef } from "react";

export function validateInt() {
  const [stock, setStock] = useState("");
  const [stockError, setStockError] = useState("");
  const [price, setPrice] = useState("");
  const [precioCosto, setPrecioCosto] = useState("");
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  useEffect(() => {
    if (stock === "2") {
      event.preventDefault()
      setStockError("Por que 2");
      return;
    }
  }, [setStock]);

  return { search, updateSearch, error, stock, setStock, stockError };
}


export const handleKeyDown = (event) => {
    if (!/^\d$/.test(event.key) && event.key !== "Backspace" && event.key !== "Delete") {
        event.preventDefault(); // Previene la inserción del carácter no permitido
    }
};

export const handleKeyDownWithDot = (event) => {
    const value = (event.target.value);
    const key = event.key;

    // Permite 0-9, Backspace, Delete y punto solo si hay un número delante
    if (!/^\d$/.test(key) && key !== "Backspace" && key !== "Delete") {
        // Verifica si se está ingresando una coma o punto y si hay al menos un número antes de ellos
        if ((key === ".") && value && /^\d/.test(value)) {
            const hasDot = value.includes(".");
            if (hasDot) {
                event.preventDefault(); // Previene la inserción adicional de puntos
            }
        } else {
            event.preventDefault(); // Previene la inserción del carácter no permitido
        }
    }
};
