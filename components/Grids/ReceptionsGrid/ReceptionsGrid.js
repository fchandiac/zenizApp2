import React, { useState, useEffect } from 'react'
import DataGrid from '../../Karmextron/DataGrid/DataGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import EditIcon from '@mui/icons-material/Edit'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { GridActionsCellItem } from '@mui/x-data-grid'
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, FormControlLabel,
    Switch, TextField, InputAdornment, Autocomplete
} from '@mui/material'
import PackCard from '../../Cards/PackCard/PackCard'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { useAppContext } from '../../../appProvider'
import moment from 'moment'
import InfoDataGrid from './InfoDataGrid'
import PrintIcon from '@mui/icons-material/Print'
import PrintDialog from '../../PrintDialog/PrintDialog'
import ReceptionToPrint from '../../NewReception/ReceptionToPrint'
import { set } from 'date-fns'


const receptions = require('../../../services/receptions')
const variesties = require('../../../services/varieties')
const types = require('../../../services/types')
const producerAccounts = require('../../../services/producerAccounts')




export default function ReceptionsGrid(props) {
    const { receptionsList, title } = props
    const { openSnack, user } = useAppContext()
    const [gridApiRef, setGridApiRef] = useState(null)

    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openPacksDialog, setOpenPacksDialog] = useState(false)
    const [rowData, setRowData] = useState(rowDataDefault())
    const [lockReceptionDialog, setLockReceptionDialog] = useState(false)

    const [varietyInput, setVarietyInput] = useState('')
    const [variestiesOptions, setVariestiesOptions] = useState([])
    const [typeInput, setTypeInput] = useState('')
    const [typesOptions, setTypesOptions] = useState([])

    const [openPrintDialog, setOpenPrintDialog] = useState(false)

    console.log(user)


    useEffect(() => {
        console.log('receptionsList', receptionsList)
        variesties.findAll().then(res => {
            let data = res.map(variety => ({
                id: variety.id,
                key: variety.id,
                label: variety.name
            }))
            setVariestiesOptions(data)
        })

        types.findAll().then(res => {
            let data = res.map(type => ({
                id: type.id,
                key: type.id,
                label: type.name
            }))
            setTypesOptions(data)
        })

    }, [])

    const calcPrice = (clp, usd, change) => {
        let result = 0

        if (usd) {
            result = usd * change
        } else {
            result = clp
        }
        console.log('result', result)
        setRowData({ ...rowData, clp: result, usd: usd, change: change })
    }

    const editReception = () => {
        let clp = rowData.clp
        let usd = rowData.usd
        let change = rowData.change
        let money = rowData.money
        let showUsd = rowData.showUsd
        let variety = rowData.variety
        let type = rowData.type
        let toPay = rowData.toPay
        let impurityWeight = rowData.impurityWeight
        let net = rowData.net


        if (showUsd) {
            money = 'USD'
            if (clp > 0) {
                money = 'CLP'
            }
        }
        net = net - impurityWeight
        toPay = net * clp

        receptions.update(
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
        ).then(res => {
            gridApiRef.current.updateRows([{
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
            }])
            setOpenEditDialog(false)
        })
            .catch(err => { console.log(err) })


        console.log(toPay)

    }

    const closeReception = async () => {
        const closeReception = await receptions.closeReception(rowData.id)

        const lastMovement = await producerAccounts.findLastByProducerId(rowData.producerId)


  
        let newBalance = 0
        if (lastMovement == null) {
            newBalance =  rowData.toPay
        } else {
            newBalance = lastMovement.balance + rowData.toPay
        }


        const newCredit = await producerAccounts.create(
            rowData.producerId,
            rowData.toPay,
            0,
            newBalance,
            rowData.id,
            0,
            'Cierre de recepción' + rowData.id
        )

        setLockReceptionDialog(false)

        gridApiRef.current.updateRows([{
            id: rowData.rowId,
            open: false

        }])


    }

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
            packs: params.row.packs,
            toPay: params.row.toPay,
        })
    }

    const columns = [
        { field: 'id', headerName: 'Id', flex: .3, type: 'number', headerClassName: 'row-header-tiny', valueFormatter: (params) => params.value },
        { field: 'producerName', headerName: 'Productor', flex: .8, headerClassName: 'row-header-tiny' },
        { field: 'producerRut', headerName: 'Rut', flex: .5, headerClassName: 'row-header-tiny' },
        { field: 'varietyName', headerName: 'Variedad', flex: .5, headerClassName: 'row-header-tiny' },
        { field: 'typeName', headerName: 'Tipo', flex: .3, hide: true, headerClassName: 'row-header-tiny' },
        { field: 'guide', headerName: 'Guía', flex: .3, hide: true, headerClassName: 'row-header-tiny', },
        {
            field: 'clp', headerName: 'CLP', flex: .3, hide: false, headerClassName: 'row-header-tiny',
            valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
        },
        { field: 'usd', headerName: 'USD', flex: .3, hide: true, headerClassName: 'row-header-tiny' },
        { field: 'change', headerName: 'Cambio', flex: .3, hide: true, headerClassName: 'row-header-tiny' },
        { field: 'money', headerName: 'Moneda', flex: .35, hide: false, headerClassName: 'row-header-tiny' },
        {
            field: 'traysQuanty', headerName: 'Bandejas', flex: .35, headerClassName: 'row-header-tiny',
            valueFormatter: (params) =>
                new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(params.value) + ' unds'
        },
        {
            field: 'traysWeight', headerName: 'Bandejas', flex: .35, headerClassName: 'row-header-tiny',
            valueFormatter: (params) =>
                new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(params.value) + ' kg'
        },
        {
            field: 'gross', headerName: 'Bruto', flex: .35, headerClassName: 'row-header-tiny',
            valueFormatter: (params) =>
                new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(params.value) + ' kg'
        },
        {
            field: 'impurityWeight', headerName: 'Impurezas', flex: .4, hide: false, headerClassName: 'row-header-tiny',
            valueFormatter: (params) =>
                new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(params.value) + ' kg'
        },
        {
            field: 'net', headerName: 'Neto', flex: .35, headerClassName: 'row-header-tiny',
            valueFormatter: (params) =>
                new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(params.value) + ' kg'
        },
        {
            field: 'toPay', headerName: 'A Pagar', flex: .4, headerClassName: 'row-header-tiny',
            valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
        },
        {
            field: 'settlementId', headerName: 'Liquidación', flex: .3, hide: true, headerClassName: 'row-header-tiny'

        },
        {
            field: 'actions',
            headerName: '',
            headerClassName: 'data-grid-last-column-header',
            type: 'actions', flex: 1, getActions: (params) => [
                <GridActionsCellItem
                    size={'small'}
                    sx={{ display: params.row.settlement == true || user.Profile.delete == false ? 'none' : 'inline-flex', }}
                    label='delete'
                    icon={<DeleteIcon sx={{ fontSize: 16 }} />}
                    onClick={() => {
                        setRow(params)
                        openSnack('La recepción ya esta cerrada', 'error')
                        
                    }}
                />,
                <GridActionsCellItem
                    label='print'
                    icon={<PrintIcon sx={{ fontSize: 16 }} />}
                    onClick={() => {
                        setRow(params)
                        setOpenPrintDialog(true)
                    }}
                />,
                <GridActionsCellItem
                    sx={{ display: params.row.open  == true && user.Profile.edit == true ? 'inline-flex' : 'none' }}
                    label='edit'
                    icon={<EditIcon sx={{ fontSize: 16 }} />}
                    onClick={() => {
                        setRow(params)
                        setOpenEditDialog(true)
                    }}
                />,
                <GridActionsCellItem
                    label='packs'
                    icon={<ViewQuiltIcon sx={{ fontSize: 16 }} />}
                    onClick={() => {
                        setRow(params)
                        setOpenPacksDialog(true)
                    }}
                />,
                <GridActionsCellItem
                    sx={{ display: user.Profile.close_reception ? 'inline-flex' : 'none' }}
                    label='open'
                    icon={params.row.open ? <LockOpenIcon sx={{ fontSize: 16 }} /> : <LockIcon sx={{ fontSize: 16 }} />}
                    onClick={() => {

                        if (params.row.toPay > 0 && params.row.open) {
                            setRow(params)
                            setLockReceptionDialog(true)

                        } else {
                            if (params.row.open == false) {
                                openSnack('La recepción ya esta cerrada', 'error')
                            } else if (params.row.toPay == 0) {
                                openSnack('No se puede cerrar una recepción con monto A pagar 0', 'error')
                            }

                        }
                    }}
                />,
                <GridActionsCellItem
                    sx={{ display: params.row.settlement ? 'inline-flex' : 'none' }}
                    label='settlement'
                    icon={<DoneAllIcon color='success' sx={{ fontSize: 16 }} />}
                    onClick={() => {
                        console.log('ROW', params.row)
                    }}
                />,

            ]
        }
    ]
    return (
        <>
            {/* <DataGrid title={title} rows={receptionsList} columns={columns} height='80vh' setGridApiRef={setGridApiRef} /> */}
            <InfoDataGrid title={title} rows={receptionsList} columns={columns} height='80vh' setGridApiRef={setGridApiRef} />

            <Dialog open={openEditDialog} maxWidth={'xs'} fullWidth>
                <form onSubmit={(e) => { e.preventDefault(); editReception() }}>
                    <DialogTitle sx={{ padding: 2 }}> Editar recepción {rowData.id}</DialogTitle>
                    <DialogContent sx={{ padding: 1 }}>
                        <Grid container spacing={1} direction={'column'}>
                            <Grid item>
                                <FormControlLabel
                                    control={<Switch checked={rowData.showUsd} onChange={() => {
                                        setRowData({ ...rowData, showUsd: !rowData.showUsd })
                                    }} />}
                                    label='Precio en dolares'
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label='Precio'
                                    value={rowData.clp}
                                    onChange={(e) => { setRowData({ ...rowData, clp: e.target.value }) }}
                                    variant="outlined"
                                    type='number'
                                    size={'small'}
                                    fullWidth
                                    autoFocus
                                    className='no-spin'
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        endAdornment: <InputAdornment position="end">CLP</InputAdornment>,
                                    }}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid item sx={{ display: rowData.showUsd ? 'inline-block' : 'none' }}>
                                <TextField
                                    label='USD'
                                    value={rowData.usd}
                                    type='number'
                                    onChange={(e) => { calcPrice(rowData.clp, e.target.value, rowData.change) }}
                                    variant="outlined"
                                    className='no-spin'
                                    size={'small'}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        endAdornment: <InputAdornment position="end">USD</InputAdornment>,

                                    }}
                                    inputProps={{ min: 0 }}

                                />
                            </Grid>
                            <Grid item sx={{ display: rowData.showUsd ? 'inline-block' : 'none' }}>
                                <TextField
                                    label='Cambio'
                                    value={rowData.change}
                                    type='number'
                                    // calcPrice(receptionClp, e.target.value, receptionChange, receptionMoney)
                                    onChange={(e) => { calcPrice(rowData.clp, rowData.usd, e.target.value) }}
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        endAdornment: <InputAdornment position="end">CLP</InputAdornment>,
                                    }}
                                    inputProps={{ min: 0 }}

                                />
                            </Grid>
                            <Grid item >
                                <Autocomplete
                                    inputValue={varietyInput}
                                    onInputChange={(e, newInputValue) => {
                                        setVarietyInput(newInputValue)
                                    }}
                                    isOptionEqualToValue={(option, value) => null || option.id === value.id}
                                    value={rowData.variety}
                                    onChange={(e, newValue) => {
                                        setRowData({ ...rowData, variety: newValue })
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    disablePortal
                                    options={variestiesOptions}
                                    renderInput={(params) => <TextField {...params} label='Variedad' size={'small'} fullWidth />}
                                />
                            </Grid>

                            <Grid item >
                                <Autocomplete
                                    inputValue={typeInput}
                                    onInputChange={(e, newInputValue) => {
                                        setTypeInput(newInputValue)
                                    }}
                                    isOptionEqualToValue={(option, value) => null || option.id === value.id}
                                    value={rowData.type}
                                    onChange={(e, newValue) => {
                                        setRowData({ ...rowData, type: newValue })
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    disablePortal
                                    options={typesOptions}
                                    renderInput={(params) => <TextField {...params} label='Tipo' size={'small'} fullWidth />}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label='Impurezas'
                                    value={rowData.impuritypercent}
                                    type={'number'}
                                    onChange={(e) => {
                                        setRowData({
                                            ...rowData,
                                            impuritypercent: e.target.value,
                                            impurityWeight: (rowData.net * e.target.value) / 100
                                        })

                                    }}
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    inputProps={{
                                        min: 0,
                                        max: 100,
                                    }}

                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label='Impurezas'
                                    value={rowData.impurityWeight}
                                    type='number'
                                    // calcPrice(receptionClp, e.target.value, receptionChange, receptionMoney)
                                    InputProps={
                                        {
                                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                            readOnly: true
                                        }
                                    }
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth

                                />
                            </Grid>

                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ padding: 2 }}>
                        <Button variant='contained' type={'submit'}>Actualizar</Button>
                        <Button variant='outlined' onClick={() => setOpenEditDialog(false)}>Cerrar</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={openPacksDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}> Packs recepción {rowData.id}</DialogTitle>
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
                    <Button variant='contained' onClick={() => setOpenPacksDialog(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={lockReceptionDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}> Cierre recepción {rowData.id}</DialogTitle>
                <DialogContent sx={{ padding: 2 }}>
                    <Typography variant={'subtitle2'}>¿Esta seguro que desea cerrar la recepción {rowData.id}, del productor {rowData.producerName}?</Typography>
                    <Typography variant='caption'>El cierre de la receptión generara un abono en la cuenta del productor.</Typography>
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button variant='contained' onClick={() => { closeReception() }}>Cerrar recepción</Button>
                    <Button variant='outlined' onClick={() => setLockReceptionDialog(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            <PrintDialog
                open={openPrintDialog}
                setOpen={setOpenPrintDialog}
                title={'Recepcción ' + rowData.id}
                maxWidth={'xs'}
            >
                <ReceptionToPrint receptionId={rowData.id} returnetTrays={[]} />
            </PrintDialog>


        </>
    )
}


function rowDataDefault() {
    return ({
        rowId: '',
        id: '',
        producerName: '',
        producerRut: '',
        varietyName: '',
        typeName: '',
        guide: '',
        clp: '',
        usd: '',
        change: '',
        money: '',
        traysQuanty: '',
        traysWeight: '',
        impurityWeight: 0,
        gross: '',
        net: '',
        packs: [],
        showUsd: false,
        toPay: '',
        variety: { key: 0, label: '', id: 0 },
        type: { key: 0, label: '', id: 0 },
        impuritypercent: 0,
    })
}