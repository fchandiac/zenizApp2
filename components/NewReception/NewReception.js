import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, Switch, TextField } from '@mui/material'
import React, { useState, useEffect } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { useAppContext } from '../../appProvider'
import MoneyTextField from '../Karmextron/MoneyTextField/MoneyTextField'
import NewProducerForm from '../Forms/NewProducerForm/NewProducerForm'
import AddPackForm from './AddPackForm'
import PacksGrid from './PacksGrid'
const utils = require('../../utils')

const producers = require('../../services/producers')
const receptions = require('../../services/receptions')
const packs = require('../../services/packs')
const pallets = require('../../services/pallets')




export default function NewReception() {
    const { reception, setReception, setMoney, resetReception } = useAppContext()

    const [receptionData, setReceptionData] = useState(reception)


    const [producersInput, setProducersInput] = useState('')
    const [producersOptions, setProducersOptions] = useState([])

    const [varietiesInput, setVarietiesInput] = useState('')
    const [varietiesOptions, setVarietiesOptions] = useState(varietiesOptionsData)

    const [typesInput, setTypesInput] = useState('')
    const [typesOptions, setTypesOptions] = useState(typesOptionsData)


    const [packTraysOptions, setPackTraysOptions] = useState(traysOptionsData)

    const [showPrices, setShowPrices] = useState(false)
    const [showUsd, setShowUsd] = useState(false)
    const [showImpurities, setShowImpurities] = useState(false)
    const [openAddPackDialog, setOpenAddPackDialog] = useState(false)
    const [openNewProducerDialog, setOpenNewProducerDialog] = useState(false)

    useEffect(() => {
        producers.findAll()
            .then(res => {
                let data = res.map((item) => ({
                    id: item.id,
                    key: item.id,
                    rut: item.rut,
                    label: item.name
                }))
                setProducersOptions(data)

            })
            .catch(err => { console.error(err) })
    }, [])


    useEffect(() => {
        let clp = parseInt(receptionData.clp)
        let usd = parseFloat(receptionData.usd)
        let change = parseInt(receptionData.change)

        const sumNet = reception.packs.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.net;
        }, 0)

        const sumTraysQuanty = reception.packs.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.quanty
        }, 0)

        const sumTraysWeight = reception.packs.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.traysWeight
        }, 0)

        const sumGross = reception.packs.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.gross
        }, 0)

        let data = {
            producer: receptionData.producer,
            variety: receptionData.variety,
            type: receptionData.type,
            guide: receptionData.guide,
            clp: clp,
            usd: usd,
            change: change,
            money: reception.money,
            traysQuanty: sumTraysQuanty,
            traysWeight: sumTraysWeight,
            gross: sumGross,
            net: sumNet,
            toPay: clp * sumNet,

            // Pasar a estado Global showPrices: false, 
            // pasar a estado Global showImpurities: false 
        }
        setReception(data)
    }, [receptionData, reception.packs])


    const calcPrice = (clp, usd, change, money) => {
        let result
        console.log('money', money)
        if (money == 'USD') {
            result = usd * change
        } else {
            result = clp
        }
        console.log('result', result)
        setReceptionData({ ...receptionData, clp: result, usd: usd, change: change })
    }

    const saveReception = () => {
        console.log('Reception', reception)
        receptions.create(
            reception.producer.id,
            reception.variety.id,
            reception.type.id,
            reception.guide,
            reception.clp,
            reception.usd,
            reception.change,
            reception.money,
            reception.traysQuanty,
            reception.traysWeight,
            reception.gross,
            reception.net,
            reception.toPay,
        )
            .then(res => {
                console.log(res)
                let packsPromises = []
                reception.packs.forEach(pack => {
                    packsPromises.push(
                        packs.create(
                            pack.pallet.id,
                            pack.tray.id,
                            res.id, //reception id
                            pack.quanty,
                            pack.traysWeight,
                            pack.impurity,
                            pack.impurityWeight,
                            pack.gross,
                            pack.net,
                        )
                    )})

                    //console.log('packsPromises', packsPromises)
                Promise.all(packsPromises)
                    .then(res => { 
                        let palletsPromises = []
                        reception.packs.map(pack => {
                            palletsPromises.push(
                                pallets.updateTrays(
                                    pack.palletId,
                                    pack.quanty
                                )
                            )
                            Promise.all(palletsPromises)
                            .then(res => {
                                console.log(res)
                                resetReception()
                            })
                            .catch(err => {console.error(err)})
                        })
                        console.log(res) 

                    })
                    .catch(err => { console.error(err) })
            })
            .catch(err => { console.error(err) })


    }

    return (
        <>
            <form onSubmit={(e) => { e.preventDefault(); saveReception() }}>
                <Grid container spacing={1}>
                    <Grid item sx={{ display: 'flex' }} xs={8}>
                        <IconButton
                            sx={{ flex: '0 0 auto', marginLeft: 1 }}
                            onClick={() => { setOpenNewProducerDialog(true) }}>
                            <AddCircleIcon fontSize='inherit' />
                        </IconButton>
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
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            label='Rut'
                            value={receptionData.producer.rut}
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
                    <Grid item xs={4}>
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
                    <Grid item xs={4}>
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
                    <Grid item xs={2}>
                        <FormControlLabel
                            control={<Switch checked={showPrices} onChange={() => { setShowPrices(!showPrices) }} />}
                            label='Precios'
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <FormControlLabel
                            control={<Switch checked={showImpurities} onChange={() => { setShowImpurities(!showImpurities) }} />}
                            label='impurezas'
                        />
                    </Grid>
                    <Grid item >
                        <Grid container sx={{ display: showPrices ? 'inline-block' : 'none' }}>
                            <Grid item>
                                <FormControlLabel
                                    control={<Switch checked={showUsd} onChange={() => {
                                        setShowUsd(!showUsd)
                                        setMoney(showUsd ? 'CLP' : 'USD')
                                    }} />}
                                    label='Precio en dolares'
                                />
                            </Grid>

                            <Grid item sx={{ display: 'inline-block' }} >
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
                                    onChange={(e) => { calcPrice(receptionData.clp, e.target.value, receptionData.change, reception.money) }}
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
                        <Button variant={'contained'} type='submit'>guardar</Button>
                    </Grid>
                    <Grid item textAlign={'right'}>
                        <IconButton onClick={() => { setOpenAddPackDialog(true) }}>
                            <AddCircleIcon fontSize='large' />
                        </IconButton>
                        Packs
                    </Grid>


                </Grid>
            </form>

            <PacksGrid packsList={[{ text: 'yuyu' }, { text: 'yuyu' }]} />

            <Dialog open={openAddPackDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Agregar Pack</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <AddPackForm
                        showImpurities={showImpurities}
                        packTraysOptions={packTraysOptions}
                        closeDialog={() => { setOpenAddPackDialog(false) }} />
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
        showPrices: false,
        showImpurities: false,
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
    { id: 1001, label: 'Bndj Negra', key: 1001, weight: .4 },
    { id: 1002, label: 'Bndj Blanca', key: 1002, weight: .3 },
    { id: 1003, label: 'Bndj Roja', key: 1003, weight: .5 },
]

//**** CREATE FULL RECEPTION ****//

function createFullReception(reception) {

    receptions.create(
        reception.producer.id,
        reception.variety.id,
        reception.type.id,
        reception.guide,
        reception.clp,
        reception.usd,
        reception.change,
        reception.money,
        reception.traysQuanty,
        reception.traysWeight,
        reception.gross,
        reception.net,
        reception.toPay,
    )
        .then(res => {
            console.log(res)
            packsPromises = []
            reception.packs.forEach(pack => {
                packsPromises.push(
                    packs.create(
                        pack.pallet.id,
                        pack.tray.id,
                        res.id, //reception id
                        pack.quantity,
                        pack.traysWeight,
                        pack.impurity,
                        pack.impurityWeight,
                        pack.gross,
                        pack.net,
                    )
                )})
            Promise.all(packsPromises)
                .then(res => { console.log(res) })
                .catch(err => { console.error(err) })
        })
        .catch(err => { console.error(err) })

}


