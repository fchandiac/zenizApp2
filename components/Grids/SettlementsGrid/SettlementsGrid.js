import React, { useState, useEffect } from 'react'
import DataGrid from '../../Karmextron/DataGrid/DataGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import EditIcon from '@mui/icons-material/Edit'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import PrintIcon from '@mui/icons-material/Print'
import { GridActionsCellItem } from '@mui/x-data-grid'
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, FormControlLabel,
    Switch, TextField, InputAdornment, Autocomplete, Box,
} from '@mui/material'
import { useAppContext } from '../../../appProvider'
import moment from 'moment'
import AppDataGrid from '../../Karmextron/DataGrid/DataGrid'
import PrintDialog from '../../PrintDialog/PrintDialog'
import SettlementToPrint from './SettlementToPrint'

export default function SettlementsGrid(props) {
    const { settlementsList, title } = props
    const { openSnack } = useAppContext()
    const [gridApiRef, setGridApiRef] = useState(null)
    const [openPrintDialog, setOpenPrintDialog] = useState(false)
    const [rowData, setRowData] = useState(rowDataDefault())

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number', valueFormatter: (params) => params.value },
        { field: 'producerName', headerName: 'Productor', flex: 1 },
        { field: 'producerRut', headerName: 'Rut', flex: 1 },
        {
            field: 'amount', headerName: 'Monto', flex: 1,
            valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
        },
        { field: 'description', headerName: 'Descripción', flex: 1 },
        { field: 'cratedAt', headerName: 'Fecha', flex: 1, valueFormatter: (params) => (moment(params.value).format('DD-MM-YYYY HH:mm')) },
        {
            field: 'actions',
            headerName: '',
            headerClassName: 'data-grid-last-column-header',
            type: 'actions', flex: .5, getActions: (params) => [
                <GridActionsCellItem
                    label='print'
                    icon={<PrintIcon />}
                    onClick={() => {
                        console.log(params.row)
                        setRowData({
                            id: params.row.id,
                            producerName: params.row.producerName,
                            producerRut: params.row.producerRut,
                            amount: params.row.amount,
                            description: params.row.description,
                            createdAt: params.row.createdAt,
                            receptions: params.row.receptions

                        })
                        setOpenPrintDialog(true)
                    }}
                />,
            ]
        }

    ]



    return (
        <>
            <DataGrid title={title} rows={settlementsList} columns={columns} height='80vh' setGridApiRef={setGridApiRef} />
            <PrintDialog
                open={openPrintDialog}
                setOpen={setOpenPrintDialog}
                title='Comprobante Liquidación'
                dialogWidth={'lg'}

            >
        
                    <SettlementToPrint settlement={rowData} />
 
            </PrintDialog>
        </>
    )
}
function rowDataDefault() {
    return {
        id: 0,
        producerName: '',
        producerRut: '',
        amount: 0,
        description: '',
        cratedAt: '',
        receptions: []
    }
}

