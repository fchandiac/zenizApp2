import React, { useState } from "react";
import InfoDataGrid from "../../Karmextron/InfoDataGrid/InfoDataGrid";
import PrintDialog from "../../PrintDialog/PrintDialog";
import moment from "moment";
import { GridActionsCellItem } from "@mui/x-data-grid";
import PrintIcon from "@mui/icons-material/Print";
import AdvanceToPrint from "../ProducersGrid/AdvanceToPrint";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Dialog, Grid, TextField, Typography } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { set } from "date-fns";

const advances = require("../../../services/advances");

export default function AdvancesGrid(props) {
  const { advancesList } = props;
  const [gridApiRef, setGridApiRef] = useState(null);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const [rowData, setRowData] = useState(rowDataDefault());
  const [advancePrintData, setAdvancePrintData] = useState(
    advancePrintDataDefault()
  );

  const [openEditCreatedDialog, setOpenEditCreatedDialog] = useState(false);

  const updateCreatedAt = async () => {

    console.log(rowData);   
    const { id, createdAt } = rowData;
    const updateAdvance = await advances.updateCreatedAt(id, createdAt);
    console.log(updateAdvance);

    gridApiRef.current.updateRows([
      {
        id: rowData.id,
        createdAt: rowData.createdAt,
      },
    ]);
    setOpenEditCreatedDialog(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "Id",
      flex: 1,
      valueFormatter: (params) => params.value,
    },
    { field: "producerName", headerName: "Productor", flex: 1 },
    { field: "producerRut", headerName: "Rut", flex: 1 },
    {
      field: "amount",
      headerName: "Monto",
      flex: 1,
      valueFormatter: (params) =>
        params.value.toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
        }),
    },
    { field: "description", headerName: "Descripción", flex: 1 },
    {
      field: "createdAt",
      headerName: "Fecha",
      flex: 1,
      valueFormatter: (params) =>
        moment(params.value).format("DD-MM-YYYY HH:mm"),
    },
    {
      field: "actions",
      headerName: "",
      headerClassName: "data-grid-last-column-header",
      type: "actions",
      flex: 0.5,
      getActions: (params) => [
        <GridActionsCellItem
          label="print"
          icon={<PrintIcon />}
          onClick={async () => {
            const advance = await advances.findOneById(params.row.id);
            setAdvancePrintData(advance);
            setOpenPrintDialog(true);
          }}
        />,

        <GridActionsCellItem
          label="edit"
          icon={<EditIcon />}
          onClick={async () => {
            setRowData(params);
            setOpenEditCreatedDialog(true);
          }}
        />,
      ],
    },
  ];

  return (
    <>
      <InfoDataGrid
        columns={columns}
        rows={advancesList}
        title={"Anticipos"}
        headerVariant={"h6"}
        height={"80vh"}
        setGridApiRef={setGridApiRef}
        money={true}
        infoField={"amount"}
        infoTitle={"Total anticipos"}
      />
      <PrintDialog
        open={openPrintDialog}
        setOpen={setOpenPrintDialog}
        title="Recibo anticipo"
        maxWidth={"lg"}
      >
        <AdvanceToPrint advance={advancePrintData} />
      </PrintDialog>
      <Dialog
        open={openEditCreatedDialog}
        onClose={() => {
          setOpenEditCreatedDialog(false);
        }}
        fullWidth
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateCreatedAt();
          }}
        >
          <Grid container spacing={1} direction={"column"} p={2}>
            <Grid item>
              <Typography variant="h6">Editar anticipo</Typography>
            </Grid>
            <Grid item>
              <DesktopDatePicker
                label="Fecha"
                value={rowData.createdAt}
                onChange={(e) => {
                    setRowData({ ...rowData, createdAt: e });
                }}
                renderInput={(params) => (
                  <TextField {...params} size={"small"} fullWidth />
                )}
              />
            </Grid>
            <Grid item textAlign={"right"}>
              <Button variant="contained" color="primary" type="submit">
                Actualizar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Dialog>
    </>
  );
}

function rowDataDefault() {
  return {
    id: 0,
    producerName: "",
    producerRut: "",
    amount: 0,
    description: "",
    createdAt: "",
  };
}

function advancePrintDataDefault() {
  return {
    id: 0,
    producer_id: 0,
    amount: 0,
    description: "",
    createdAt: moment().format("YYYY-MM-DD"),
    updatedAt: moment().format("YYYY-MM-DD"),
    ProducerId: 0,
    Producer: {
      id: 0,
      rut: "",
      name: "",
      phone: "",
      mail: "",
      address: "",
      createdAt: moment().format("YYYY-MM-DD"),
      updatedAt: moment().format("YYYY-MM-DD"),
    },
  };
}
