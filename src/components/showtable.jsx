import * as React from "react";
import { useState, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TabList } from "@mui/lab";
import { useInv } from "../hooks/useInv";
import Grid from "@mui/material/Grid";
import { useOrdenateShowFact } from "../hooks/ordenateShowFact";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export function FacTable({ showProducts, origenDeSolicitud, dateRange }) {
  const { indexProductChange, changeIndex } = useInv();
  const showProductsFilters = useOrdenateShowFact(showProducts);
  const [myType, setMyType] = useState("Facturas");
  const [daysToShow, setDaysToShow] = useState([]);
  const [productNameToShow, setProductNameToShow] = useState([]);

  let totalCostFact = showProductsFilters.reduce(
    (acumulate, current) =>
      acumulate +
      current.reduce(
        (acumulate2, current2) => acumulate2 + parseFloat(current2.price),
        0
      ),
    0
  );

  const changeOption = (event) => {
    setMyType(event.target.value);

    if (event.target.value === "ResumenDias") {
      let filtersDay = showProducts[0].fecha;
      let days = [showProducts[0].fecha];
      let productName = [
        {
          name: showProducts[0].name,
          precioCosto: showProducts[0].precioCosto,
        },
      ];

      showProducts.forEach((product) => {
        //Aqui guardo los dias que hay productos.
        if (product.fecha.diff(filtersDay, "day") != 0) {
          days.push(product.fecha);
          filtersDay = product.fecha;
        }
        //Aqui guardo los productos con mombre y precio de costo que no se repitan.
        let index = productName.findIndex(
          (prod) =>
            prod.name === product.name &&
            prod.precioCosto === product.precioCosto
        );
        if (index > -1) {
        } else {
          productName.push({
            name: product.name,
            precioCosto: product.precioCosto,
          });
        }
      });
      setDaysToShow(days);
      setProductNameToShow(productName);
    }
  };

  return (
    <>
      <Grid item container spacing={2} alignContent={"center"}>
        {origenDeSolicitud === "Reportes" && (
          <Grid item xs={12}>
            <FormControl>
              <InputLabel>Vista</InputLabel>
              <Select value={myType} label="Vista" onChange={changeOption}>
                <MenuItem value={"Facturas"}>Facturas</MenuItem>
                <MenuItem value={"ResumenFacturas"}>
                  Resumen de Facturas
                </MenuItem>
                <MenuItem value={"ResumenDias"}>Resumen por Dias</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
        {myType === "Facturas" && (
          <Grid item container spacing={2}>
            {showProductsFilters.map((product, indexProduct) => (
              <Grid item key={indexProduct}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 300 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan="7" align="left">
                          <strong>Fecha: </strong>
                          {product[0].fecha.format("DD/MM/YYYY")}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan="7" align="left">
                          <strong>Factura: </strong>
                          {product[0].fact}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>No.</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Nombre del Producto</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Precio de Costo</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Cantida</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Existencia Final</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Costo por Factura</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {product.map((product, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          onClick={() => changeIndex(index)}
                          selected={index === indexProductChange ? true : false}
                        >
                          <TableCell> {index + 1 || "-"}</TableCell>
                          <TableCell align="left">
                            {product.name || "-"}
                          </TableCell>
                          <TableCell align="left">
                            {product.precioCosto || "-"}
                          </TableCell>
                          <TableCell align="left">
                            {product.stock || "-"}
                          </TableCell>
                          <TableCell align="left">
                            {product.totalStock}
                          </TableCell>
                          <TableCell align="left">
                            ${product.price || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan="5" align="center">
                          <strong>Total Entrada</strong>
                        </TableCell>
                        <TableCell>
                          <strong>
                            $
                            {product.reduce(
                              (accumulate, current) =>
                                accumulate + parseFloat(current.price),
                              0
                            )}
                          </strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            ))}
          </Grid>
        )}
        {myType === "ResumenFacturas" && (
          <Grid item>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 300 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan="6" align="left">
                      <strong>Fecha: </strong>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>No.</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Fecha</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Factura</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Origen</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Precio Factura</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {showProductsFilters.map((product, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      onClick={() => changeIndex(index)}
                      selected={index === indexProductChange ? true : false}
                    >
                      <TableCell> {index + 1 || "-"}</TableCell>
                      <TableCell align="left">
                        {product[0].fecha.format("DD/MM/YYYY") || "-"}
                      </TableCell>
                      <TableCell align="left">
                        {product[0].fact || "-"}
                      </TableCell>
                      <TableCell align="left">
                        {product[0].origin || "-"}
                      </TableCell>
                      <TableCell align="left">
                        {" "}
                        $
                        {product.reduce(
                          (accumulate, current) =>
                            accumulate + parseFloat(current.price),
                          0
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan="4" align="center">
                      <strong>Entrada Total por Facturas</strong>
                    </TableCell>
                    <TableCell>
                      <strong>${totalCostFact}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
        {myType === "ResumenDias" && (
          <Grid item>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 300 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={daysToShow.length + 3} align="left">
                      <strong>
                        {dateRange[0].diff(dateRange[1], "day") != 0
                          ? "Rango de Fecha: "
                          : "Dia: "}
                      </strong>
                      {dateRange[0].diff(dateRange[1], "day") != 0
                        ? dateRange[0].format("DD/MMM/YYYY") + " - " +
                          dateRange[1].format("DD/MMM/YYYY")
                        : dateRange[0].format("DD/MMM/YYYY")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell padding="none" align="center">
                      <strong>No.</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Productos</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>P. Costo</strong>
                    </TableCell>
                    {daysToShow.map((fecha, indexDay) => (
                      <TableCell align="center" key={indexDay}>
                        <strong>Dia {fecha.format("D")}</strong>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productNameToShow.map((productName, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      onClick={() => changeIndex(index)}
                      selected={index === indexProductChange ? true : false}
                    >
                      <TableCell> {index + 1 || "-"}</TableCell>
                      <TableCell align="left">{productName.name}</TableCell>
                      <TableCell align="left">
                        {productName.precioCosto}
                      </TableCell>
                      {/*Aqui se iteran los datos a mostrar por dias */}
                      {daysToShow.map((fecha, indexDay2) => {
                        let factShow = [];
                        let stockShow = 0;
                        let totalPriceShow = 0;
                        showProducts.forEach((product) => {
                          if (
                            product.name === productName.name &&
                            product.fecha.diff(fecha, "day") === 0 &&
                            product.precioCosto === productName.precioCosto
                          ) {
                            stockShow += +product.stock;
                            totalPriceShow += +product.price;
                            factShow.push(product.fact);
                          }
                        });

                        return (
                          <>
                            <TableCell
                              align="left"
                              padding="none"
                              key={indexDay2}
                            >
                              {factShow != "" && (
                                <Table>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell align="left">
                                        {factShow.map(
                                          (numberFact, indexFact) => (
                                            <Grid key={indexFact}>
                                              {numberFact}
                                            </Grid>
                                          )
                                        )}
                                      </TableCell>
                                      <TableCell align="left">
                                        {stockShow || "-"}
                                      </TableCell>
                                      <TableCell align="left">
                                        {totalPriceShow || "-"}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              )}
                              {factShow === "" && <TableCell>-</TableCell>}
                            </TableCell>
                          </>
                        );
                      })}
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={daysToShow.length + 3} align="center">
                      <strong> Total Recibido ${totalCostFact}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </>
  );
}

export function TraslTable({ showProducts, origenDeSolicitud, dateRange }) {
  const { indexProductChange, changeIndex } = useInv();
  const showProductsFilters = useOrdenateShowFact(showProducts);
  const [myType, setMyType] = useState("Traslados");
  const [daysToShow, setDaysToShow] = useState([]);
  const [productNameToShow, setProductNameToShow] = useState([]);

  console.log(showProducts)

 
 /* 
  let totalCostFact = showProductsFilters.reduce(
    (acumulate, current) =>
      acumulate +
      current.reduce(
        (acumulate2, current2) => acumulate2 + parseFloat(current2.price),
        0
      ),
    0
  );
  */

  const changeOption = (event) => {
    setMyType(event.target.value);

    if (event.target.value === "ResumenDias") {
      let filtersDay = showProducts[0].fecha;
      let days = [showProducts[0].fecha];
      let productName = [
        {
          name: showProducts[0].name,
          precioCosto: showProducts[0].precioCosto,
        },
      ];

      showProducts.forEach((product) => {
        //Aqui guardo los dias que hay productos.
        if (product.fecha.diff(filtersDay, "day") != 0) {
          days.push(product.fecha);
          filtersDay = product.fecha;
        }
        //Aqui guardo los productos con mombre y precio de costo que no se repitan.
        let index = productName.findIndex(
          (prod) =>
            prod.name === product.name &&
            prod.precioCosto === product.precioCosto
        );
        if (index > -1) {
        } else {
          productName.push({
            name: product.name,
            precioCosto: product.precioCosto,
          });
        }
      });
      setDaysToShow(days);
      setProductNameToShow(productName);
    }
  };

  return (
    <>
      <Grid item container spacing={2} alignContent={"center"}>
        {origenDeSolicitud === "Reportes" && (
          <Grid item xs={12}>
            <FormControl>
              <InputLabel>Vista</InputLabel>
              <Select value={myType} label="Vista" onChange={changeOption}>
                <MenuItem value={"Traslados"}>Traslados</MenuItem>
                <MenuItem value={"ResumenFacturas"}>
                  Resumen de Facturas
                </MenuItem>
                <MenuItem value={"ResumenDias"}>Resumen por Dias</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
        {myType === "Traslados" && (
          <Grid item container spacing={2}>
            {showProductsFilters.map((product, indexProduct) => (
              <Grid item key={indexProduct}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 300 }} aria-label="simple table" padding="normal">
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan="8" align="left">
                          <strong>Fecha: </strong>
                          {product[0].fecha.format("DD/MM/YYYY")}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan="8" align="left">
                          <strong>Traslado {product[0].tipoTraslado} No.: </strong>
                          {product[0].trasl}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan="8" align="left">
                          <strong>De: </strong>
                          {product[0].origin} <strong>A: </strong> {product[0].destiny} 
                        </TableCell> 
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>No.</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Nombre del Producto</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>U/M</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Precio de Costo</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Existencia Inicial</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Cantidad Transferida</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Existencia Final</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Costo</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {product.map((product, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                          onClick={() => changeIndex(index)}
                          selected={index === indexProductChange ? true : false}
                        >
                          <TableCell> {index + 1 || "-"}</TableCell>
                          <TableCell align="left">
                            {product.name || "-"}
                          </TableCell>
                          <TableCell align="left">
                            {product.unidadMedida || "-"}
                          </TableCell>
                          <TableCell align="left">
                            {product.precioCosto || "-"}
                          </TableCell>
                          <TableCell align="left">
                            {product.initialStock}
                          </TableCell>
                          <TableCell align="left">
                            {product.stock || "-"}
                          </TableCell>
                          <TableCell align="left">
                            {product.totalStock}
                          </TableCell>
                          <TableCell align="left">
                            ${product.price || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan="7" align="center">
                          <strong>Total del Traslado</strong>
                        </TableCell>
                        <TableCell>
                          <strong>
                            $
                            {product.reduce(
                              (accumulate, current) =>
                                accumulate + parseFloat(current.price),
                              0
                            )}
                          </strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            ))}
          </Grid>
        )}
        {myType === "ResumenFacturas" && (
          <Grid item>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 300 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan="6" align="left">
                      <strong>Fecha: </strong>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>No.</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Fecha</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Factura</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Origen</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Precio Factura</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {showProductsFilters.map((product, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      onClick={() => changeIndex(index)}
                      selected={index === indexProductChange ? true : false}
                    >
                      <TableCell> {index + 1 || "-"}</TableCell>
                      <TableCell align="left">
                        {product[0].fecha.format("DD/MM/YYYY") || "-"}
                      </TableCell>
                      <TableCell align="left">
                        {product[0].fact || "-"}
                      </TableCell>
                      <TableCell align="left">
                        {product[0].origin || "-"}
                      </TableCell>
                      <TableCell align="left">
                        {" "}
                        $
                        {product.reduce(
                          (accumulate, current) =>
                            accumulate + parseFloat(current.price),
                          0
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan="4" align="center">
                      <strong>Entrada Total por Facturas</strong>
                    </TableCell>
                    <TableCell>
                      <strong>${totalCostFact}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
        {myType === "ResumenDias" && (
          <Grid item>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 300 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={daysToShow.length + 3} align="left">
                      <strong>
                        {dateRange[0].diff(dateRange[1], "day") != 0
                          ? "Rango de Fecha: "
                          : "Dia: "}
                      </strong>
                      {dateRange[0].diff(dateRange[1], "day") != 0
                        ? dateRange[0].format("DD/MMM/YYYY") + " - " +
                          dateRange[1].format("DD/MMM/YYYY")
                        : dateRange[0].format("DD/MMM/YYYY")}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell padding="none" align="center">
                      <strong>No.</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Productos</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>P. Costo</strong>
                    </TableCell>
                    {daysToShow.map((fecha, indexDay) => (
                      <TableCell align="center" key={indexDay}>
                        <strong>Dia {fecha.format("D")}</strong>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productNameToShow.map((productName, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      onClick={() => changeIndex(index)}
                      selected={index === indexProductChange ? true : false}
                    >
                      <TableCell> {index + 1 || "-"}</TableCell>
                      <TableCell align="left">{productName.name}</TableCell>
                      <TableCell align="left">
                        {productName.precioCosto}
                      </TableCell>
                      {/*Aqui se iteran los datos a mostrar por dias */}
                      {daysToShow.map((fecha, indexDay2) => {
                        let factShow = [];
                        let stockShow = 0;
                        let totalPriceShow = 0;
                        showProducts.forEach((product) => {
                          if (
                            product.name === productName.name &&
                            product.fecha.diff(fecha, "day") === 0 &&
                            product.precioCosto === productName.precioCosto
                          ) {
                            stockShow += +product.stock;
                            totalPriceShow += +product.price;
                            factShow.push(product.fact);
                          }
                        });

                        return (
                          <>
                            <TableCell
                              align="left"
                              padding="none"
                              key={indexDay2}
                            >
                              {factShow != "" && (
                                <Table>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell align="left">
                                        {factShow.map(
                                          (numberFact, indexFact) => (
                                            <Grid key={indexFact}>
                                              {numberFact}
                                            </Grid>
                                          )
                                        )}
                                      </TableCell>
                                      <TableCell align="left">
                                        {stockShow || "-"}
                                      </TableCell>
                                      <TableCell align="left">
                                        {totalPriceShow || "-"}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              )}
                              {factShow === "" && <TableCell>-</TableCell>}
                            </TableCell>
                          </>
                        );
                      })}
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={daysToShow.length + 3} align="center">
                      <strong> Total Recibido ${totalCostFact}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </>
  );
}

export function ReportTable({ newProducts, tipo }) {
  const totalPrice = newProducts.reduce(
    (accumulate, current) => accumulate + parseFloat(current.price),
    0
  );

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan="7" align="center">
              <strong>{tipo}</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>No.</strong>
            </TableCell>
            <TableCell align="center">
              <strong>{tipo}</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Fecha</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Name</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Precio de Costo</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Cantida</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Precio</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {newProducts.map((product, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell> {index + 1 || "-"}</TableCell>
              <TableCell component="th" scope="row">
                {!product.fact ? product.trasl : product.fact}
              </TableCell>
              <TableCell align="left">
                {product.fecha.format("DD/MM/YYYY")}
              </TableCell>
              <TableCell align="left">{product.name || "-"}</TableCell>
              <TableCell align="left">{product.precioCosto || "-"}</TableCell>
              <TableCell align="left">{product.stock || "-"}</TableCell>
              <TableCell align="left">{product.price || "-"}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan="6" align="center">
              <strong>Total Entrada</strong>
            </TableCell>
            <TableCell>
              <strong>${totalPrice}</strong>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function SalidaTable({ newProducts }) {
  const { indexProductChange, changeIndex } = useInv();

  const totalPos = newProducts.reduce(
    (accumulate, current) =>
      accumulate + parseFloat(!!current.importPos ? current.importPos : 0),
    0
  );
  const totalInLine = newProducts.reduce(
    (accumulate, current) => accumulate + parseFloat(current.importInLine || 0),
    0
  );
  const totalVale = newProducts.reduce(
    (accumulate, current) => accumulate + parseFloat(current.importVale || 0),
    0
  );

  const totalPosCost = newProducts.reduce(
    (accumulate, current) =>
      accumulate + parseFloat(current.sellPos * current.precioCosto),
    0
  );
  const totalInLineCost = newProducts.reduce(
    (accumulate, current) =>
      accumulate + parseFloat(current.sellInLine * current.precioCosto),
    0
  );
  const totalValeCost = newProducts.reduce(
    (accumulate, current) =>
      accumulate + parseFloat(current.sellVale * current.precioCosto),
    0
  );
  let totalPrice = totalInLine + totalPos + totalVale;

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan="15" align="center">
              <strong>{newProducts[0].fecha.format("DD/MM/YYYY")}</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <strong>No.</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Producto</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Precio de Costo</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Cant. en Venta</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Precio</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Venta por POS</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Importe</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Importe PC</strong>
            </TableCell>
            <TableCell align="center">
              <strong>POS</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Importe</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Importe PC</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Venta en Linea</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Importe</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Importe PC</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Exist. Final</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {newProducts.map((product, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              onClick={() => changeIndex(index)}
              selected={index === indexProductChange ? true : false}
            >
              <TableCell> {index + 1 || "-"}</TableCell>
              <TableCell align="left">{product.name || "-"}</TableCell>
              <TableCell align="left">{product.precioCosto || "-"}</TableCell>
              <TableCell align="left">{product.sellStock || "-"}</TableCell>
              <TableCell align="left">${product.price || "-"}</TableCell>
              <TableCell align="left">{product.sellVale || ""}</TableCell>
              <TableCell align="left">${product.importVale || 0}</TableCell>
              <TableCell align="left">
                {product.sellVale * product.precioCosto || ""}
              </TableCell>
              <TableCell align="left">{product.sellPos || ""}</TableCell>
              <TableCell align="left">${product.importPos || 0}</TableCell>
              <TableCell align="left">
                {product.sellPos * product.precioCosto || ""}
              </TableCell>
              <TableCell align="left">{product.sellInLine || ""}</TableCell>
              <TableCell align="left">${product.importInLine || 0}</TableCell>
              <TableCell align="left">
                {product.sellInLine * product.precioCosto || ""}
              </TableCell>
              <TableCell align="left">{product.finalSellStock}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan="6" align="center">
              <strong> Totales </strong>
            </TableCell>
            <TableCell>
              <strong>${totalVale}</strong>
            </TableCell>
            <TableCell>
              <strong>{totalValeCost || ""}</strong>
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              <strong>${totalPos}</strong>
            </TableCell>
            <TableCell>
              <strong>{totalPosCost || ""}</strong>
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              <strong>${totalInLine}</strong>
            </TableCell>
            <TableCell>
              <strong>{totalInLineCost || ""}</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan="6" align="center">
              <strong> Total de Venta del Dia </strong>
            </TableCell>
            <TableCell colSpan="8" align="center">
              <strong> ${totalPrice}</strong>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
