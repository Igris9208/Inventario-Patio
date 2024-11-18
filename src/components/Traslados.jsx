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
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { TraslTable } from "./showtable";
import { findProducts } from "../hooks/findProductsIndex";
import Typography from "@mui/material/Typography";

export default function Traslados() {
  const [newTraslado, SetNewTraslado] = useState([]);
  const [trasl, setTrasl] = useState("");
  const [fecha, setFecha] = useState(dayjs());
  const [name, setName] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [precioCosto, setPrecioCosto] = useState("");
  const { addToInv, lessToInv, myProducts } = useInv();
  const [addcrash, setAddCrash] = useState(false);
  const [tipoTraslado, setTipoTraslado] = useState("");
  const [key, setKey] = useState(true);
  const [origin, setOriging] = useState("");
  const [destiny, setDestiny] = useState("");

  const { productLabel, precioCostoLabel, unidadMedidaLabel, originLabel } =
    useLabel(name, precioCosto);

  const [checkFind, setCheckFind] = useState(false);
  const indexProductsRepeat = findProducts(name, precioCosto);
  const [indexPosition, setIndexPosition] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [actualStock, setActualStock] = useState(0);
  const [idProductRepeat, setIDProductRepeat] = useState("");
  const [auxiliarUnidadMedida, setAuxiliarUnidadMedida] = useState("");

  let calcTotalStock = actualStock
    ? tipoTraslado === "Recibido"
      ? +actualStock + +stock
      : +actualStock - stock
    : stock;

  const changeProductFounded = () => {
    setAuxiliarUnidadMedida(unidadMedida);
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

  const cancelProductFounded = () => {
    setUnidadMedida(auxiliarUnidadMedida);
    setCheckFind(false);
    setSellPrice(0);
    setActualStock(0);
    setIDProductRepeat("");
  };

  const changeTrasladeType = (event) => {
    setTipoTraslado(event.target.value);
    event.target.value === "Recibido"
      ? setDestiny('MULTIMAT "La Juvenil"')
      : setOriging('MULTIMAT "La Juvenil"');
  };

  const addInvButton = () => {
    if (tipoTraslado === "Recibido") {
      addToInv(newTraslado, "Traslado");
    } else {
      lessToInv(newTraslado, "Traslado");
    }

    SetNewTraslado([]);
  };

  const addProduct = () => {
    event.preventDefault();
    if (
      trasl === "" ||
      fecha === "" ||
      name === "" ||
      unidadMedida === "" ||
      stock === "" ||
      tipoTraslado === "" ||
      price === "" ||
      calcTotalStock < 0
    ) {
      setAddCrash(true);
      return;
    } else {
      setName("");
      setUnidadMedida("");
      setStock("");
      setKey(!key);
      setPrice("");
      setPrecioCosto("");
      setAddCrash(false);
      setActualStock(0);
      setCheckFind(false);
      SetNewTraslado([
        ...newTraslado,
        {
          trasl,
          tipoTraslado,
          fecha,
          origin,
          destiny,
          name,
          unidadMedida,
          stock,
          precioCosto,
          price,
          id: idProductRepeat,
          initialStock: actualStock,
          totalStock: calcTotalStock,
        },
      ]);
    }
  };

  const calcInt = (value, selec) => {
    switch (selec) {
      case "stock":
        setStock(+value);
        precioCosto
          ? setPrice(+value * precioCosto)
          : price
          ? setPrecioCosto(price / +value)
          : false;
        break;
      case "costPrice":
        setPrecioCosto(+value);
        stock
          ? setPrice(+value * stock)
          : price
          ? setStock(price / +value)
          : false;
        break;
      case "price":
        setPrice(+value);
        precioCosto
          ? setStock(+value / precioCosto)
          : stock
          ? setPrecioCosto(+value / stock)
          : false;
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

  return (
    <main className="products">
      <h1>Nuevo Traslado</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container rowSpacing={2}>
          <Grid item xs={12} container columnSpacing={1}>
            <Grid item xs={4}>
              <TextField
                disabled={newTraslado.length > 0 ? true : false}
                error={addcrash ? (trasl ? false : true) : false}
                id="outlined-basic"
                label="Num. de Traslado"
                variant="outlined"
                value={trasl}
                onChange={(ev) => setTrasl(ev.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl
                fullWidth
                disabled={newTraslado.length > 0 ? true : false}
                error={addcrash ? (tipoTraslado ? false : true) : false}
              >
                <InputLabel id="demo-simple-select-label">
                  Tipo de Traslado
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={tipoTraslado}
                  label="Tipo de Traslado"
                  onChange={changeTrasladeType}
                >
                  <MenuItem value={"Recibido"}>Traslado Recibido</MenuItem>
                  <MenuItem value={"Enviado"}>Traslado Enviado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disabled={newTraslado.length > 0 ? true : false}
                  label="Fecha"
                  value={fecha}
                  format="DD/MM/YY"
                  onChange={(newValue) => {
                    setFecha(newValue);
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Grid item xs={12} container columnSpacing={1}>
            <Grid item xs={6}>
              <Autocomplete
                freeSolo
                disabled={
                  tipoTraslado === "Enviado"
                    ? true
                    : newTraslado.length > 0
                    ? true
                    : false
                }
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
            <Grid item xs={6}>
              <Autocomplete
                freeSolo
                disabled={
                  tipoTraslado === "Recibido"
                    ? true
                    : newTraslado.length > 0
                    ? true
                    : false
                }
                {...defaultOrigin}
                id="Destino"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Destino"
                    error={addcrash ? (destiny ? false : true) : false}
                  />
                )}
                inputValue={destiny}
                onInputChange={(ev) =>
                  ev ? setDestiny(ev.target.value) : true
                }
                onChange={(e, value) => (value ? setDestiny(value) : true)}
                key={key}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} container columnSpacing={1}>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo={tipoTraslado === "Recibido" ? true : false}
                disabled={checkFind === true ? true : false}
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
                onInputChange={(event, newInputValue) => {
                  setName(newInputValue);
                }}
                onChange={(e, value) => (value ? setName(value) : true)}
                key={key}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} container columnSpacing={1}>
            <Grid item xs={2}>
              <Autocomplete
                freeSolo={tipoTraslado === "Recibido" ? true : false}
                disabled={checkFind === true ? true : false}
                {...defaultUnidadMedida}
                id="Unidad de Medida"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Unidad de Medida"
                    error={addcrash ? (unidadMedida ? false : true) : false}
                  />
                )}
                inputValue={unidadMedida}
                onInputChange={(ev, newInputValue) =>
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
                label="Cantidad"
                variant="outlined"
                value={stock.toString()}
                onKeyDown={handleKeyDownWithDot}
                onChange={(ev) => calcInt(ev.target.value, "stock")}
              />
            </Grid>
            <Grid item xs={2}>
              <Autocomplete
                freeSolo={tipoTraslado === "Recibido" ? true : false}
                disabled={checkFind === true ? true : false}
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
                onInputChange={(event, newInputValue) => {
                  calcInt(newInputValue, "costPrice");
                }}
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
                id="outlined-basic"
                type="text"
                label="Precio"
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
          {/* Cuando se encuentra una coincidencia en el inventario igual a la entrada*/}
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
                  {checkFind === false
                    ? "SHOW"
                    : indexProductsRepeat.length > 1
                    ? "NEXT"
                    : "SHOW"}
                </Button>
              </Grid>

              {checkFind === true && (
                <Grid item container xs alignItems={"center"} spacing={1}>
                  <Grid item xs={3}>
                    <Grid item>
                      <strong>Precio de Venta</strong>
                    </Grid>
                    <Grid item>
                      {sellPrice
                        ? "$" + sellPrice.toString()
                        : "Sin establecer"}
                    </Grid>
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
                    <Grid item>{calcTotalStock}</Grid>
                  </Grid>
                  <Grid item xs={1.2}>
                    <Button
                      color="info"
                      variant="contained"
                      onClick={cancelProductFounded}
                    >
                      CANCEL
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}
          {/* Mensaje de error cuando el stock sea negativo */}
          {calcTotalStock < 0 && (
            <Grid item xs={12} container columnSpacing={1}>
              <Grid item xs={12}>
                <strong>La Existencia Final no puede ser menor que 0.</strong>
              </Grid>
            </Grid>
          )}
          <Grid item xs={12} container columnSpacing={1}>
            <Grid item xs={12}>
              <Button
                color="info"
                variant="contained"
                onClick={addProduct}
                disabled={
                  tipoTraslado === "Enviado"
                    ? checkFind === true
                      ? false
                      : true
                    : false
                }
              >
                Adicionar Producto
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} margin={2}>
          {newTraslado.length > 0 && (
            <>
              <Grid item xs={12}>
                <TraslTable showProducts={newTraslado} />
              </Grid>
              <Grid item xs={12}>
                <button className="boton azul" onClick={() => addInvButton()}>
                  Adicionar al Inventario
                </button>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </main>
  );
}
