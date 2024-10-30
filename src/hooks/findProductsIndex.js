import { useState } from "react";
import { useInv } from "./useInv";

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
