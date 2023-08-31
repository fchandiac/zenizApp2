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

const varieties = require('../../../services/varieties')

export default function VarietyGrid(props) {
    const { update } = props
    const [gridApiRef, setGridApiRef] = useState(null)
    const [varietyList, setVarietyList] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const varietiesData = await varieties.findAll()
            let data = varietiesData.map((variety) => ({
                id: variety.id,
                name: variety.name,
                createdAt: variety.createdAt
            }))
            setVarietyList(data)
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
            <DataGrid columns={columns} rows={varietyList}  height='80vh' setGridApiRef={setGridApiRef}/>
        </>
    )
}
