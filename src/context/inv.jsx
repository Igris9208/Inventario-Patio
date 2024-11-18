import { useReducer, createContext, useState } from "react";
import { products } from "../JSON/products.json";
import { Category } from "@mui/icons-material";

export const InvContext = createContext();

export function InvProvider({ children }) {
  const [myProducts, setMyProducts] = useState(products);
  const [trasladesToSellArea, setTrasladesToSellArea] = useState([]);
  const [ventasDiarias, setVentasDiarias] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [traslados, setTraslados] = useState([]);
  const [indexProductChange, setIndexProductCHange] = useState(null);
  const [autenticate, setAutenticate] = useState(false);

  const changeAutenticate = () => {
    setAutenticate(true);
  };

  const changeSellAreaStock = (product) => {
    let index = myProducts.findIndex((prod) => prod.id === product.productID);
    let auxiliar = myProducts;
    auxiliar[index].sellStock += +product.productToSellArea;
    setMyProducts(auxiliar);
    let addProductToSellArea = trasladesToSellArea;
    addProductToSellArea.push(product);
    setTrasladesToSellArea(addProductToSellArea);
  };

  const changeIndex = (index) => {
    setIndexProductCHange(index === indexProductChange ? null : index);
  };

  const lessToInv = (products, type) => {
    let addProductToSellDay = ventasDiarias;
    let lessTraslados = traslados;
    let lessProduct = myProducts;

    products.forEach((product) => {
      let index = myProducts.findIndex((prod) => prod.id === product.id);
      if (type === "Salidas") {
        lessProduct[index].stock -=
          +product.sellVale + +product.sellPos + +product.sellInLine;
        lessProduct[index].sellStock -=
          +product.sellVale + +product.sellPos + +product.sellInLine;
        addProductToSellDay.push(product);
      }
      if (type === "Traslado") {
        lessProduct[index].stock -= product.stock;
        lessProduct[index].sellStock < product.stock
          ? (lessProduct[index].sellStock = 0)
          : (lessProduct[index].sellStock -= product.stock);
        lessTraslados.push(product);
      }
    });
    setMyProducts(lessProduct);
    setTraslados(lessTraslados);
    setVentasDiarias(addProductToSellDay);
  };

  const addToInv = (newProducts, type) => {
    let addFactura = facturas;
    let addTraslados = traslados;
    let addProduct = myProducts;
    newProducts.forEach((product) => {
      if (product.id != "") {
        let index = myProducts.findIndex((prod) => prod.id === product.id);
        addProduct[index].stock += product.stock;
        type === "Factura"
          ? addFactura.push({ ...product })
          : addTraslados.push({ ...product });
      } else {
        let auxiliarID = myProducts[myProducts.length - 1].id + +1;
        addProduct.push({
          id: auxiliarID,
          name: product.name,
          stock: product.totalStock,
          sellStock: product.sellStock,
          price: product.price,
          precioCosto: product.precioCosto,
          unidadMedida: product.unidadMedida,
          category: product.category,
          sellPrice: product.sellPrice,
        });
        setMyProducts(addProduct);
        type === "Factura"
          ? addFactura.push({ ...product, id: auxiliarID })
          : addTraslados.push({ ...product, id: auxiliarID });
      }
    });
    setMyProducts(addProduct);
    type === "Factura" ? setFacturas(addFactura) : setTraslados(addTraslados);
  };

  const totalPrice = myProducts.reduce(
    (accumulate, current) => accumulate + parseFloat(current.price),
    0
  );

  return (
    <InvContext.Provider
      value={{
        myProducts,
        addToInv,
        totalPrice,
        facturas,
        lessToInv,
        changeIndex,
        indexProductChange,
        changeSellAreaStock,
        ventasDiarias,
        autenticate,
        changeAutenticate,
      }}
    >
      {children}
    </InvContext.Provider>
  );
}
