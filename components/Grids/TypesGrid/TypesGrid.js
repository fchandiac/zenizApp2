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
    ]

    return (
        <>
            <DataGrid columns={columns} rows={typesList}  height='80vh' setGridApiRef={setGridApiRef}/>
        </>
    )
}
