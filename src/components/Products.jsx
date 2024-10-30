import { useState } from "react";
import { useInv } from "../hooks/useInv";

export default function Products() {
  const { myProducts, totalPrice } = useInv();

  return (
    <main className="products">
      <h1>INVENTARIO</h1>
      <table>
        <tbody>
          <tr>
            <td>No.</td>
            <td>Nombre del Producto</td>
            <td>Unid. Medida</td>
            <td>Precio de Costo</td>
            <td>Cantidad</td>
            <td>Precio de Venta</td>
          </tr>
          {myProducts.map((product, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td align="left">
                <strong>{product.name}</strong>
              </td>
              <td align="left">{product.unidadMedida}</td>
              <td align="left">{product.precioCosto}</td>
              <td align="left">{product.stock}</td>
              <td align="left">${product.price}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="5" align="center">
              <strong>Total Entrada</strong>
            </td>
            <td align="left">
              <strong>${totalPrice}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
