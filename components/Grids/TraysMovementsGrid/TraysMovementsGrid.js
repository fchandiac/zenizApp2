import React, { useState, useEffect } from 'react'
import InfoDataGrid from '../../Karmextron/InfoDataGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoIcon from '@mui/icons-material/Info'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import EditIcon from '@mui/icons-material/Edit'
import { GridActionsCellItem } from '@mui/x-data-grid'
import PrintIcon from '@mui/icons-material/Print'
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, FormControlLabel,
    Switch, TextField, InputAdornment, Autocomplete, Paper, Box, IconButton, Tooltip
} from '@mui/material'
import moment from 'moment'
import PrintDialog from '../../PrintDialog/PrintDialog';
import TrayMovementToPrint from './TrayMovementToPrint';


const traysMovements = require('../../../services/traysMovements')

export default function TraysMovementsGrid(props) {
    const { traysMovementsList } = props
    const [gridApiRef, setGridApiRef] = useState(null)
    const [rowData, setRowData] = useState(rowDataDefault())
    const [openPrintDialog, setOpenPrintDialog] = useState(false)


    const columns = [
        { field: 'id', headerName: 'Id', flex: 1, type: 'number', valueFormatter: (params) => params.value },
        { field: 'trayName', headerName: 'Bandeja', flex: 1 },
        { field: 'producerName', headerName: 'Productor', flex: 1 },
        {
            field: 'receptionId', headerName: 'Recepción', flex: 1,
            renderCell: (params) => {
                return params.value === '' ?
                    <Box sx={{ display: 'flex', justifyContent: 'center', color: '#757575' }}>
                        <DeleteIcon />
                    </Box> :
                    params.value

            }
        },
        { field: 'quanty', headerName: 'Cantidad', flex: 1, type: 'number' },
        {
            field: 'type', headerName: 'Tipo', flex: 1,
            valueFormatter: (params) => setType(params.value)
        },
        { field: 'balance', headerName: 'Saldo', flex: 1, type: 'number' },
        { field: 'description', headerName: 'Descripción', flex: 2 },
        {
            field: 'createdAt', headerName: 'Fecha', flex: 1, type: 'dateTime',
            valueFormatter: (params) => moment(params.value).format('DD-MM-YYYY HH:mm'),
        }, {
            field: 'actions',
            headerName: '',
            headerClassName: 'data-grid-last-column-header',
            type: 'actions', flex: .5, getActions: (params) => [
                <GridActionsCellItem
                    label='print'
                    icon={<PrintIcon />}
                    onClick={() => { 
                        setRowData({
                            id: params.row.id,
                            trayId: params.row.trayId,
                            trayName: params.row.trayName,
                            producer: params.row.producer,
                            producerName: params.row.producerName,
                            reception: params.row.reception,
                            quanty: params.row.quanty,
                            type: params.row.type,
                            balance: params.row.balance,
                            description: params.row.description,
                            createdAt: params.row.createdAt
                        })
                        setOpenPrintDialog(true)
                     }}
                />
            ]

        },
    ]

    const setType = (type) => {
        switch (type) {
            case 0:
                return 'Entrada'
            case 1:
                return 'Egreso'
            case 2:
                return 'Devolución al productor'
            case 3:
                return 'Recepción'
            default:
                return ''
        }
    }

    const getRowClassName = (params) => {
        const type = params.row.type;
        switch (type) {
            case 0:
                return 'data-grid-cell-green'
            case 1:
                return 'data-grid-cell-red'
            case 2:
                return 'data-grid-cell-red'
            case 3:
                return 'data-grid-cell-green'
            default:
                return ''
        }
    }





    return (
        <>
            <InfoDataGrid
                rows={traysMovementsList}
                columns={columns}
                title='Movimientos de Bandejas'
                headerVariant='h6'
                height={'80vh'}
                setGridApiRef={setGridApiRef}
                money={false}
                getRowClassName={getRowClassName}
            />
            <PrintDialog
                open={openPrintDialog}
                setOpen={setOpenPrintDialog}
                title={'Recibo moviento de bandejas'}
                dilalogWidth={'sx'}
            >
                <TrayMovementToPrint movementId={rowData.id} />
            </PrintDialog>
        </>


    )
}


function rowDataDefault() {
    return ({
        id: 0,
        trayId: 0,
        trayName: '',
        producer: {},
        producerName: '',
        reception: {},
        quanty: 0,
        type: '',
        balance: 0,
        description: '',
        createdAt: moment(new Date).format('YYYY-MM-DD HH:mm:ss')


    })
}