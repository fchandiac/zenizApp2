import React, { useState, useEffect } from "react";
import DataGrid from "../../Karmextron/DataGrid/DataGrid";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import EditIcon from "@mui/icons-material/Edit";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { GridActionsCellItem } from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  TextField,
  InputAdornment,
  Autocomplete,
  Divider,
  Box,
  IconButton,
} from "@mui/material";
import PackCard from "../../Cards/PackCard/PackCard";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useAppContext } from "../../../appProvider";
import moment from "moment";
import InfoDataGrid from "./InfoDataGrid";
import PrintIcon from "@mui/icons-material/Print";
import PrintDialog from "../../PrintDialog/PrintDialog";
import ReceptionToPrint from "../../NewReception/ReceptionToPrint";
import { create } from "@mui/material/styles/createTransitions";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { useRouter } from "next/router";

const receptions = require("../../../services/receptions");
const variesties = require("../../../services/varieties");
const types = require("../../../services/types");
const producerAccounts = require("../../../services/producerAccounts");
const packs = require("../../../services/packs");
const records = require("../../../services/records");
const pallets = require("../../../services/pallets");

export default function ReceptionsGrid(props) {
  const router = useRouter();
  const { receptionsList, title } = props;
  const { openSnack, user } = useAppContext();
  const [gridApiRef, setGridApiRef] = useState(null);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPacksDialog, setOpenPacksDialog] = useState(false);
  const [rowData, setRowData] = useState(rowDataDefault());
  const [lockReceptionDialog, setLockReceptionDialog] = useState(false);

  const [varietyInput, setVarietyInput] = useState("");
  const [variestiesOptions, setVariestiesOptions] = useState([]);
  const [typeInput, setTypeInput] = useState("");
  const [typesOptions, setTypesOptions] = useState([]);

  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [openEditCreatedDialog, setOpenEditCreatedDialog] = useState(false);

  useEffect(() => {
    //console.log("receptionsList", receptionsList);
    variesties.findAll().then((res) => {
      let data = res.map((variety) => ({
        id: variety.id,
        key: variety.id,
        label: variety.name,
      }));
      setVariestiesOptions(data);
    });

    types.findAll().then((res) => {
      let data = res.map((type) => ({
        id: type.id,
        key: type.id,
        label: type.name,
      }));
      setTypesOptions(data);
    });
  }, []);

  const calcPrice = (clp, usd, change) => {
    let result = 0;

    if (usd) {
      result = usd * change;
    } else {
      result = clp;
    }
    setRowData({ ...rowData, clp: result, usd: usd, change: change });
  };

  const editReception = () => {
    let clp = parseFloat(rowData.clp);
    let usd = parseFloat(rowData.usd);
    let change = parseInt(rowData.change);
    let money = rowData.money;
    let showUsd = rowData.showUsd;
    let variety = rowData.variety;
    let type = rowData.type;
    let toPay = parseFloat(rowData.toPay);
    let impurityWeight = rowData.impurityWeight;
    let net = rowData.originalNet;

    console.log("clp", clp);

    if (showUsd) {
      money = "USD";
    } else {
      money = "CLP";
    }

    net = net - impurityWeight;
    toPay = net * clp;

    clp = clp.toFixed(2);
    usd = usd.toFixed(2);
    change = change.toFixed(2);
    toPay = toPay.toFixed(2);

    receptions
      .update(
        rowData.id,
        clp,
        usd,
        change,
        money,
        variety.id,
        type.id,
        toPay,
        impurityWeight,
        net
      )
      .then((res) => {
        gridApiRef.current.updateRows([
          {
            id: rowData.rowId,
            clp: clp,
            usd: usd,
            change: change,
            money: money,
            variety: variety,
            varietyName: variety.label,
            type: type,
            typeName: type.label,
            toPay: toPay,
            impurityWeight: impurityWeight,
            net: net,
          },
        ]);
        setOpenEditDialog(false);
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(toPay);
  };

  const updateCreatedAt = async () => {
    console.log(rowData.createdAt);
    const updatedReception = await receptions.updateCreatedAt(rowData.id, rowData.createdAt);
    console.log(updatedReception);
    gridApiRef.current.updateRows([
      {
        id: rowData.rowId,
        createdAt: rowData.createdAt,
      },
    ]);
    setOpenEditCreatedDialog(false);
    
  };

  const closeReception = async () => {
    let toPay = parseInt(rowData.toPay);
    const closeReception = await receptions.closeReception(rowData.id);

    const lastMovement = await producerAccounts.findLastByProducerId(
      rowData.producerId
    );

    let newBalance = 0;
    if (lastMovement == null) {
      newBalance = toPay;
    } else {
      newBalance = lastMovement.balance + toPay;
    }

    const newCredit = await producerAccounts.create(
      rowData.producerId,
      toPay,
      0,
      newBalance,
      rowData.id,
      0,
      "Cierre de recepción" + rowData.id
    );

    setLockReceptionDialog(false);

    gridApiRef.current.updateRows([
      {
        id: rowData.rowId,
        open: false,
      },
    ]);
  };

  const setRow = (params) => {
    setRowData({
      rowId: params.id,
      id: params.row.id,
      producerName: params.row.producerName,
      producerRut: params.row.producerRut,
      producerId: params.row.producerId,
      varietyName: params.row.varietyName,
      variety: params.row.variety,
      typeName: params.row.typeName,
      type: params.row.type,
      guide: params.row.guide,
      clp: params.row.clp,
      usd: params.row.usd,
      change: params.row.change,
      money: params.row.money,
      traysQuanty: params.row.traysQuanty,
      traysWeight: params.row.traysWeight,
      impurityWeight: params.row.impurityWeight,
      gross: params.row.gross,
      net: params.row.net,
      originalNet: params.row.originalNet,
      packs: params.row.packs,
      toPay: params.row.toPay,
      open: params.row.open,
    });
  };

  const destroyReception = async () => {
    if (rowData.open == true) {
      await receptions.destroy(rowData.id);
      const packs_ = rowData.packs;
      packs_.forEach(async (pack) => {
        await packs.destroy(pack.id);
      });
      await records.create(
        "Recepciones",
        "Eliminación",
        "Recepción " + rowData.id,
        user.id
      );

      rowData.packs.forEach(async (pack) => {
        //console.log('pack', pack)
        await pallets.updateTrays(pack.pallet_id, pack.quanty * -1);
      });
      // await pallets.updateTrays()

      gridApiRef.current.updateRows([{ id: rowData.rowId, _action: "delete" }]);
      setOpenDeleteDialog(false);
    } else {
      await receptions.destroy(rowData.id);
      const packs_ = rowData.packs;
      packs_.forEach(async (pack) => {
        await packs.destroy(pack.id);
      });

      rowData.packs.forEach(async (pack) => {
        //console.log('pack', pack)
        await pallets.updateTrays(pack.pallet_id, pack.quanty * -1);
      });

      const lastMovement = await producerAccounts.findLastByProducerId(
        rowData.producerId
      );
      producerAccounts.create(
        rowData.producerId,
        0,
        rowData.toPay,
        lastMovement.balance - rowData.toPay,
        rowData.id,
        3,
        "Eliminación de recepción" + rowData.id
      );
      await records.create(
        "Recepciones",
        "Eliminación",
        "Recepción " + rowData.id,
        user.id
      );
      gridApiRef.current.updateRows([{ id: rowData.rowId, _action: "delete" }]);
      setOpenDeleteDialog(false);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Id",
      flex: 0.2,
      type: "number",
      headerClassName: "row-header-tiny",
      valueFormatter: (params) => params.value,
    },
    {
      field: "createdAt",
      headerName: "Fecha",
      flex: 0.55,
      headerClassName: "row-header-tiny",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Formatear la fecha */}
          <span>{moment(params.value).format("DD-MM-YYYY HH:mm")}</span>

          {/* Botón de edición */}
          <IconButton
            color="primary"
            aria-label="edit"
            size="small"
            onClick={() => {
              // Lógica para manejar el evento de clic en el botón de editar
              setRow(params);
              setOpenEditCreatedDialog(true);
            }}
            sx={{
              fontSize: 12,
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
    {
      field: "originalNet",
      headerName: "Neto Original",
      flex: 0.3,
      hide: true,
      headerClassName: "row-header-tiny",
      valueFormatter: (params) => params.value,
    },
    {
      field: "producerName",
      headerName: "Productor",
      flex: 0.6,
      headerClassName: "row-header-tiny",
    },
    {
      field: "producerRut",
      headerName: "Rut",
      flex: 0.4,
      headerClassName: "row-header-tiny",
    },
    {
      field: "varietyName",
      headerName: "Variedad",
      flex: 0.5,
      headerClassName: "row-header-tiny",
    },
    {
      field: "typeName",
      headerName: "Tipo",
      flex: 0.3,
      hide: true,
      headerClassName: "row-header-tiny",
    },
    {
      field: "guide",
      headerName: "Guía",
      flex: 0.3,
      hide: true,
      headerClassName: "row-header-tiny",
    },
    {
      field: "clp",
      headerName: "Precio",
      flex: 0.38,
      hide: false,
      headerClassName: "row-header-tiny",
      valueFormatter: (params) =>
        params.value.toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
          minimumFractionDigits: 2,
        }),
    },
    {
      field: "usd",
      headerName: "Dolar",
      flex: 0.35,
      hide: false,
      headerClassName: "row-header-tiny",
      valueFormatter: (params) =>
        params.value.toLocaleString("es-CL", {
          style: "currency",
          currency: "USD",
        }),
    },
    {
      field: "change",
      headerName: "Cambio",
      flex: 0.3,
      hide: true,
      headerClassName: "row-header-tiny",
    },
    {
      field: "money",
      headerName: "Moneda",
      flex: 0.35,
      hide: false,
      headerClassName: "row-header-tiny",
    },
    {
      field: "traysQuanty",
      headerName: "Bandejas",
      flex: 0.35,
      headerClassName: "row-header-tiny",
      valueFormatter: (params) =>
        new Intl.NumberFormat("es-CL", {
          style: "decimal",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(params.value) + " unds",
    },
    {
      field: "traysWeight",
      headerName: "Bandejas",
      flex: 0.35,
      headerClassName: "row-header-tiny",
      valueFormatter: (params) =>
        new Intl.NumberFormat("es-CL", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value) + " kg",
    },
    {
      field: "gross",
      headerName: "Bruto",
      flex: 0.35,
      headerClassName: "row-header-tiny",
      valueFormatter: (params) =>
        new Intl.NumberFormat("es-CL", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value) + " kg",
    },
    {
      field: "impurityWeight",
      headerName: "Impurezas",
      flex: 0.4,
      hide: false,
      headerClassName: "row-header-tiny",
      valueFormatter: (params) =>
        new Intl.NumberFormat("es-CL", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value) + " kg",
    },
    {
      field: "net",
      headerName: "Neto",
      flex: 0.35,
      headerClassName: "row-header-tiny",
      valueFormatter: (params) =>
        new Intl.NumberFormat("es-CL", {
          style: "decimal",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value) + " kg",
    },
    {
      field: "toPay",
      headerName: "A Pagar",
      flex: 0.4,
      headerClassName: "row-header-tiny",
      valueFormatter: (params) =>
        params.value.toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
          minimumFractionDigits: 2,
        }),
    },
    {
      field: "settlementId",
      headerName: "Liquidación",
      flex: 0.3,
      hide: true,
      headerClassName: "row-header-tiny",
    },
    {
      field: "actions",
      headerName: "",
      headerClassName: "data-grid-last-column-header",
      type: "actions",
      flex: 0.8,
      getActions: (params) => [
        <GridActionsCellItem
          size={"small"}
          sx={{
            display:
              params.row.settlement == true || user.Profile.delete == false
                ? "none"
                : "inline-flex",
          }}
          label="delete"
          icon={<DeleteIcon sx={{ fontSize: 16 }} />}
          onClick={() => {
            setRow(params);
            console.log("ROW", params.row);
            setOpenDeleteDialog(true);
          }}
        />,
        <GridActionsCellItem
          label="print"
          icon={<PrintIcon sx={{ fontSize: 16 }} />}
          onClick={() => {
            setRow(params);
            setOpenPrintDialog(true);
          }}
        />,
        <GridActionsCellItem
          sx={{
            display:
              params.row.open == true && user.Profile.edit == true
                ? "inline-flex"
                : "none",
          }}
          label="edit"
          icon={<EditIcon sx={{ fontSize: 16 }} />}
          onClick={() => {
            setRow(params);
            setOpenEditDialog(true);
          }}
        />,
        <GridActionsCellItem
          label="packs"
          icon={<ViewQuiltIcon sx={{ fontSize: 16 }} />}
          onClick={() => {
            setRow(params);
            setOpenPacksDialog(true);
          }}
        />,
        <GridActionsCellItem
          sx={{
            display: user.Profile.close_reception ? "inline-flex" : "none",
          }}
          label="open"
          icon={
            params.row.open ? (
              <LockOpenIcon sx={{ fontSize: 16 }} />
            ) : (
              <LockIcon sx={{ fontSize: 16 }} />
            )
          }
          onClick={() => {
            if (params.row.toPay > 0 && params.row.open) {
              setRow(params);
              setLockReceptionDialog(true);
            } else {
              if (params.row.open == false) {
                openSnack("La recepción ya esta cerrada", "error");
              } else if (params.row.toPay == 0) {
                openSnack(
                  "No se puede cerrar una recepción con monto A pagar 0",
                  "error"
                );
              }
            }
          }}
        />,
        <GridActionsCellItem
          sx={{ display: params.row.settlement ? "inline-flex" : "none" }}
          label="settlement"
          icon={<DoneAllIcon color="success" sx={{ fontSize: 16 }} />}
          onClick={() => {
            console.log("ROW", params.row);
          }}
        />,
      ],
    },
  ];
  return (
    <>
      {/* <DataGrid title={title} rows={receptionsList} columns={columns} height='80vh' setGridApiRef={setGridApiRef} /> */}
      <InfoDataGrid
        title={title}
        rows={receptionsList}
        columns={columns}
        height="87vh"
        setGridApiRef={setGridApiRef}
      />

      <Dialog open={openEditDialog} maxWidth={"xs"} fullWidth>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editReception();
          }}
        >
          <DialogTitle sx={{ padding: 2 }}>
            {" "}
            Editar recepción {rowData.id}
          </DialogTitle>
          <DialogContent sx={{ padding: 1 }}>
            <Grid container spacing={1} direction={"column"}>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={rowData.showUsd}
                      onChange={() => {
                        setRowData({ ...rowData, showUsd: !rowData.showUsd });
                      }}
                    />
                  }
                  label="Precio en dolares"
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Precio"
                  value={rowData.clp}
                  onChange={(e) => {
                    setRowData({ ...rowData, clp: e.target.value });
                  }}
                  variant="outlined"
                  type="number"
                  size={"small"}
                  fullWidth
                  autoFocus
                  className="no-spin"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">CLP</InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid
                item
                sx={{ display: rowData.showUsd ? "inline-block" : "none" }}
              >
                <TextField
                  label="USD"
                  value={rowData.usd}
                  type="number"
                  onChange={(e) => {
                    calcPrice(rowData.clp, e.target.value, rowData.change);
                  }}
                  variant="outlined"
                  className="no-spin"
                  size={"small"}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">USD</InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid
                item
                sx={{ display: rowData.showUsd ? "inline-block" : "none" }}
              >
                <TextField
                  label="Cambio"
                  value={rowData.change}
                  type="number"
                  // calcPrice(receptionClp, e.target.value, receptionChange, receptionMoney)
                  onChange={(e) => {
                    calcPrice(rowData.clp, rowData.usd, e.target.value);
                  }}
                  variant="outlined"
                  size={"small"}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">CLP</InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  inputValue={varietyInput}
                  onInputChange={(e, newInputValue) => {
                    setVarietyInput(newInputValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    null || option.id === value.id
                  }
                  value={rowData.variety}
                  onChange={(e, newValue) => {
                    setRowData({ ...rowData, variety: newValue });
                  }}
                  getOptionLabel={(option) => option.label}
                  disablePortal
                  options={variestiesOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Variedad"
                      size={"small"}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Grid item>
                <Autocomplete
                  inputValue={typeInput}
                  onInputChange={(e, newInputValue) => {
                    setTypeInput(newInputValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    null || option.id === value.id
                  }
                  value={rowData.type}
                  onChange={(e, newValue) => {
                    setRowData({ ...rowData, type: newValue });
                  }}
                  getOptionLabel={(option) => option.label}
                  disablePortal
                  options={typesOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tipo"
                      size={"small"}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Impurezas"
                  value={rowData.impuritypercent}
                  type={"number"}
                  onChange={(e) => {
                    setRowData({
                      ...rowData,
                      impuritypercent: e.target.value,
                      impurityWeight:
                        (rowData.originalNet * e.target.value) / 100,
                    });
                  }}
                  variant="outlined"
                  size={"small"}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  inputProps={{
                    min: 0,
                    max: 100,
                    step: 0.01,
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Impurezas"
                  value={rowData.impurityWeight}
                  type="number"
                  // calcPrice(receptionClp, e.target.value, receptionChange, receptionMoney)
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                    readOnly: true,
                  }}
                  variant="outlined"
                  size={"small"}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ padding: 2 }}>
            <Button variant="contained" type={"submit"}>
              Actualizar
            </Button>
            <Button variant="outlined" onClick={() => setOpenEditDialog(false)}>
              Cerrar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openPacksDialog} maxWidth={"sm"} fullWidth>
        <DialogTitle sx={{ padding: 2 }}>
          {" "}
          Packs recepción {rowData.id}
        </DialogTitle>
        <DialogContent sx={{ padding: 1 }}>
          <Grid container spacing={1}>
            {rowData.packs.map((pack) => (
              <Grid item key={pack.id} xs={3}>
                <PackCard pack={pack} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button variant="contained" onClick={() => setOpenPacksDialog(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={lockReceptionDialog} maxWidth={"xs"} fullWidth>
        <DialogTitle sx={{ padding: 2 }}>
          {" "}
          Cierre recepción {rowData.id}
        </DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          <Typography variant={"subtitle2"}>
            ¿Esta seguro que desea cerrar la recepción {rowData.id}, del
            productor {rowData.producerName}?
          </Typography>
          <Typography variant="caption">
            El cierre de la receptión generara un abono en la cuenta del
            productor.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              closeReception();
            }}
          >
            Cerrar recepción
          </Button>
          <Button
            variant="outlined"
            onClick={() => setLockReceptionDialog(false)}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} maxWidth={"xs"} fullWidth>
        <DialogTitle sx={{ padding: 2 }}>
          {" "}
          Elimiar recepción {rowData.id}
        </DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          <Typography variant={"subtitle2"}>
            ¿Esta seguro que desea eliminar la recepción {rowData.id}, del
            productor {rowData.producerName}?
          </Typography>
          <Divider sx={{ paddingTop: 2 }} />
          <Box
            textAlign={"right"}
            sx={{ paddingTop: 2, paddingLeft: 20 }}
            alignItems={"flex-end"}
          >
            <Typography fontSize={10}>
              La eliminación de esta recepción generara una nota de credito (si
              ya se encuentra cerrada) y eliminara los packs del pallet
              correspondiente
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              destroyReception();
            }}
          >
            Eliminar
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenDeleteDialog(false);
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditCreatedDialog} maxWidth={"xs"} fullWidth>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateCreatedAt();
          }}
        >
          <DialogTitle sx={{ padding: 2 }}>
            {" "}
            Editar fecha recepción {rowData.id}
          </DialogTitle>
          <DialogContent sx={{ padding: 2 }}>
            <Grid container spacing={1} direction={"column"}>
              <Grid item pt={1}>
                <DesktopDatePicker
                  label="Fecha"
                  inputFormat="DD-MM-YYYY"
                  value={rowData.createdAt}
                  onChange={(e) => {
                    setRowData({ ...rowData, createdAt: e });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth autoFocus />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ padding: 2 }}>
            <Button variant="contained" type="submit">Actualizar</Button>
            <Button
              variant="outlined"
              onClick={() => {
                setOpenEditCreatedDialog(false);
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <PrintDialog
        open={openPrintDialog}
        setOpen={setOpenPrintDialog}
        title={"Recibo recepcción " + rowData.id}
        dialogWidth={"xs"}
      >
        <ReceptionToPrint receptionId={rowData.id} />
      </PrintDialog>
    </>
  );
}

function rowDataDefault() {
  return {
    rowId: "",
    id: "",
    producerName: "",
    producerRut: "",
    varietyName: "",
    typeName: "",
    guide: "",
    clp: "",
    usd: "",
    change: "",
    money: "",
    traysQuanty: "",
    traysWeight: "",
    impurityWeight: 0,
    gross: "",
    net: "",
    originalNet: 0,
    packs: [],
    showUsd: false,
    toPay: "",
    variety: { key: 0, label: "", id: 0 },
    type: { key: 0, label: "", id: 0 },
    impuritypercent: 0,
    createdAt: new Date(),
  };
}
