import {
    Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid,
    IconButton, Switch, TextField, InputAdornment, Paper, Typography
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { useAppContext } from '../../appProvider'
import MoneyTextField from '../Karmextron/MoneyTextField/MoneyTextField'
import NewProducerForm from '../Forms/NewProducerForm/NewProducerForm'
import AddPackForm from './AddPackForm'
import PacksGrid from './PacksGrid'
import PrintDialog from '../PrintDialog/PrintDialog'
import ReceptionToPrint from './ReceptionToPrint'
const utils = require('../../utils')

const producers = require('../../services/producers')
const receptions = require('../../services/receptions')
const packs = require('../../services/packs')
const pallets = require('../../services/pallets')
const types = require('../../services/types')
const variesties = require('../../services/varieties')




export default function NewReception() {
    const {
        openSnack,
        reception,
        setReception,
        resetReception,
        receptionShowPrices,
        receptionShowImpurities,
        receptionShowUsd,
        receptionMoney,
        receptionProducer,
        receptionGuide,
        receptionVariety,
        receptionType,
        receptionClp,
        receptionUsd,
        receptionChange,
        receptionToPay,
        receptionInpuruityWeight,
        setReceptionShowPrices,
        setReceptionShowImpurities,
        setReceptionShowUsd,
        setReceptionProducer,
        setReceptionGuide,
        setReceptionVariety,
        setReceptionType,
        setReceptionClp,
        setReceptionUsd,
        setReceptionChange,
        setReceptionToPay,
        setReceptionTraysQuanty,
        setReceptionTraysWeight,
        setReceptionGross,
        setReceptionNet,
        setReceptionImpurityWeight
    } = useAppContext()


    const [producersInput, setProducersInput] = useState('')
    const [producersOptions, setProducersOptions] = useState([])

    const [varietiesInput, setVarietiesInput] = useState('')
    const [varietiesOptions, setVarietiesOptions] = useState([])

    const [typesInput, setTypesInput] = useState('')
    const [typesOptions, setTypesOptions] = useState([])

    const [openAddPackDialog, setOpenAddPackDialog] = useState(false)
    const [openNewProducerDialog, setOpenNewProducerDialog] = useState(false)

    const [openPrintDialog, setOpenPrintDialog] = useState(false)

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

        variesties.findAll()
            .then(res => {
                let data = res.map((item) => ({
                    id: item.id,
                    key: item.id,
                    label: item.name,
                    clp: item.clp,
                    usd: item.usd,
                    money: item.money,
                }))
                setVarietiesOptions(data)
            })

        types.findAll()
            .then(res => {
                let data = res.map((item) => ({
                    id: item.id,
                    key: item.id,
                    label: item.name
                }))
                setTypesOptions(data)
            })
    }, [])

    useEffect(() => { // setPacks
        let clp = parseInt(receptionClp)
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

        const sumImpurityWeight = reception.packs.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.impurityWeight
        }, 0)

        if (reception.packs.length == 0) {
            setReceptionTraysQuanty(0)
            setReceptionTraysWeight(0)
            setReceptionGross(0)
            setReceptionNet(0)
            setReceptionToPay(0)
            setReceptionImpurityWeight(0)

        } else {
            setReceptionTraysQuanty(sumTraysQuanty)
            setReceptionTraysWeight(sumTraysWeight)
            setReceptionGross(sumGross)
            setReceptionNet(sumNet)
            let toPay = clp * sumNet
            setReceptionToPay(toPay)
            setReceptionImpurityWeight(sumImpurityWeight)
        }

    }, [reception.packs])


    const calcPrice = (clp, usd, change) => {
        let result = 0

        if (usd) {
            result = usd * change
        } else {
            result = clp
        }
        console.log('result', result)

        setReceptionClp(result)
        setReceptionUsd(usd)
        setReceptionChange(change)
        setReceptionToPay(result * reception.net)

    }

    const previewReception = () => {
        console.log('Reception', reception)
    }

    const saveReception = async () => {

        console.log('Reception', reception)
        if (reception.packs.length == 0) {
            openSnack('No hay packs cargados a la rcepción', 'error')
        } else {
            try {
                const newReception_ = await receptions.create(
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
                    reception.impurityWeight,
                    reception.toPay,
                )

                reception.packs.forEach(async (pack) => {
                    const newPack = await packs.create(
                        pack.pallet.id,
                        pack.tray.id,
                        newReception_.id, //reception id
                        pack.quanty,
                        pack.traysWeight,
                        pack.impurity,
                        pack.impurityWeight,
                        pack.gross,
                        pack.net,
                    )
                })

                reception.packs.forEach(async (pack) => {
                    const updatePallet = await pallets.updateTrays(pack.pallet.id, pack.quanty)
                    resetReception()
                })

                openSnack('Recepción guardada', 'success')
                setOpenPrintDialog(true)
                resetReception()



                console.log('Reception', newReception_)
            } catch (err) {
                console.error(err)
            }
        }

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
                            value={receptionProducer}
                            onChange={(e, newValue) => {

                                setReceptionProducer(newValue)
                            }}
                            getOptionLabel={(option) => option.label}
                            options={producersOptions}
                            renderInput={(params) => <TextField {...params} label='Productor' size={'small'} fullWidth required />}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            label='Rut'
                            value={receptionProducer == null ? '' : receptionProducer.rut}
                            inputProps={{ readOnly: true }}
                            variant="outlined"
                            size={'small'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            label='Guía'
                            value={receptionGuide}
                            onChange={(e) => { setReceptionGuide(e.target.value) }}
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
                            value={receptionVariety}
                            onChange={(e, newValue) => {
                                setReceptionVariety(newValue)
                                if (receptionShowPrices) {
                                    if (newValue.money == 'CLP') {
                                        setReceptionShowUsd(false)
                                        calcPrice(newValue.clp, 0, 0)
                                    } else if (newValue.money == 'USD') {
                                        setReceptionShowUsd(true)
                                        calcPrice(0, newValue.usd, 0)
                                    }
                                    console.log('VarietyOnChange', newValue)
                                }
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
                            value={receptionType}
                            onChange={(e, newValue) => {
                                setReceptionType(newValue)
                            }}
                            disablePortal
                            options={typesOptions}
                            renderInput={(params) => <TextField {...params} label='Tipo' size={'small'} fullWidth required />}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <FormControlLabel
                            control={<Switch checked={receptionShowPrices} onChange={() => {
                                setReceptionShowPrices(!receptionShowPrices)
                                if (!receptionShowPrices == false) {
                                    calcPrice(0, 0, 0)
                                }
                            }
                            } />}
                            label='Precios'
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <FormControlLabel
                            control={<Switch checked={receptionShowImpurities} onChange={() => { setReceptionShowImpurities(!receptionShowImpurities) }} />}
                            label='impurezas'
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container sx={{ display: receptionShowPrices ? 'inline-block' : 'none' }}>
                            <Grid item>
                                <FormControlLabel
                                    control={<Switch checked={receptionShowUsd} onChange={() => {
                                        setReceptionShowUsd(!receptionShowUsd)
                                    }} />}
                                    label='Precio en dolares'
                                />
                            </Grid>

                            <Grid item sx={{ display: 'inline-block' }} xs={4} >
                                {/* <MoneyTextField
                                    label='CLP'
                                    value={receptionClp}
                                    onChange={(e) => { setReceptionClp(utils.moneyToInt(e.target.value)) }}

                                /> */}
                                <TextField
                                    label='CLP'
                                    value={receptionClp}
                                    // onChange={(e) => { setReceptionClp(utils.moneyToInt(e.target.value)) }}
                                    onChange={(e) => { calcPrice(e.target.value, receptionUsd, receptionChange) }}
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
                            <Grid item xs={4} sx={{ display: receptionShowUsd ? 'inline-block' : 'none' }}>
                                <TextField
                                    label='USD'
                                    value={receptionUsd}
                                    type='number'
                                    // calcPrice(receptionClp, e.target.value, receptionChange, receptionMoney)
                                    onChange={(e) => { calcPrice(receptionClp, e.target.value, receptionChange) }}
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth

                                />
                            </Grid>
                            <Grid item xs={4} sx={{ display: receptionShowUsd ? 'inline-block' : 'none' }}>
                                <TextField
                                    label='Cambio'
                                    value={receptionChange}
                                    type='number'
                                    // calcPrice(receptionClp, receptionUsd, e.target.value, receptionMoney)
                                    onChange={(e) => { calcPrice(receptionClp, receptionUsd, e.target.value) }}
                                    variant="outlined"
                                    size={'small'}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <IconButton onClick={() => { setOpenAddPackDialog(true) }}>
                            <AddCircleIcon fontSize='large' />
                        </IconButton>
                        Packs
                    </Grid>
                    <Grid item textAlign={'right'} xs={12}>
                        <PacksGrid />
                    </Grid>

                    <Grid item xs={8}>
                        <Paper variant='outlined'>
                            <Typography p={1}>
                                Bandejas devueltas
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper variant='outlined'>
                            <Typography p={1}>
                                Resumen recepción
                            </Typography>
                            <Grid container spacing={1} p={1}>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Bandejas'
                                        value={reception.traysQuanty}
                                        inputProps={{ readOnly: true }}
                                        variant="outlined"
                                        size={'small'}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">unidades</InputAdornment>,
                                        }}
                                        fullWidth
                                    />

                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Bandejas'
                                        value={reception.traysWeight}
                                        inputProps={{ readOnly: true }}
                                        variant="outlined"
                                        size={'small'}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Bruto'
                                        value={reception.gross}
                                        inputProps={{ readOnly: true }}
                                        variant="outlined"
                                        size={'small'}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Neto'
                                        value={reception.net}
                                        inputProps={{ readOnly: true }}
                                        variant="outlined"
                                        size={'small'}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6} sx={{display: receptionShowImpurities ? 'inline-block' : 'none'}}>
                                    <TextField
                                        
                                        label='impurezas'
                                        value={reception.impurityWeight}
                                        inputProps={{ readOnly: true }}
                                        variant="outlined"
                                        size={'small'}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
                                
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6} sx={{display: receptionShowPrices ? 'inline-block' : 'none'}}>
                                    <TextField
                                        
                                        label='A pagar'
                                        value={reception.toPay}
                                        inputProps={{ readOnly: true }}
                                        variant="outlined"
                                        size={'small'}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} textAlign={'right'}>
                                    <Button variant={'contained'} type='submit'>guardar</Button>

                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>

            </form>

            <Dialog open={openAddPackDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Agregar Pack</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <AddPackForm
                        showImpurities={receptionShowImpurities}
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
            <PrintDialog 
            open={openPrintDialog} 
            setOpen={setOpenPrintDialog} 
            title='Recepción' 
            width={'8cm'}
            content={ReceptionToPrint({reception: reception})} 
            />
        </>
    )
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
                )
            })
            Promise.all(packsPromises)
                .then(res => { console.log(res) })
                .catch(err => { console.error(err) })
        })
        .catch(err => { console.error(err) })

}


