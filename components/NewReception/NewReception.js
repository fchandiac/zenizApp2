import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, Switch, TextField } from '@mui/material'
import React, { useState, useEffect } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { useAppContext } from '../../appProvider'
import MoneyTextField from '../Karmextron/MoneyTextField/MoneyTextField'
import NewProducerForm from '../Forms/NewProducerForm/NewProducerForm'
const utils = require('../../utils')


export default function NewReception() {
    const { reception, setReception } = useAppContext()

    const [receptionData, setReceptionData] = useState(reception)
    const [packData, setPackData] = useState(packDataDefault())

    const [producersInput, setProducersInput] = useState('')
    const [producersOptions, setProducersOptions] = useState(producersOptionsData)

    const [varietiesInput, setVarietiesInput] = useState('')
    const [varietiesOptions, setVarietiesOptions] = useState(varietiesOptionsData)

    const [typesInput, setTypesInput] = useState('')
    const [typesOptions, setTypesOptions] = useState(typesOptionsData)

    const [packTraysInput, setPackTraysInput] = useState('')
    const [packTraysOptions, setPackTraysOptions] = useState(traysOptionsData)

    const [showPrices, setShowPrices] = useState(false)
    const [showUsd, setShowUsd] = useState(false)
    const [showImpurities, setShowImpurities] = useState(false)
    const [openAddPackDialog, setOpenAddPackDialog] = useState(false)
    const [openNewProducerDialog, setOpenNewProducerDialog] = useState(false)


    useEffect(() => {
        setReception(receptionData)

    }, [receptionData])

    // useEffect(() => {
    //     if (showPrices && receptionData.money == 'USD') {
    //         setShowUsd(true)
    //     } else {
    //         setShowUsd(false)
    //     }

    // }, [showPrices])


    const calcPrice = (clp, usd, change, money) => {
        let result
        if (money == 1) {
            result = usd * change
        } else {
            result = clp
        }
        setReceptionData({ ...receptionData, clp: result, usd: usd, change: change })
    }



    const addPack = () => {
        let packs = receptionData.packs
        packs.push(packData)
        setReceptionData({ ...receptionData, packs: packs })
        setPackData(packDataDefault())
        setOpenAddPackDialog(false)
    }

    const previewReception = () => {
        console.log('ReceptionData', receptionData)
    }

    return (
        <>
            <form onSubmit={(e) => { e.preventDefault(); previewReception() }}>
                <Grid container spacing={1}>
                    <Grid item sx={{ display: 'flex' }} xs={8}>
                        <Autocomplete
                            sx={{ flex: '1' }}
                            inputValue={producersInput}
                            onInputChange={(e, newInputValue) => {
                                setProducersInput(newInputValue)
                            }}
                            isOptionEqualToValue={(option, value) => null || option.id === value.id}
                            value={receptionData.producer}
                            onChange={(e, newValue) => {

                                setReceptionData({ ...receptionData, producer: newValue })
                            }}
                            disablePortal
                            options={producersOptions}
                            renderInput={(params) => <TextField {...params} label='Productor' size={'small'} fullWidth required />}
                        />


                        <IconButton
                            sx={{ flex: '0 0 auto', marginLeft: 1 }}
                            onClick={() => { setOpenNewProducerDialog(true) }}>
                            <AddCircleIcon fontSize='inherit' />
                        </IconButton>

                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            label='Rut'
                            value={utils.formatRut(receptionData.producer.rut)}
                            inputProps={{ readOnly: true }}
                            variant="outlined"
                            size={'small'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            label='Guía'
                            value={receptionData.guide}
                            onChange={(e) => { setReceptionData({ ...receptionData, guide: e.target.value }) }}
                            variant="outlined"
                            size={'small'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <Autocomplete
                            inputValue={varietiesInput}
                            onInputChange={(e, newInputValue) => {
                                setVarietiesInput(newInputValue)
                            }}
                            isOptionEqualToValue={(option, value) => null || option.id === value.id}
                            value={receptionData.variety}
                            onChange={(e, newValue) => {
                                setReceptionData({ ...receptionData, variety: newValue })
                            }}
                            disablePortal
                            options={varietiesOptions}
                            renderInput={(params) => <TextField {...params} label='Variedad' size={'small'} fullWidth required />}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <Autocomplete
                            inputValue={typesInput}
                            onInputChange={(e, newInputValue) => {
                                setTypesInput(newInputValue)
                            }}
                            isOptionEqualToValue={(option, value) => null || option.id === value.id}
                            value={receptionData.type}
                            onChange={(e, newValue) => {
                                setReceptionData({ ...receptionData, type: newValue })
                            }}
                            disablePortal
                            options={typesOptions}
                            renderInput={(params) => <TextField {...params} label='Tipo' size={'small'} fullWidth required />}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <FormControlLabel
                            control={<Switch checked={showPrices} onChange={() => { setShowPrices(!showPrices) }} />}
                            label='Precios'
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <FormControlLabel
                            control={<Switch checked={showImpurities} onChange={() => { setShowImpurities(!showImpurities) }} />}
                            label='impurezas'
                        />
                    </Grid>
                    <Grid item >
                        <Grid container sx={{ display: showPrices ? 'inline-block' : 'none' }}>
                            <Grid item>
                                <FormControlLabel
                                    control={<Switch checked={showUsd} onChange={() => { setShowUsd(!showUsd) }} />}
                                    label='Precio en dolares'
                                />
                            </Grid>

                            <Grid item  sx={{display:'inline-block'}} >
                                <MoneyTextField
                                    label='CLP'
                                    value={receptionData.clp}
                                    onclick={(e) => { setReceptionData({ ...receptionData, clp: e.target.value }) }}
                                    required={showPrices}
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ display: showUsd ? 'inline-block' : 'none' }}>
                                <TextField
                                    label='USD'
                                    value={receptionData.usd}
                                    type='number'
                                    onChange={(e) => { calcPrice(receptionData.clp, e.target.value, receptionData.change, receptionData.money) }}
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth
                                    
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ display: showUsd ? 'inline-block' : 'none' }}>
                                <TextField
                                    label='Cambio'
                                    value={receptionData.change}
                                    type='number'
                                    onChange={(e) => { calcPrice(receptionData.clp, receptionData.usd, e.target.value, receptionData.money) }}
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth
                                   
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item textAlign={'right'} xs={12}>
                        <Button variant={'contained'} type='submit'>Resumen</Button>
                    </Grid>
                    <Grid item textAlign={'right'}>
                        <IconButton onClick={() => { setOpenAddPackDialog(true) }}>
                            <AddCircleIcon fontSize='large' />
                        </IconButton>
                        Packs
                    </Grid>


                </Grid>
            </form>
            <Dialog open={openAddPackDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Agregar Pack</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <form onSubmit={(e) => { e.preventDefault(); addPack() }}>
                        <Grid container direction={'column'}>
                            <Grid item>
                                <Autocomplete
                                    inputValue={packTraysInput}
                                    onInputChange={(e, newInputValue) => {
                                        setPackTraysInput(newInputValue)
                                    }}
                                    isOptionEqualToValue={(option, value) => null || option.id === value.id}
                                    value={packData.tray}
                                    onChange={(e, newValue) => {
                                        setPackData({ ...packData, tray: newValue })
                                    }}
                                    disablePortal
                                    options={packTraysOptions}
                                    renderInput={(params) => <TextField {...params} label='Bandeja' size={'small'} fullWidth required />}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label='Cantidad'
                                    value={packData.quanty}
                                    onChange={(e) => { setPackData({ ...packData, quanty: e.target.value }) }}
                                    type='number'
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label='Kg Bruto'
                                    value={packData.gross}
                                    onChange={(e) => { setPackData({ ...packData, gross: e.target.value }) }}
                                    type='number'
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item sx={{ display: showImpurities ? 'block' : 'none' }}>
                                <TextField
                                    label='Impurezas'
                                    value={packData.impurity}
                                    onChange={(e) => { setPackData({ ...packData, impurity: e.target.value }) }}
                                    type='number'
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item textAlign={'right'}>
                                <Button variant={'contained'} type='submit'>Resumen</Button>
                                <Button
                                    sx={{ marginLeft: 1 }}
                                    variant={'outlined'}
                                    onClick={() => { setOpenAddPackDialog(false) }}
                                >Cerrar</Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={openNewProducerDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Nuevo productor</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <NewProducerForm
                        dialog={true}
                        closeDialog={() => { setOpenNewProducerDialog(false) }}
                        afterSubmit={() => { }}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

function receptionDataDefault() {
    return {
        producer: { id: 1001, label: 'Productor 1', key: 1001, rut: '123456789' },
        variety: '',
        type: '',
        clp: '',
        usd: '',
        change: '',
        money: 'CLP',
        packs: []
    }
}

function packDataDefault() {
    return {
        tray: '',
        quanty: '',
        gross: '',
        impurity: ''
    }
}

const producersOptionsData = [
    { id: 1001, label: 'Productor 1', key: 1001, rut: '123456789' },
    { id: 1002, label: 'Productor 2', key: 1002, rut: '123456778' },
    { id: 1003, label: 'Productor 3', key: 1003, rut: '123456767' },
    { id: 1004, label: 'Productor 4', key: 1004, rut: '123456756' }
]

const varietiesOptionsData = [
    { id: 1001, label: 'Arandano', key: 1001 },
    { id: 1002, label: 'Franbueza', key: 1002 },
    { id: 1003, label: 'Esparrago', key: 1003 },
]

const typesOptionsData = [
    { id: 1001, label: 'Convencional', key: 1001 },
    { id: 1002, label: 'Organico', key: 1002 },
    { id: 1003, label: 'Fair Trade', key: 1003 },
]

const moneyOptionsData = [
    { id: 0, label: 'CLP', key: 0 },
    { id: 1, label: 'USD', key: 1 },
]

const traysOptionsData = [
    { id: 1001, label: 'Bndj Negra', key: 1001 },
    { id: 1002, label: 'Bndj Blanca', key: 1002 },
    { id: 1003, label: 'Bndj Roja', key: 1003 },
]


