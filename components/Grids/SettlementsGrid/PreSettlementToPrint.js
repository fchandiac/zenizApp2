import {
  Grid,
  Typography,
  Box,
  Divider,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableFooter,
} from "@mui/material";
import moment from "moment";
import React, { useEffect } from "react";

const settlements = require("../../../services/settlements");
const rowTinyStyle = {
  fontSize: ".65rem",
  minHeight: "fit-content",
  maxWidth: "7rem",
  padding: ".2rem",
  margin: 0,
  textAlign: "right",
  width: "fit-content",
};

const rowHeaderTinyStyle = {
  fontSize: ".65rem",
  fontWeight: "bold",
  padding: ".2rem",
  textAlign: "right",
  width: "fit-content",
};

export default function PreSettlementToPrint(props) {
  const { receptionsList, advancesList, producerName = "" } = props;

  const [totalReceptions, setTotalReceptions] = React.useState(0);
  const [totalAdvances, setTotalAdvances] = React.useState(0);

  console.log("advancesList", advancesList);

  useEffect(() => {
    const totalReceptions = receptionsList.reduce(
      (acc, item) => acc + item.toPay,
      0
    );

    const totalAdvances = advancesList.reduce(
      (acc, item) => acc + item.amount,
      0
    );

    setTotalReceptions(totalReceptions);
    setTotalAdvances(totalAdvances);
  }, [receptionsList, advancesList]);

  console.log("receptionsList", receptionsList);

  const advancesTable = () => {
    const data = advancesList;
    const totalAmount = data.reduce((acc, row) => acc + row.amount, 0);
    console.log("totalAmountAdvance", totalAmount);

    return (
      <TableContainer component={Paper} variant={"outlined"}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={rowHeaderTinyStyle}>Adelanto</TableCell>
              <TableCell style={rowHeaderTinyStyle}>Fecha</TableCell>
              <TableCell style={rowHeaderTinyStyle}>Descripción</TableCell>
              <TableCell style={rowHeaderTinyStyle}>Monto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell style={rowTinyStyle}>{row.id}</TableCell>
                <TableCell style={rowTinyStyle}>
                  {new Date(row.createdAt).toLocaleDateString("es-CL")}
                </TableCell>
                <TableCell style={rowTinyStyle}>{row.description}</TableCell>
                <TableCell style={rowTinyStyle}>
                  {row.amount.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={2}
                align="right"
                style={rowTinyStyle}
                sx={{ color: "black" }}
              >
                <strong> TOTAL</strong>
              </TableCell>
              <TableCell
                colSpan={2}
                style={rowTinyStyle}
                sx={{ color: "black" }}
              >
                <strong>
                  {totalAmount.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </strong>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
  };

  const calculateTotals = (data) => {
    const totals = {
      net: 0,
      toPay: 0,
    };

    data.forEach((item) => {
      totals.net += item.net;
      totals.toPay += item.toPay;
    });

    return totals;
  };

  const receptionsTable = () => {
    const data = receptionsList;
    const totals = calculateTotals(data);
    return (
      <TableContainer component={Paper} variant={"outlined"}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={rowHeaderTinyStyle}>Recepción</TableCell>
              <TableCell style={rowHeaderTinyStyle}>Fecha</TableCell>
              <TableCell style={rowHeaderTinyStyle}>Neto</TableCell>
              <TableCell style={rowHeaderTinyStyle}>Precio Kg</TableCell>
              <TableCell style={rowHeaderTinyStyle}>A pagar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell style={rowTinyStyle}>{item.id}</TableCell>
                <TableCell style={rowTinyStyle}>
                  {moment(item.createdAt).format("DD-MM-YYYY HH:00")}
                </TableCell>
                <TableCell style={rowTinyStyle}>
                  {new Intl.NumberFormat("es-CL", {
                    style: "decimal",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(item.net) + " kg"}
                </TableCell>
                <TableCell style={rowTinyStyle}>
                  {item.clp.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </TableCell>
                <TableCell style={rowTinyStyle}>
                  {item.toPay.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={2}
                align="right"
                style={rowHeaderTinyStyle}
                sx={{ color: "black" }}
              >
                TOTALES
              </TableCell>

              <TableCell style={rowTinyStyle} sx={{ color: "black" }}>
                {totals.net.toFixed(2)} kg
              </TableCell>
              <TableCell></TableCell>
              <TableCell style={rowTinyStyle} sx={{ color: "black" }}>
                <strong>
                  {" "}
                  {totals.toPay.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </strong>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <Typography variant={"h5"} fontWeight="bold">
        {"Pre-Liquidación "}
      </Typography>
      <Box justifyContent={"center"} marginBottom={1}>
        <Typography fontWeight="bold">Productor: {producerName}</Typography>
        <Typography fontWeight="bold">
          Fecha: {moment().format("DD-MM-YYYY HH:mm")}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box flexDirection={"column"} paddingBottom={1}>
            <Typography variant={"subtitle2"} fontWeight="bold">
              Adelantos
            </Typography>
            {advancesTable()}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box flexDirection={"column"} paddingBottom={1}>
            <Typography variant={"subtitle2"} fontWeight="bold">
              Recepciones
            </Typography>
            {receptionsTable()}
          </Box>
        </Grid>
      </Grid>

      <Box display={"flex"} justifyContent={"flex-end"} marginTop={1}>
        <Typography variant={"subtitle2"} fontWeight="bold">
          Total Adelantos:{" "}
          {totalAdvances.toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
          })}
        </Typography>
      </Box>
      <Box display={"flex"} justifyContent={"flex-end"} marginTop={1}>
        <Typography variant={"subtitle2"} fontWeight="bold">
          Total Recepciones:{" "}
          {totalReceptions.toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
          })}
        </Typography>
      </Box>

      <Divider />

      <Box display={"flex"} justifyContent={"flex-end"} marginTop={1}>
        <Typography variant={"subtitle2"} fontWeight="bold">
          Total a pagar:{" "}
          {(totalReceptions - totalAdvances).toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
          })}
        </Typography>
      </Box>
    </>
  );
}

function settlementDataDefault() {
  return {
    id: 0,
    producerName: "",
    producerRut: "",
    amount: 0,
    description: "",
    createdAt: "",
    Receptions: [],
  };
}
