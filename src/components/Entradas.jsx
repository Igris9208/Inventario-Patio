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
import { FacTable } from "../hooks/showtable";
import { findProducts } from "../hooks/findProductsIndex";
import Typography from "@mui/material/Typography";

export default function Entradas() {
  const [newProducts, setNewProducts] = useState([]);
  const [origin, setOriging] = useState("");
  const [fact, setFact] = useState("");
  const [fecha, setFecha] = useState(dayjs());
  const [name, setName] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [precioCosto, setPrecioCosto] = useState("");
  const { addToInv, indexProductChange, myProducts } = useInv();
  const [addcrash, setAddCrash] = useState(false);
  const [key, setKey] = useState(true);
  const [changeCheck, setChangeCheck] = useState(false);
  const { productLabel, precioCostoLabel, unidadMedidaLabel, originLabel } =
    useLabel(name, precioCosto);
  const [productToCHange, setProductToChange] = useState(null);
  let sellStock;
  let category;

  const [checkFind, setCheckFind] = useState(false);
  const indexProductsRepeat = findProducts(name, precioCosto);
  const [indexPosition, setIndexPosition] = useState(0);
  const [sellPrice, setSellPrice] = useState("");
  const [actualStock, setActualStock] = useState("");
  const [idProductRepeat, setIDProductRepeat] = useState("");

  const changeProductFounded = () => {
    setCheckFind(true);
    let index = "";
    if (indexProductsRepeat.length > 1) {
      index = indexProductsRepeat[indexPosition % indexProductsRepeat.length];
      setIndexPosition(indexPosition + 1);
    } else {
      index = indexProductsRepeat[0];
    }
    setSellPrice(myProducts[index].sellPrice);
    setActualStock(myProducts[index].stock);
    setIDProductRepeat(myProducts[index].id);
    setUnidadMedida(myProducts[index].unidadMedida);
  };

  const clearNewProduct = (indexProductChange) => {
    const auxiliar = [...newProducts];
    auxiliar.splice(indexProductChange, 1);
    setNewProducts(auxiliar);
  };

  const modifiProduct = (indexProductChange) => {
    setFact(newProducts[indexProductChange].fact);
    setFecha(newProducts[indexProductChange].fecha);
    setOriging(newProducts[indexProductChange].origin);
    setName(newProducts[indexProductChange].name);
    setUnidadMedida(newProducts[indexProductChange].unidadMedida);
    setStock(newProducts[indexProductChange].stock);
    setPrecioCosto(newProducts[indexProductChange].precioCosto);
    setPrice(newProducts[indexProductChange].price);
    setChangeCheck(true);
    setProductToChange(indexProductChange);
  };

  const addInvButton = () => {
    addToInv(newProducts);
    setNewProducts([]);
  };

  const addProduct = () => {
    event.preventDefault();
    if (changeCheck === true) {
      if (
        fact === "" ||
        fecha === "" ||
        name === "" ||
        unidadMedida === "" ||
        stock === "" ||
        origin === "" ||
        price === ""
      ) {
        setAddCrash(true);
        return;
      } else {
        const auxiliar = [...newProducts];
        auxiliar[productToCHange].fact = fact;
        auxiliar[productToCHange].fecha = fecha;
        auxiliar[productToCHange].name = name;
        auxiliar[productToCHange].origin = origin;
        auxiliar[productToCHange].unidadMedida = unidadMedida;
        auxiliar[productToCHange].stock = stock;
        auxiliar[productToCHange].precioCosto = precioCosto;
        auxiliar[productToCHange].price = price;
        setNewProducts(auxiliar);
        setOriging("");
        setFact("");
        setName("");
        setUnidadMedida("");
        setStock("");
        setPrecioCosto("");
        setPrice("");
        setKey(!key);
        setChangeCheck(false);
      }
    } else {
      if (
        fact === "" ||
        fecha === "" ||
        name === "" ||
        unidadMedida === "" ||
        stock === "" ||
        price === ""
      ) {
        setAddCrash(true);
        return;
      } else {
        let calcTotalStock = actualStock ? actualStock + +stock : stock;
        setCheckFind(false);
        setName("");
        setUnidadMedida("");
        setStock("");
        setPrecioCosto("");
        setPrice("");
        setKey(!key);
        setActualStock("");
        setAddCrash(false);
        setNewProducts([
          ...newProducts,
          {
            fact,
            name,
            fecha,
            stock,
            price,
            precioCosto,
            unidadMedida,
            origin,
            id: idProductRepeat,
            totalStock: calcTotalStock,
            sellPrice,
            sellStock,
            category,
          },
        ]);
      }
    }
  };

  const calcInt = (value, selec) => {
    if (selec === "costPrice") {
      setPrecioCosto(value.toString());
      setPrice(value * stock);
    } else {
      setPrecioCosto((value / stock).toString());
      setPrice(value);
    }
  };

  const defaultPrecioCosto = {
    options: precioCostoLabel,
  };

  const defaultOrigin = {
    options: originLabel,
  };

  const defaultName = {
    options: productLabel,
  };

  const defaultUnidadMedida = {
    options: unidadMedidaLabel,
  };
  console.log(newProducts.length);
  return (
    <main className="products">
      <h1>Nueva Factura</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={2}>
          <Grid item xs={12} container columnSpacing={0}>
            <Grid item xs={6}>
              <TextField
                disabled={newProducts.length > 0 ? true : false}
                error={addcrash ? (fact ? false : true) : false}
                id="outlined-basic"
                label="Factura"
                variant="outlined"
                value={fact}
                onChange={(ev) => setFact(ev.target.value)}
              />
            </Grid>

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
          <Grid item xs={12} container columnSpacing={1}>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                {...defaultOrigin}
                id="Procedencia"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Procedencia"
                    error={addcrash ? (origin ? false : true) : false}
                  />
                )}
                inputValue={origin}
                onInputChange={(ev) =>
                  ev ? setOriging(ev.target.value) : true
                }
                onChange={(e, value) => (value ? setOriging(value) : true)}
                key={key}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} container alignItems={"center"} spacing={1}>
            <Grid item xs={4}>
              <Autocomplete
                freeSolo
                {...defaultName}
                id="Nombre del Producto"
                disabled={checkFind}
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
            <Grid item xs={2}>
              <Autocomplete
                freeSolo
                sx={{ width: 200 }}
                {...defaultUnidadMedida}
                id="Unidad de Medida"
                disabled={checkFind}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Unidad de Medida"
                    error={addcrash ? (unidadMedida ? false : true) : false}
                  />
                )}
                inputValue={unidadMedida}
                onInputChange={(ev) =>
                  ev ? setUnidadMedida(ev.target.value) : true
                }
                onChange={(e, value) => (value ? setUnidadMedida(value) : true)}
                key={key}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                error={addcrash ? (stock ? false : true) : false}
                id="outlined-basic"
                type="number"
                label="Entrada por Fact."
                variant="outlined"
                value={stock.toString()}
                onKeyDown={handleKeyDownWithDot}
                onChange={(ev) => setStock(ev.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <Autocomplete
                freeSolo
                {...defaultPrecioCosto}
                id="Precio de Costo"
                disabled={stock ? (checkFind ? true : false) : true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={addcrash ? (precioCosto ? false : true) : false}
                    label="Precio de Costo"
                  />
                )}
                inputValue={precioCosto.toString()}
                onInputChange={(ev) =>
                  ev ? calcInt(ev.target.value, "costPrice") : true
                }
                onKeyDown={handleKeyDownWithDot}
                onChange={(e, value) =>
                  value ? calcInt(value, "costPrice") : true
                }
                key={key}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                error={addcrash ? (price ? false : true) : false}
                disabled={stock ? (checkFind ? true : false) : true}
                id="outlined-basic"
                type="text"
                label="Costo por Fact."
                variant="outlined"
                value={price}
                onKeyDown={handleKeyDownWithDot}
                onChange={(ev) => calcInt(ev.target.value, "price")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          {indexProductsRepeat.length > 0 && (
            <Grid item xs={12} container spacing={1} alignItems={"center"}>
              <Grid item xs={2.8} alignItems={"center"}>
                {checkFind === false && (
                  <Grid item>
                    <Typography noWrap>
                      Existen {indexProductsRepeat.length} productos similares.
                    </Typography>
                  </Grid>
                )}
                {checkFind === true && (
                  <Grid item>
                    <Typography noWrap>
                      Mostrando producto #{" "}
                      <strong>
                        {(indexPosition % indexProductsRepeat.length) + 1}
                      </strong>{" "}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Grid item xs={1.2}>
                <Button
                  color="info"
                  variant="contained"
                  onClick={changeProductFounded}
                >
                  SHOW
                </Button>
              </Grid>

              {checkFind === true && (
                <Grid item container xs alignItems={"center"} spacing={1}>
                  <Grid item xs={3}>
                    <Grid item>
                      <strong>Precio de Venta</strong>
                    </Grid>
                    <Grid item>${sellPrice.toString()}</Grid>
                  </Grid>
                  <Grid item xs={3}>
                    <Grid item>
                      <strong>Existencia Actual</strong>
                    </Grid>
                    <Grid item>{actualStock.toString()}</Grid>
                  </Grid>
                  <Grid item xs={3}>
                    <Grid item>
                      <strong>Existencia Final</strong>
                    </Grid>
                    <Grid item>{actualStock + +stock}</Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}
          <Grid item xs={12} container spacing={1}>
            <Grid item xs={12}>
              <Button color="info" variant="contained" onClick={addProduct}>
                {changeCheck === true ? "Modificar" : "Adicionar"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} margin={2}>
          {newProducts.length > 0 && (
            <>
              <Grid item xs={12}>
                <FacTable newProducts={newProducts} tipo={"Factura"} />
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
                {indexProductChange === null && (
                  <>
                    <Grid item xs={12}>
                      <Button
                        color="info"
                        variant="contained"
                        onClick={() => addInvButton()}
                      >
                        Adicionar al Inventario
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
