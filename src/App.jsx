import "./App.css";
import { useState, useRef } from "react";
import Products from "./components/Products";
import Entradas from "./components/Entradas";
import Traslados from "./components/Traslados";
import Reportes from "./components/Reportes";
import { products } from "./JSON/products.json";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Salidas from "./components/Salidas";
import { Link, Route, Routes } from "react-router-dom";
import { Autentication } from "./components/Autentication";
import { useInv } from "./hooks/useInv";

function App() {
  const{autenticate} = useInv();
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
      {autenticate === false && (
        <Autentication/>
      )}
        {autenticate === true && (
          <Grid container rowSpacing={2}>
            <Grid
              item
              xs={12}
              container
              columnSpacing={1}
              alignItems={"center"}
            >
              <Grid item>
                <Link to="/inventario">
                  {" "}
                  <Button variant="contained">INVENTARIO</Button>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/facturas">
                  {" "}
                  <Button variant="contained">FACTURAS</Button>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/traslados">
                  {" "}
                  <Button variant="contained">TRASLADOS</Button>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/reportes">
                  {" "}
                  <Button variant="contained">REPORTES</Button>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/salidas">
                  {" "}
                  <Button variant="contained">SALIDAS</Button>
                </Link>
              </Grid>
            </Grid>

            <Grid item xs={12} container columnSpacing={1}>
              <Routes>
                <Route path="/inventario" element={<Products />} />
                <Route path="/facturas" element={<Entradas />} />
                <Route path="/traslados" element={<Traslados />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/salidas" element={<Salidas />} />
              </Routes>
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
}

export default App;
