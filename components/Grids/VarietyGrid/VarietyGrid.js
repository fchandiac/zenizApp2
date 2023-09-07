import React, { useState, useEffect } from 'react'
import DataGrid from '../../Karmextron/DataGrid/DataGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoIcon from '@mui/icons-material/Info'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import ArticleIcon from '@mui/icons-material/Article'
import EditIcon from '@mui/icons-material/Edit'
import { GridActionsCellItem } from '@mui/x-data-grid'
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, FormControlLabel,
    Switch, TextField, InputAdornment, Autocomplete, Paper
} from '@mui/material'
import moment from 'moment';
import VarietyForm from '../../Forms/VarietyForm/VarietyForm';

const varieties = require('../../../services/varieties')

export default function VarietyGrid(props) {
    const { update } = props
    const [gridApiRef, setGridApiRef] = useState(null)
    const [varietyList, setVarietyList] = useState([])
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [rowData, setRowData] = useState(rowDataDefault())

    useEffect(() => {
        const fetchData = async () => {
            const varietiesData = await varieties.findAll()
            let data = varietiesData.map((variety) => ({
                id: variety.id,
                name: variety.name,
                clp: variety.clp,
                usd: variety.usd,
                money: variety.money,
                createdAt: variety.createdAt
            }))
            setVarietyList(data)
        }
        fetchData()
    }, [update])

    const columns = [
        { field: 'id', headerName: 'Id', flex: 1 },
        { field: 'name', headerName: 'Nombre', flex: 1 },
        { field: 'clp', headerName: 'CLP', flex: 1 },
        { field: 'usd', headerName: 'USD', flex: 1 },
        { field: 'money', headerName: 'Moneda', flex: 1 },
        { field: 'createdAt', headerName: 'Fecha creación', flex: 1, type: 'date', valueFormatter: (params) => moment(params.value).format('DD-MM-YYYY HH:mm') },
        {
            field: 'actions',
            headerName: '',
            headerClassName: 'data-grid-last-column-header',
            type: 'actions', flex: 2, getActions: (params) => [
                <GridActionsCellItem
                    label='destroy'
                    icon={<DeleteIcon />}
                    onClick={() => { console.log('delete') }}
                />,
              <GridActionsCellItem
                label='edit'
                icon={<EditIcon />}
                onClick={() => {
                    setRowData({
                        rowId: params.id,
                        id: params.row.id,
                        name: params.row.name,
                        clp: params.row.clp,
                        usd: params.row.usd,
                        money: params.row.money,
                        moneySwitch: params.row.money === 'CLP' ? false : true
                    })
                    setOpenEditDialog(true)
                }}
              />,
                // <GridActionsCellItem
                //     label='report'
                //     icon={<ArticleIcon />}
                //     onClick={() => { console.log('report') }}
                // />
            ]

          },
      
    ]

    return (
        <>
            <DataGrid columns={columns} rows={varietyList}  height='80vh' setGridApiRef={setGridApiRef}/>
            <Dialog open={openEditDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Editar Variedad {rowData.id}</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                   <VarietyForm 
                   afterSubmit={() => {console.log('afterSubmit')}} 
                   dialog= {true}
                   edit={true}
                   closeDialog={(e) => {setOpenEditDialog(false)}} 
                   varietyData={rowData} 
                   setVarietyData={setRowData}
                   gridApiRef={gridApiRef}
                   />
                </DialogContent>
            </Dialog>
        </>
    )
}

function rowDataDefault () {
    return ({
        id: 0,
        name: '',
        clp: 0,
        usd: 0,
        money: 'CLP'
    })
}