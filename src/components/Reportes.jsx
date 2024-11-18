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
import { validateInt, handleKeyDownWithDot } from "../hooks/validateInt";
import { FacTable, ReportTable, SalidaTable } from "./showtable";
import { DateField } from "@mui/x-date-pickers/DateField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { TroubleshootTwoTone } from "@mui/icons-material";

export default function Reportes() {
  const { facturas, ventasDiarias } = useInv();
  const [myOption, setmyOption] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [fechaInicial, setFechaInicial] = useState(dayjs());
  const [fechaFinal, setFechaFinal] = useState(dayjs());
  const [show, setShow] = useState("false");
  const [notFound, setNotFound] = useState("false");
  const [showProducts, setShowProducts] = useState([]);
  const [tipoTraslado, setTipoTraslado] = useState("");

  const Option = (e) => {
    setmyOption(e);
    setShow(false);
    setNotFound(false);
  };

  const handleChangeSelec = (event) => {
    setTipoTraslado(event.target.value);
  };

  const Mostrar = (e) => {
    setDateRange([fechaInicial,fechaFinal])
    setShow(false);
    setNotFound(false);
    let addShowProducts = [];
    switch (myOption) {
      case "Salidas":
        ventasDiarias.forEach((sell) => {
          dayjs(sell.fecha).isSame(dayjs(fechaInicial), "day")
            ? addShowProducts.push(sell)
            : false;
        });
        setShowProducts(addShowProducts);
        break;
      case "Facturas":
        facturas.forEach((product) => {
          if (
            product.fecha.isBefore(
              fechaFinal.set("hours", 23).set("minutes", 59).set("seconds", 59)
            ) &&
            product.fecha.isAfter(
              fechaInicial.set("hours", 0).set("minutes", 0).set("seconds", 1)
            )
          ) {
            addShowProducts.push(product);
          }
        });
        addShowProducts.sort((a,b) => a.fecha - b.fecha);
        setShowProducts(addShowProducts);
        break;
    }
    
    addShowProducts.length > 0 ? setShow(true) : setNotFound(true);
  };

  

  return (
    <main className="products">
      <Box
        sx={{
          justifyContent: "center",
          alignItems: "baseline",
        }}
      >
        <h1>REPORTES</h1>
        <Grid container spacing={3}>
          <Grid item xs={12} container columnSpacing={1}>
            <Grid item>
              <Button
                color="info"
                variant="contained"
                onClick={() => Option("Facturas")}
              >
                Facturas
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="info"
                variant="contained"
                onClick={() => Option("Traslados")}
              >
                Traslados
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="info"
                variant="contained"
                onClick={() => Option("Salidas")}
              >
                Salidas
              </Button>
            </Grid>
            <Grid item>
              <Button color="info" variant="contained">
                Otros
              </Button>
            </Grid>
            <Grid item>
              <Button color="info" variant="contained">
                Otros
              </Button>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            container
            columnSpacing={1}
            alignItems={"center"}
            rowSpacing={1}
          >
            {myOption === "Facturas" && (
              <Grid item container columnSpacing={5} rowSpacing={3}>
                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disableFuture
                      label="Fecha Inicial"
                      value={fechaInicial}
                      format="DD/MM/YYYY"
                      onChange={(newValue) => {
                        setFechaInicial(newValue);
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disableFuture
                      minDate={fechaInicial}
                      label="Fecha Final"
                      value={fechaFinal}
                      format="DD/MM/YYYY"
                      onChange={(newValue) => {
                        setFechaFinal(newValue);
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            )}
            {myOption === "Traslados" && (
              <Grid item container columnSpacing={5} rowSpacing={3}>
                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disableFuture
                      label="Fecha Inicial"
                      value={fechaInicial}
                      format="DD/MM/YYYY"
                      onChange={(newValue) => {
                        setFechaInicial(newValue);
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disableFuture
                      minDate={fechaInicial}
                      label="Fecha Final"
                      value={fechaFinal}
                      format="DD/MM/YYYY"
                      onChange={(newValue) => {
                        setFechaFinal(newValue);
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={4}>
                  <FormControl fullWidth>
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
              </Grid>
            )}
            {myOption === "Salidas" && (
              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    disableFuture
                    label="Fecha Inicial"
                    value={fechaInicial}
                    format="DD/MM/YYYY"
                    onChange={(newValue) => {
                      setFechaInicial(newValue);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            )}
            {myOption != "" && (
              <Grid item>
                <Button
                  color="info"
                  variant="contained"
                  onClick={() => Mostrar("true")}
                >
                  Mostrar
                </Button>
              </Grid>
            )}
          </Grid>
          <Grid item container xs={12}>
            {show === true && (
              <>
                {myOption === "Salidas" ? (
                  <SalidaTable showProducts={showProducts}  />
                ) : myOption === "Facturas" ? (
                  <FacTable showProducts={showProducts} origenDeSolicitud={"Reportes"} dateRange={dateRange}/>
                ) : (
                  <p>TRABAJANDO</p>
                )}
              </>
            )}
          </Grid>
          <Grid item>
            {notFound === true && (
              <>
                <h2>No Se encontraron Resultados Para Mostrar</h2>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </main>
  );
}
