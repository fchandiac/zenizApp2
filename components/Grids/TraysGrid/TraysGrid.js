import React, { useState, useEffect } from 'react'
import InfoDataGrid from '../../Karmextron/InfoDataGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoIcon from '@mui/icons-material/Info'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import EditIcon from '@mui/icons-material/Edit'
import { GridActionsCellItem } from '@mui/x-data-grid'
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, FormControlLabel,
    Switch, TextField, InputAdornment, Autocomplete, Paper
} from '@mui/material'
import moment from 'moment'
import TrayForm from '../../Forms/TrayForm/TrayForm'

const trays = require('../../../services/trays')


export default function TraysGrid(props) {
    const { update } = props
    const [gridApiRef, setGridApiRef] = useState(null)
    const [traysList, setTraysList] = useState([])
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [rowData, setRowData] = useState(rowDataDefault())

    useEffect(() => {
        const fetchData = async () => {
            const traysData = await trays.findAll()
            let data = traysData.map((tray) => ({
                id: tray.id,
                name: tray.name,
                weight: tray.weight,
                stock: tray.stock,
                createdAt: tray.createdAt
            }))
            setTraysList(data)
        }
        fetchData()
    }, [update])

    const updateRow = (row) => {
        gridApiRef.current.updateRows([{
            id: row.id,
            name: row.name,
            weight: row.weight
        }])
    }

    const columns = [
        { field: 'id', headerName: 'Id', flex: 1, type: 'number', valueFormatter: (params) => params.value },
        { field: 'name', headerName: 'Nombre', flex: 1 },
        {
            field: 'weight', headerName: 'Peso', flex: 1, type: 'number',
            valueFormatter: (params) =>
                new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(params.value) + ' kg'
        },
        { field: 'stock', headerName: 'Stock', flex: 1, type: 'number' },
        {
            field: 'createdAt', headerName: 'Fecha de Creación', flex: 1, type: 'date',
            valueFormatter: (params) => moment(params.value).format('DD-MM-YYYY HH:00')
        },
        {
            field: 'actions',
            headerName: '',
            headerClassName: 'data-grid-last-column-header',
            type: 'actions', flex: .8, getActions: (params) => [
                <GridActionsCellItem
                    sx={{ display: params.row.settlement ? 'none' : 'inline-flex' }}
                    label='delete'
                    icon={<DeleteIcon />}
                    onClick={() => {
                        openSnack('La recepción ya esta cerrada', 'error')
                    }}
                />,
                <GridActionsCellItem
                    label='edit'
                    icon={<EditIcon />}
                    onClick={() => {
                        setRowData({
                            rowID: params.id,
                            id: params.row.id,
                            name: params.row.name,
                            weight: params.row.weight,
                            stock: params.row.stock,
                        })
                        setOpenEditDialog(true)
                    }}
                />
            ]
        },

    ]

    return (
        <>
            <InfoDataGrid
                columns={columns}
                rows={traysList}
                height='80vh'
                setGridApiRef={setGridApiRef}
                title={'Bandejas'}
                infoField={'stock'}
                infoTitle={'Total bandejas: '}
                money={false}
            />

            <Dialog open={openEditDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Editar bandeja {rowData.id}</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <TrayForm
                        dialog={true}
                        edit={true}
                        afterSubmit={() => {
                            updateRow(rowData)
                            setOpenEditDialog(false)
                            setRowData(rowDataDefault())

                         }}
                        closeDialog={(e) => { setOpenEditDialog(false) }}
                        trayData={rowData}
                        setTrayData={setRowData}
                        gridApiRef={gridApiRef}
                    />
                </DialogContent>
            </Dialog>

        </>
    )
}

function rowDataDefault() {
    return {
        rowID: 0,
        id: 0,
        name: '',
        weight: '',
        stock: '',
    }
}
