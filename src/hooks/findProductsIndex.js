import { useState } from "react";
import { useInv } from "./useInv";

//Funcion para buscar si hay algun producto en el 
//inventario que coincida con el nombre y el precio de costo de la entrada

export function findProducts(name, precioCosto) {
  const { myProducts } = useInv();
  const indexProductsRepeat = [];

  if (name != "" && precioCosto != "") {
    for (let i = 0; i < myProducts.length; i++) {
      if (
        myProducts[i].name === name &&
        myProducts[i].precioCosto === precioCosto
      ) {
        indexProductsRepeat.push(i);
      }
    }
  }

  return indexProductsRepeat;
}
