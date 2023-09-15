import React, { useState, useEffect } from 'react'
import DataGrid from '../../Karmextron/DataGrid/DataGrid'
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
import moment from 'moment';


const types = require('../../../services/types')

export default function TypesGrid(props) {
    const { update } = props
    const [gridApiRef, setGridApiRef] = useState(null)
    const [typesList, setTypesList] = useState([])
    const [rowData, setRowData] = useState({ id: 0, name: '', createdAt: '', rowId: 0 })
    const [openEditDialog, setOpenEditDialog] = useState(false)


    useEffect(() => {
        const fetchData = async () => {
            const typesData = await types.findAll()
            let data = typesData.map((type) => ({
                id: type.id,
                name: type.name,
                createdAt: type.createdAt
            }))
            setTypesList(data)

        }
        fetchData()
    }, [update])

    const columns = [
        { field: 'id', headerName: 'Id', flex: 1 },
        { field: 'name', headerName: 'Nombre', flex: 1 },
        { field: 'createdAt', headerName: 'Fecha cración', flex: 1, type: 'date', valueFormatter: (params) => moment(params.value).format('DD-MM-YYYY') },
        {
            field: 'actions',
            headerName: '',
            headerClassName: 'data-grid-last-column-header',
            type: 'actions', flex: 2, getActions: (params) => [
                <GridActionsCellItem
                    label='destroy'
                    icon={<DeleteIcon />}
                    onClick={() => { openSnack('tipo tiene recepciones asociadas', 'error') }}
                />,
                <GridActionsCellItem
                    label='edit'
                    icon={<EditIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            name: params.row.name,
                            createdAt: params.row.createdAt
                        })
                        setOpenEditDialog(true)
                    }}
                />,

            ]

        },
    ]

    return (
        <>
            <DataGrid columns={columns} rows={typesList} height='80vh' setGridApiRef={setGridApiRef} />
            <Dialog open={openEditDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Editar tipo de fruta {rowData.id}</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <Grid container spacing={2} paddingTop={1}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label='Nombre'
                                value={rowData.name}
                                onChange={(e) => setRowData({ ...rowData, name: e.target.value })}
                                size='small'
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ padding: 1 }}>
                    <Button variant='contained' onClick={() => { }} >Guardar</Button>
                    <Button variant='outlined'  onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
