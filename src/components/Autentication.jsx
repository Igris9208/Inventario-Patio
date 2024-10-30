import { useState, useRef } from "react";
import { useInv } from "../hooks/useInv";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export function Autentication() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const { changeAutenticate } = useInv();
  const [error, setError] = useState(false);

  const validateAutentication = () => {
    if (name === "a" && pass === "a") {
      changeAutenticate();
    } else {
      setError(true);
    }
  };

  return (
    <main>
      <Box>
        <Grid
          item
          container
          alignItems={"center"}
          spacing={3}
          xs={2.5}
          sx={{
            "--Grid-borderWidth": "2px",
            border: "var(--Grid-borderWidth) solid",
            borderColor: "divider",
            borderRadius: "10px",
          }}
        >
          <Grid item container spacing={1}>
            <Grid item alignItems={"center"}>
              <TextField
                error={error}
                variant="outlined"
                label="Name"
                value={name}
                onChange={(ev) => {
                  setName(ev.target.value);
                }}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item>
              <TextField
                error={error}
                variant="outlined"
                label="Pasword"
                value={pass}
                onChange={(ev) => {
                  setPass(ev.target.value);
                }}
              />
            </Grid>
          </Grid>
          {error === true && (
            <Grid item container spacing={1}>
              <Grid item>
                <p>Error en autenticacion</p>
              </Grid>
            </Grid>
          )}
          <Grid item container spacing={3} justifyItems={"center"}>
            <Grid item>
              <Button
                color="info"
                variant="contained"
                onClick={validateAutentication}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </main>
  );
}
