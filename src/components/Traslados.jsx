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
import { FacTable } from "../hooks/showtable";

export default function Traslados() {
  const [newTraslado, SetNewTraslado] = useState([]);
  const [trasl, setTrasl] = useState("");
  const [fecha, setFecha] = useState(dayjs());
  const [name, setName] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [precioCosto, setPrecioCosto] = useState("");
  const { addToInv, lessToInv } = useInv();
  const [addcrash, setAddCrash] = useState(false);
  const [tipoTraslado, setTipoTraslado] = useState("");
  const [key, setKey] = useState(true);
  const [origin, setOriging] = useState("");
  const [destiny, setDestiny] = useState("");

  const { productLabel, precioCostoLabel, unidadMedidaLabel, originLabel } =
    useLabel(name, precioCosto);

  const handleChangeSelec = (event) => {
    setTipoTraslado(event.target.value);
  };

  const addInvButton = () => {
    if (tipoTraslado === "Recibido") {
      addToInv(newTraslado);
    } else {
      lessToInv(newTraslado);
    }

    SetNewTraslado([]);
  };

  const totalPrice = newTraslado.reduce(
    (accumulate, current) => accumulate + parseFloat(current.price),
    0
  );

  const addProduct = () => {
    event.preventDefault();
    if (
      trasl === "" ||
      fecha === "" ||
      name === "" ||
      unidadMedida === "" ||
      stock === "" ||
      tipoTraslado === "" ||
      price === ""
    ) {
      setAddCrash(true);
      return;
    } else {
      setTrasl("");
      setName("");
      setUnidadMedida("");
      setStock("");
      setKey(!key);
      setPrice("");
      setAddCrash(false);
      SetNewTraslado([
        ...newTraslado,
        {
          trasl,
          fecha,
          name,
          stock,
          price,
          precioCosto,
          unidadMedida,
          origin,
          destiny,
        },
      ]);
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

  const handleChange = (event) => {
    const newStock = event.target.value;
    setStock(newStock);
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
                  onChange={handleChangeSelec}
                >
                  <MenuItem value={"Recibido"}>Traslado Recibido</MenuItem>
                  <MenuItem value={"Enviado"}>Traslado Enviado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha"
                  value={fecha}
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
                freeSolo
                sx={{ width: 200 }}
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
                label="Cantidad"
                variant="outlined"
                value={stock.toString()}
                onKeyDown={handleKeyDownWithDot}
                onChange={(ev) => setStock(ev.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <Autocomplete
                disabled={stock ? false : true}
                freeSolo={tipoTraslado === "Recibido" ? true : false}
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
                  setPrecioCosto(newInputValue);
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
                disabled={stock ? false : true}
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

          <Grid item xs={12} container columnSpacing={1}>
            <Grid item xs={12}>
              <Button color="info" variant="contained" onClick={addProduct}>
                Adicionar Producto
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} margin={2}>
          {newTraslado.length > 0 && (
            <>
              <Grid item xs={12}>
                <FacTable newProducts={newTraslado} tipo={"Traslado"} />
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
