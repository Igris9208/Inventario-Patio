import { useState, useRef } from "react";
import { useInv } from "../hooks/useInv";
import Button from "@mui/material/Button";
import "./Entradas.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useLabel } from "../hooks/label";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import { handleKeyDownWithDot } from "../hooks/validateInt";
import { SalidaTable } from "../hooks/showtable";

export default function Salidas() {
  const [newProducts, setNewProducts] = useState([]);
  const [productID, setProductID] = useState("");
  const [sellVale, setSellVale] = useState("");
  const [importVale, setImportVale] = useState("");
  const [sellPos, setSellPos] = useState("");
  const [importPos, setImportPos] = useState("");
  const [sellInLine, setSellInLine] = useState("");
  const [importInLine, setImportInLine] = useState("");
  const [fecha, setFecha] = useState(dayjs());
  const [fechaTransferSellArea, setFechaTransferSellArea] = useState(dayjs());
  const [name, setName] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [stock, setStock] = useState("");
  const [finalSellStock, setFinalSellStock] = useState("");
  const [sellStock, setSellStock] = useState("");
  const [price, setPrice] = useState("");
  const [precioCosto, setPrecioCosto] = useState("");
  const { lessToInv, indexProductChange, myProducts, changeSellAreaStock } =
    useInv();
  const [addcrash, setAddCrash] = useState(false);
  const [key, setKey] = useState(true);

  const [addSellCheck, setAddSellCheck] = useState(false);
  const [productToSellArea, setProductToSellArea] = useState("");
  const [addProductToSellAreaError, setAddProductToSellAreaError] =
    useState(false);

  const [changeCheck, setChangeCheck] = useState(false);
  const [errorInSAlida, setErrorInSalida] = useState(false);
  const { productLabel, precioCostoLabel } = useLabel(name, precioCosto);
  const [productToCHange, setProductToChange] = useState(null);
  const [indexProductsRepeat, setIndexProductsRepeat] = useState([]);
  const [indexPosition, setIndexPosition] = useState(0);
  const [indexPositionInMyProducts, setIndexPositionInMyProducts] =
    useState("");

  const findProduct = () => {
    if (name === "" || precioCosto === "") {
      setAddCrash(true);
      return;
    } else {
      let index = "";
      if (indexProductsRepeat.length === 0) {
        const auxiliar = [];
        for (let i = 0; i < myProducts.length; i++) {
          if (
            myProducts[i].name === name &&
            myProducts[i].precioCosto.toString() === precioCosto
          ) {
            auxiliar.push(i);
          }
        }
        setIndexProductsRepeat(auxiliar);
        index = auxiliar[0];
      } else {
        if (indexProductsRepeat.length > 1) {
          index =
            indexProductsRepeat[indexPosition % indexProductsRepeat.length];
          setIndexPosition(indexPosition + 1);
        }
      }

      if (newProducts.length > 0) {
        let indexIDRepeat = newProducts.findIndex(
          (prod) => prod.productID === myProducts[index].id
        );
        if (indexIDRepeat != -1) {
          modifiProduct(indexIDRepeat);
        } else {
          setUnidadMedida(myProducts[index].unidadMedida);
          setPrice(myProducts[index].price);
          setStock(myProducts[index].stock);
          setSellStock(myProducts[index].sellStock);
          setProductID(myProducts[index].id);
        }
      } else {
        setUnidadMedida(myProducts[index].unidadMedida);
        setPrice(myProducts[index].price);
        setStock(myProducts[index].stock);
        setSellStock(myProducts[index].sellStock);
        setProductID(myProducts[index].id);
      }
      setIndexPositionInMyProducts(index);
    }
  };

  const findClear = () => {
    setName("");
    setUnidadMedida("");
    setStock("");
    setPrecioCosto("");
    setPrice("");
    setSellStock("");
    setSellVale("");
    setSellPos("");
    setSellInLine("");
    setImportVale("");
    setImportPos("");
    setImportInLine("");
    setIndexPosition(0);
    setIndexProductsRepeat([]);
    setKey(!key);
    setAddCrash(false);
    setAddSellCheck(false)
  };

  const addProductToSellArea = () => {
    if (addSellCheck === false) {
      setAddSellCheck(true);
      return;
    } else {
      if (productToSellArea === "") {
        setAddSellCheck(false);
        return;
      } else {
        let auxiliar = {
          fecha,
          productID,
          name,
          precioCosto,
          unidadMedida,
          price,
          stock,
          initialSellStock: sellStock,
          productToSellArea,
          finalSellStock: sellStock + +productToSellArea,
          type: "Sin Vale",
        };
        changeSellAreaStock(auxiliar);
        setProductToSellArea("");
        setAddSellCheck(false);
        setSellStock(myProducts[indexPositionInMyProducts].sellStock);
      }
    }
  };

  const validateIntDates = (valor, tipo) => {
    let auxiliar = 0;
    if (tipo === "VentaPos") {
      setSellVale(valor);
      setImportVale(valor * price);
      auxiliar = sellStock - sellInLine - sellPos - valor;
      setFinalSellStock(auxiliar);
      setErrorInSalida(auxiliar < 0 ? true : false);
      return;
    }

    if (tipo === "POS") {
      setSellPos(valor);
      setImportPos(valor * price);
      auxiliar = sellStock - sellInLine - sellVale - valor;
      setFinalSellStock(auxiliar);
      setErrorInSalida(auxiliar < 0 ? true : false);
      return;
    }

    if (tipo === "PagoLinea") {
      setSellInLine(valor);
      setImportInLine(valor * price);
      auxiliar = sellStock - sellVale - sellPos - valor;
      setFinalSellStock(auxiliar);
      setErrorInSalida(auxiliar < 0 ? true : false);
      return;
    }
    if (tipo === "Transferir") {
      setProductToSellArea(valor);
      setAddProductToSellAreaError(valor > stock - sellStock ? true : false);
      return;
    }
  };

  const clearNewProduct = (indexProductChange) => {
    const auxiliar = [...newProducts];
    auxiliar.splice(indexProductChange, 1);
    setNewProducts(auxiliar);
  };

  const modifiProduct = (index) => {
    setFecha(newProducts[index].fecha);
    setName(newProducts[index].name);
    setUnidadMedida(newProducts[index].unidadMedida);
    setStock(newProducts[index].stock);
    setPrecioCosto(newProducts[index].precioCosto);
    setPrice(newProducts[index].price);
    setSellStock(newProducts[index].sellStock);
    setSellVale(newProducts[index].sellVale);
    setImportVale(newProducts[index].importVale);
    setSellPos(newProducts[index].sellPos);
    setImportPos(newProducts[index].importPos);
    setSellInLine(newProducts[index].sellInLine);
    setImportInLine(newProducts[index].importInLine);

    setChangeCheck(true);
    setProductToChange(index);
  };

  const modifiInvButton = () => {
    lessToInv(newProducts);
    setNewProducts([]);
  };

  const addProduct = () => {
    event.preventDefault();
    if (changeCheck === true) {
      if (
        fecha === "" ||
        name === "" ||
        precioCosto === "" ||
        (!sellVale && !sellPos && !sellInLine)
      ) {
        setAddCrash(true);
        return;
      } else {
        const auxiliar = [...newProducts];
        auxiliar[productToCHange].fecha = fecha;
        auxiliar[productToCHange].precioCosto = precioCosto;
        auxiliar[productToCHange].name = name;
        auxiliar[productToCHange].unidadMedida = unidadMedida;
        auxiliar[productToCHange].stock = stock;
        auxiliar[productToCHange].price = price;
        auxiliar[productToCHange].sellStock = sellStock;
        auxiliar[productToCHange].sellVale = sellVale;
        auxiliar[productToCHange].importVale = importVale;
        auxiliar[productToCHange].sellPos = sellPos;
        auxiliar[productToCHange].importPos = importPos;
        auxiliar[productToCHange].sellInLine = sellInLine;
        auxiliar[productToCHange].importInLine = importInLine;

        setNewProducts(auxiliar);
        setName("");
        setUnidadMedida("");
        setStock("");
        setPrecioCosto("");
        setPrice("");
        setSellStock("");
        setSellVale("");
        setSellPos("");
        setSellInLine("");
        setImportVale("");
        setImportPos("");
        setImportInLine("");
        setIndexPosition(0);
        setIndexProductsRepeat([]);
        setKey(!key);
        setChangeCheck(false);
      }
    } else {
      if (
        fecha === "" ||
        name === "" ||
        precioCosto === "" ||
        (!sellVale && !sellPos && !sellInLine)
      ) {
        setAddCrash(true);
        return;
      } else {
        setName("");
        setUnidadMedida("");
        setStock("");
        setPrecioCosto("");
        setPrice("");
        setSellStock("");
        setSellVale("");
        setSellPos("");
        setSellInLine("");
        setImportVale("");
        setImportPos("");
        setImportInLine("");
        setIndexPosition(0);
        setIndexProductsRepeat([]);
        setKey(!key);
        setAddCrash(false);
        setNewProducts([
          ...newProducts,
          {
            fecha,
            productID,
            name,
            precioCosto,
            unidadMedida,
            price,
            stock,
            sellStock,
            sellVale,
            importVale,
            sellPos,
            importPos,
            sellInLine,
            importInLine,
            finalSellStock,
          },
        ]);
      }
    }
  };

  const defaultPrecioCosto = {
    options: precioCostoLabel,
  };

  const defaultName = {
    options: productLabel,
  };

  return (
    <main className="products">
      <h2>SALIDAS</h2>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={2}>
          <Grid item xs={12} container columnSpacing={0}>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disabled={newProducts.length > 0 ? true : false}
                  label="Fecha"
                  value={fecha}
                  format="DD/MM/YYYY"
                  onChange={(newValue) => {
                    setFecha(newValue);
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          {indexProductsRepeat.length > 1 && (
            <Grid
              item
              xs={12}
              container
              columnSpacing={0}
              alignItems={"center"}
            >
              <Grid item alignItems={"center"}>
                <p>
                  Existen {indexProductsRepeat.length} productos con esas
                  caracteristicas. Mostrando producto #{" "}
                  <strong>
                    {(indexPosition % indexProductsRepeat.length) + 1}
                  </strong>{" "}
                </p>
              </Grid>
            </Grid>
          )}
          <Grid item xs={12} container columnSpacing={1} alignItems={"center"}>
            <Grid item xs={1.7}>
              <Autocomplete
                disabled={addSellCheck === false ? false : true}
                {...defaultPrecioCosto}
                id="Precio de Costo"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={addcrash ? (precioCosto ? false : true) : false}
                    label="Precio de Costo"
                  />
                )}
                inputValue={precioCosto.toString()}
                onKeyDown={handleKeyDownWithDot}
                onInputChange={(ev) =>
                  ev ? setPrecioCosto(ev.target.value) : true
                }
                onChange={(e, value) => (value ? setPrecioCosto(value) : true)}
                key={key}
              />
            </Grid>
            <Grid item xs={5}>
              <Autocomplete
                disabled={addSellCheck === false ? false : true}
                {...defaultName}
                id="Nombre del Producto"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nombre del Producto"
                    error={addcrash ? (name ? false : true) : false}
                  />
                )}
                inputValue={name}
                onInputChange={(ev) => (ev ? setName(ev.target.value) : true)}
                onChange={(e, value) => (value ? setName(value) : true)}
                key={key}
              />
            </Grid>
            <Grid item xs={1}>
              <TextField disabled label="U/M" value={unidadMedida} />
            </Grid>
            <Grid item xs={1}>
              <TextField
                disabled
                id="outlined-basic"
                label="Cantidad"
                variant="outlined"
                value={stock.toString()}
              />
            </Grid>

            <Grid item xs={1}>
              <TextField
                disabled
                id="outlined-basic"
                label="Precio"
                variant="outlined"
                value={price}
                InputProps={{
                  startAdornment:
                    price != "" ? (
                      <InputAdornment position="start">$</InputAdornment>
                    ) : (
                      ""
                    ),
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <Button
                color="info"
                variant="contained"
                onClick={findProduct}
                disabled={addSellCheck}
              >
                {indexProductsRepeat.length <= 1 ? "SHEARCH" : "NEXT"}
              </Button>
            </Grid>
            <Grid item xs={1}>
              <Button color="info" variant="contained" onClick={findClear}>
                CLEAR
              </Button>
            </Grid>
          </Grid>
          {stock != "" && (
            <>
              <Grid
                item
                xs={12}
                container
                columnSpacing={1}
                alignItems={"center"}
              >
                <Grid item xs={1}>
                  <TextField
                    disabled
                    id="outlined-basic"
                    label="En Venta"
                    variant="outlined"
                    value={sellStock.toString()}
                  />
                </Grid>
                <Grid item xs={1}>
                  <Button
                    color="info"
                    variant="contained"
                    onClick={addProductToSellArea}
                  >
                    {addSellCheck === true ? "Cancel" : "Adicionar"}
                  </Button>
                </Grid>
                <Grid item xs={1} marginLeft={5}>
                  <TextField
                    disabled={sellStock === "" ? true : false}
                    error={errorInSAlida ? (sellVale ? true : false) : false}
                    id="outlined-basic"
                    label="V. POS"
                    variant="outlined"
                    value={sellVale}
                    onKeyDown={handleKeyDownWithDot}
                    onChange={(ev) =>
                      validateIntDates(ev.target.value, "VentaPos")
                    }
                  />
                </Grid>
                <Grid item xs={1}>
                  <TextField
                    disabled
                    id="outlined-basic"
                    label="Importe"
                    variant="outlined"
                    value={importVale}
                    InputProps={{
                      startAdornment:
                        importVale != "" ? (
                          <InputAdornment position="start">$</InputAdornment>
                        ) : (
                          ""
                        ),
                    }}
                  />
                </Grid>

                <Grid item xs={1} marginLeft={5}>
                  <TextField
                    disabled={sellStock === "" ? true : false}
                    error={errorInSAlida ? (sellPos ? true : false) : false}
                    id="outlined-basic"
                    label="POS"
                    variant="outlined"
                    value={sellPos}
                    onKeyDown={handleKeyDownWithDot}
                    onChange={(ev) => validateIntDates(ev.target.value, "POS")}
                  />
                </Grid>
                <Grid item xs={1}>
                  <TextField
                    disabled
                    id="outlined-basic"
                    label="Importe"
                    variant="outlined"
                    value={importPos}
                    InputProps={{
                      startAdornment:
                        importPos != "" ? (
                          <InputAdornment position="start">$</InputAdornment>
                        ) : (
                          ""
                        ),
                    }}
                  />
                </Grid>
                <Grid item xs={1} marginLeft={5}>
                  <TextField
                    disabled={sellStock === "" ? true : false}
                    error={errorInSAlida ? (sellInLine ? true : false) : false}
                    id="outlined-basic"
                    label="P. Linea"
                    variant="outlined"
                    value={sellInLine}
                    onKeyDown={handleKeyDownWithDot}
                    onChange={(ev) =>
                      validateIntDates(ev.target.value, "PagoLinea")
                    }
                  />
                </Grid>
                <Grid item xs={1}>
                  <TextField
                    disabled
                    id="outlined-basic"
                    label="Importe"
                    variant="outlined"
                    value={importInLine}
                    InputProps={{
                      startAdornment:
                        importInLine != "" ? (
                          <InputAdornment position="start">$</InputAdornment>
                        ) : (
                          ""
                        ),
                    }}
                  />
                </Grid>
                <Grid item xs={1.5}>
                  <TextField
                    disabled
                    id="outlined-basic"
                    label="Existencia Final"
                    variant="outlined"
                    value={finalSellStock}
                  />
                </Grid>
              </Grid>
            </>
          )}
          {addSellCheck === true && (
            <>
              <Grid
                item
                xs={12}
                container
                columnSpacing={1}
                alignItems={"center"}
              >
                <Grid item xs={12}>
                  <h1>Transferencia a Ventas</h1>
                </Grid>
                <Grid item xs={2}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Fecha"
                      value={fechaTransferSellArea}
                      format="DD/MM/YYYY"
                      onChange={(newValue) => {
                        setFechaTransferSellArea(newValue);
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={1.5}>
                  <TextField
                    disabled
                    id="outlined-basic"
                    label="Existencia Total"
                    variant="outlined"
                    value={stock.toString()}
                  />
                </Grid>
                <Grid item xs={1.5}>
                  <TextField
                    disabled
                    id="outlined-basic"
                    label="Existencia Almacen"
                    variant="outlined"
                    value={(stock - sellStock).toString()}
                  />
                </Grid>
                <Grid item xs={1.5}>
                  <TextField
                    disabled
                    id="outlined-basic"
                    label="Existencia Ventas"
                    variant="outlined"
                    value={sellStock.toString()}
                  />
                </Grid>
                <Grid item xs={2} marginLeft={5}>
                  <TextField
                    error={addProductToSellAreaError}
                    id="outlined-basic"
                    label="Cantidad a Transferir"
                    variant="outlined"
                    value={productToSellArea}
                    onKeyDown={handleKeyDownWithDot}
                    onChange={(ev) =>
                      validateIntDates(ev.target.value, "Transferir")
                    }
                  />
                </Grid>
                <Grid item xs={1}>
                  <Button
                    disabled={addProductToSellAreaError}
                    color="info"
                    variant="contained"
                    onClick={addProductToSellArea}
                  >
                    {productToSellArea === "" ? "Cancel" : "Adicionar"}
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
          {addSellCheck === false && (
            <>
              <Grid item xs={12} container columnSpacing={1}>
                <Grid item xs={12}>
                  <Button color="info" variant="contained" onClick={addProduct}>
                    {changeCheck === true ? "Modificar" : "Adicionar"}
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
        <Grid item xs={12} margin={2}>
          {newProducts.length > 0 && (
            <>
              <Grid item xs={12}>
                <SalidaTable newProducts={newProducts} />
              </Grid>

              <Grid item xs={12} margin={2} container columnSpacing={1}>
                {indexProductChange != null && (
                  <>
                    <Grid item>
                      <Button
                        color="info"
                        variant="contained"
                        onClick={() => modifiProduct(indexProductChange)}
                      >
                        Modificar
                      </Button>
                    </Grid>{" "}
                    <Grid item>
                      <Button
                        color="info"
                        variant="contained"
                        onClick={() => clearNewProduct(indexProductChange)}
                      >
                        Eliminar
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid item xs={12} margin={2}>
                {changeCheck === false && (
                  <>
                    <Grid item xs={12}>
                      <Button
                        color="info"
                        variant="contained"
                        onClick={() => modifiInvButton()}
                      >
                        Ejecutar Operacion
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </main>
  );
}
