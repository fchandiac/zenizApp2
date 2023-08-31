import React, { useState, useEffect } from 'react'
import DataGrid from '../../Karmextron/DataGrid/DataGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import EditIcon from '@mui/icons-material/Edit'
import { GridActionsCellItem } from '@mui/x-data-grid'
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, FormControlLabel,
    Switch, TextField, InputAdornment, Autocomplete
} from '@mui/material'
import PackCard from '../../Cards/PackCard/PackCard'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { useAppContext } from '../../../appProvider'


const receptions = require('../../../services/receptions')
const variesties = require('../../../services/varieties')
const types = require('../../../services/types')
const producerAccounts = require('../../../services/producerAccounts')

export default function ReceptionsGrid() {
    const { openSnack } = useAppContext()
    const [gridApiRef, setGridApiRef] = useState(null)
    const [receptionsList, setReceptionsList] = useState([])
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openPacksDialog, setOpenPacksDialog] = useState(false)
    const [rowData, setRowData] = useState(rowDataDefault())
    const [lockReceptionDialog, setLockReceptionDialog] = useState(false)

    const [varietyInput, setVarietyInput] = useState('')
    const [variestiesOptions, setVariestiesOptions] = useState([])
    const [typeInput, setTypeInput] = useState('')
    const [typesOptions, setTypesOptions] = useState([])


    useEffect(() => {
        receptions.findAll().then(res => {
            let data = res.map(reception => ({
                id: reception.id,
                producerName: reception.Producer.name,
                producerRut: reception.Producer.rut,
                producerId: reception.Producer.id,
                varietyName: reception.Variety.name,
                variety: reception.Variety,
                typeName: reception.Type.name,
                type: reception.Type,
                guide: reception.guide,
                clp: reception.clp,
                usd: reception.usd,
                change: reception.change,
                money: reception.money,
                traysQuanty: reception.trays_quanty,
                traysWeight: reception.trays_weight,
                impurityWeight: reception.impurity_weight,
                gross: reception.gross,
                net: reception.net,
                packs: reception.Packs,
                toPay: reception.to_pay,
                open: reception.open
            }))
            setReceptionsList(data)

        })

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
        }
        net = net - impurityWeight
        toPay = net * clp

        receptions.update(
            rowData.id,
            clp,
            usd,
            change,
            money,
            variety,
            type,
            toPay,
            impurityWeight,
            net).then(res => {
                gridApiRef.current.updateRows([{
                    id: rowData.rowId,
                    clp: clp,
                    usd: usd,
                    change: change,
                    money: money,
                    variety: variety,
                    varietyName: variety.name,
                    type: type,
                    typeName: type.name,
                    toPay: toPay,
                    impurityWeight: impurityWeight,
                    net: net
                }])
                setOpenEditDialog(false)
            })
            .catch(err => { console.log(err) })


        console.log(toPay)

    }

    const closeReception = async () => {
        const closeReception = await receptions.closeReception(rowData.id)
        const producerAccount = await producerAccounts.findAllByProducerId(rowData.producerId)
        let beforeBalance = 0

        if (producerAccount.length > 0) {
            beforeBalance = producerAccount.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.balance;
            }, 0);
        }

        let newBalance = beforeBalance + rowData.toPay

        const newCredit = await producerAccounts.create(
            rowData.producerId,
            rowData.toPay,
            0,
            newBalance,
            rowData.id,
            0,
            'Cierre de recepción' + rowData.id
        )

        console.log(newCredit)



        //await producerAccounts.create()


    }

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number', valueFormatter: (params) => params.value },
        { field: 'producerName', headerName: 'Productor', flex: 1 },
        { field: 'producerRut', headerName: 'Rut', flex: 1 },
        { field: 'varietyName', headerName: 'Variedad', flex: 1 },
        { field: 'typeName', headerName: 'Tipo', flex: 1, hide: true },
        { field: 'guide', headerName: 'Guía', flex: 1, hide: true },
        {
            field: 'clp', headerName: 'CLP', flex: 1, hide: false,
            valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
        },
        { field: 'usd', headerName: 'USD', flex: 1, hide: true },
        { field: 'change', headerName: 'Cambio', flex: 1, hide: true },
        { field: 'money', headerName: 'Moneda', flex: 1, hide: true },
        { field: 'traysQuanty', headerName: 'Cantidad de Bandejas', flex: 1 },
        {
            field: 'traysWeight', headerName: 'Bandejas', flex: 1,
            valueFormatter: (params) =>
                new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(params.value) + ' kg'
        },
        {
            field: 'gross', headerName: 'Bruto', flex: 1,
            valueFormatter: (params) =>
                new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(params.value) + ' kg'
        },
        {
            field: 'net', headerName: 'Neto', flex: 1,
            valueFormatter: (params) =>
                new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(params.value) + ' kg'
        },
        {
            field: 'toPay', headerName: 'A Pagar', flex: 1,
            valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
        },
        {
            field: 'actions',
            headerName: '',
            headerClassName: 'data-grid-last-column-header',
            type: 'actions', flex: 2, getActions: (params) => [
                <GridActionsCellItem
                    label='delete'
                    icon={<DeleteIcon />}
                    onClick={() => {

                    }}
                />,
                <GridActionsCellItem
                    label='edit'
                    icon={<EditIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            producerName: params.row.producerName,
                            producerRut: params.row.producerRut,
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
                            showUsd: false
                        })
                        console.log(rowData)
                        setOpenEditDialog(true)
                    }}
                />,
                <GridActionsCellItem
                    label='packs'
                    icon={<ViewQuiltIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            producerName: params.row.producerName,
                            producerRut: params.row.producerRut,
                            varietyName: params.row.varietyName,
                            typeName: params.row.typeName,
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
                            packs: params.row.packs
                        })
                        console.log(rowData)
                        setOpenPacksDialog(true)
                    }}
                />,
                <GridActionsCellItem
                    label='open'
                    icon={params.row.open ? <LockOpenIcon /> : <LockIcon />}
                    onClick={() => {
                        if (params.row.toPay > 0 && params.row.open) {
                            setRowData({
                                rowId: params.id,
                                id: params.row.id,
                                producerName: params.row.producerName,
                                producerRut: params.row.producerRut,
                                producerId: params.row.producerId,
                                open: params.row.open,
                                packs: params.row.packs,
                                toPay: params.row.toPay

                            })
                            setLockReceptionDialog(true)

                        } else {
                            if (params.row.open == false) {
                                openSnack('La recepción ya esta cerrada', 'error')
                            } else if (params.row.toPay == 0) {
                                openSnack('No se puede cerrar una recepción con monto A pagar 0', 'error')
                            }

                        }

                    }}
                />

            ]
        }
    ]
    return (
        <>
            <DataGrid title='Recepciones' rows={receptionsList} columns={columns} height='80vh' setGridApiRef={setGridApiRef} />

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
                                    label='CLP'
                                    value={rowData.clp}
                                    onChange={(e) => { setRowData({ ...rowData, clp: e.target.value }) }}
                                    variant="outlined"
                                    type='number'
                                    size={'small'}
                                    fullWidth
                                    className='no-spin'
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item sx={{ display: rowData.showUsd ? 'inline-block' : 'none' }}>
                                <TextField
                                    label='USD'
                                    value={rowData.usd}
                                    type='number'
                                    // calcPrice(receptionClp, e.target.value, receptionChange, receptionMoney)
                                    onChange={(e) => { calcPrice(rowData.clp, e.target.value, rowData.change) }}
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth

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
                                    getOptionLabel={(option) => option.name}
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
                                    getOptionLabel={(option) => option.name}
                                    disablePortal
                                    options={typesOptions}
                                    renderInput={(params) => <TextField {...params} label='Tipo' size={'small'} fullWidth />}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label='Kg Impurezas'
                                    value={rowData.impurityWeight}
                                    type='number'
                                    // calcPrice(receptionClp, e.target.value, receptionChange, receptionMoney)
                                    onChange={(e) => { setRowData({ ...rowData, impurityWeight: e.target.value }) }}
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
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button variant='contained' onClick={() => { closeReception() }}>Cerrar recepción</Button>
                    <Button variant='outlined' onClick={() => setLockReceptionDialog(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
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
    })
}