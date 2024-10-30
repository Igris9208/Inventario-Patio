import * as React from "react";
import { useState, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { TabList } from "@mui/lab";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useInv } from "../hooks/useInv";

export function FacTable({newProducts}) {
  const { indexProductChange, changeIndex } = useInv();

  const totalPrice = newProducts.reduce(
    (accumulate, current) => accumulate + parseFloat(current.price),
    0
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
        <TableRow>
          <TableCell colSpan="7" align="center">
            <strong>{newProducts[0].fecha.format("DD/MM/YYYY")}</strong>
          </TableCell>
        </TableRow>
          <TableRow>
            <TableCell>
              <strong>No.</strong>
            </TableCell>
            <TableCell align="center">
              <strong>No. de Factura</strong>
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
          {newProducts.map((product, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              onClick={() => changeIndex(index)}
              selected={index === indexProductChange ? true : false}
            >
              <TableCell> {index + 1 || "-"}</TableCell>
              <TableCell component="th" scope="row">
                {product.fact}
              </TableCell>
              <TableCell align="left">{product.name || "-"}</TableCell>
              <TableCell align="left">{product.precioCosto || "-"}</TableCell>
              <TableCell align="left">{product.stock || "-"}</TableCell>
              <TableCell align="left">{product.totalStock}</TableCell>
              <TableCell align="left">${product.price || "-"}</TableCell>
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
