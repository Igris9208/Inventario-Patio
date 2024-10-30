import { useState, useEffect, useRef } from "react";
import { useInv } from "../hooks/useInv";

export function useLabel(name, precioCosto) {
  const { myProducts, facturas } = useInv();
  const precioCostoLabel = [];
  const productLabel = [];
  const unidadMedidaLabel = [];
  const originLabel = [];
 

  facturas.forEach((product) => {
    if (!originLabel.includes(product.origin)) {
      originLabel.push(product.origin);
    }
  });

  myProducts.forEach((product) => {
    if (!productLabel.includes(product.name)) {
      precioCosto
        ? precioCosto === product.precioCosto.toString()
          ? productLabel.push(product.name)
          : true
        : productLabel.push(product.name);
    }
    if (!precioCostoLabel.includes(product.precioCosto.toString())) {
      name
        ? name.toLowerCase() === product.name.toLowerCase()
          ? precioCostoLabel.push(product.precioCosto.toString())
          : true
        : precioCostoLabel.push(product.precioCosto.toString());
    }
    if (!unidadMedidaLabel.includes(product.unidadMedida)) {
      unidadMedidaLabel.push(product.unidadMedida);
    }
  });
  return {
    productLabel,
    precioCostoLabel,
    unidadMedidaLabel,
    originLabel,
  };
}
