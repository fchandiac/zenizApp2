import { Grid, Autocomplete, TextField, Button, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent } from '@mui/material';
import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../appProvider'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import EditIcon from '@mui/icons-material/Edit'
import NewPalletForm from '../Forms/NewPalletForm/NewPalletForm'

const pallets = require('../../services/pallets')
const trays = require('../../services/trays')



export default function AddPackForm(props) {
    const { showImpurities, closeDialog } = props
    const { lock, currentPallets, setCurrentPallets, addPack } = useAppContext()
    const [packTraysInput, setPackTraysInput] = useState('')
    const [packTraysOptions, setPackTraysOptions] = useState([{id:0, label:'', key:0}])
    const [packData, setPackData] = useState(packDataDefault())

    const [palletsInput, setPalletsInput] = useState('')
    const [palletsOptions, setPalletsOptions] = useState([{id:0, label:'', key:0}])

    const [openNewPalletDialog, setOpenNewPalletDialog] = useState(false)

    useEffect(() => {
        trays.findAll().then(res => {
            let data = res.map(item => ({
                id: item.id,
                key: item.id,
                label: item.name,
                weight: item.weight
            }))
            setPackTraysOptions(data)
        })
    },[])

    useEffect(() => {
        let currentPalletsMatch = Boolean((currentPallets.filter(pallet => pallet.tray_id === packData.tray.id)).length)
        if (currentPalletsMatch == false) {
            pallets.findAllByTray(packData.tray.id)
                .then(res => {
                    let data = res.map((item) => ({
                        id: item.id,
                        trays: item.trays,
                        max: item.max,
                        virtualTrays: item.trays,
                        tray_id: item.tray_id,
                        virtualCapacity: item.max - item.trays
                    }))
                    data = data.filter(item => item.max - item.virtualTrays > 0)

                    let newCurrentPallets = [...currentPallets, ...data]
                    setCurrentPallets(newCurrentPallets)
                    formatPalletsOptions(packData.tray.id, newCurrentPallets)
                })
                .catch(err => { console.error(err) })
        } else {
            formatPalletsOptions(packData.tray.id, currentPallets)
        }

    }, [packData.tray.id])


    const formatPalletsOptions = (tray_id, pallets) => {
        let data = pallets.filter(pallet => pallet.tray_id === tray_id)
        data = data.map(item => ({
            id: item.id,
            key: item.id,
            label: item.id + ' - max: ' + item.max + ' - capacidad: ' + item.virtualCapacity,
            trays: item.trays,
            max: item.max,
            virtualTrays: item.virtualTrays,
            virtualCapacity: item.virtualCapacity
        }))
        setPalletsOptions(data)
    }

    const updateVirtualPallet = (pallet_id, quanty) => {
        let newCurrentPallets = currentPallets.map(pallet => {
            if (pallet.id === pallet_id) {
                pallet.virtualTrays = pallet.virtualTrays + parseInt(quanty)
                pallet.virtualCapacity = pallet.max - pallet.virtualTrays
            }
            return pallet
        })
        setCurrentPallets(newCurrentPallets)
    }

    const formatPack = (packData) => {
        packData.gross = parseFloat(packData.gross)
        packData.quanty = parseInt(packData.quanty)

        if (packData.impurity == '') {
            packData.impurity = 0
        } else {
            packData.impurity = parseFloat(packData.impurity)
        }
        packData.traysWeight = packData.tray.weight * packData.quanty
        let preNet = packData.gross - packData.traysWeight
        packData.impurityWeight = preNet * (packData.impurity / 100)
        packData.palletId = packData.pallet.id
        packData.trayName = packData.tray.label
        packData.trayWeight = packData.tray.weight
        packData.net = packData.gross - (packData.traysWeight + packData.impurityWeight)
        return packData
    }

    const submit = () => {
        updateVirtualPallet(packData.pallet.id, packData.quanty)
        addPack(formatPack(packData))
        setPackData(packDataDefault())
        closeDialog()
    }

    return (
        <>
            <form onSubmit={(e) => { e.preventDefault(); submit() }} >
                <Grid container direction={'column'} paddingTop={1}>
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
                            required
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
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>
                            }}
                            variant="outlined"
                            size={'small'}
                            fullWidth
                        />
                    </Grid>
                    <Grid item sx={{ display: 'flex' }}>
                        <IconButton
                            sx={{ flex: '0 0 auto', marginRight: 1, display: lock ? 'none' : 'flex' }}
                            onClick={() => { setOpenNewPalletDialog(true)}}>
                            <AddCircleIcon fontSize='inherit' />
                        </IconButton>
                        <IconButton
                            sx={{ flex: '0 0 auto', marginRight: 1, display: lock ? 'none' : 'flex' }}
                            onClick={() => { setOpenNewPalletDialog(true)}}>
                            <EditIcon fontSize='inherit' />
                        </IconButton>
                        <Autocomplete
                            sx={{ flex: '1' }}
                            inputValue={palletsInput}
                            onInputChange={(e, newInputValue) => {
                                setPalletsInput(newInputValue)
                            }}
                            isOptionEqualToValue={(option, value) => null || option.id === value.id}
                            value={packData.pallet}
                            onChange={(e, newValue) => {
                                setPackData({ ...packData, pallet: newValue })
                            }}
                            disablePortal
                            options={palletsOptions}
                            renderInput={(params) => <TextField {...params} label='Pallet' size={'small'} required />}
                        />
                    </Grid>
                    <Grid item textAlign={'right'}>
                        <Button variant="contained" type='submit'>Guardar</Button>
                        <Button
                            sx={{ marginLeft: 1 }}
                            variant={'outlined'}
                            onClick={() => { closeDialog() }}
                        >Cerrar</Button>
                    </Grid>
                </Grid>
            </form>

            <Dialog open={openNewPalletDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Nuevo Pallet</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <NewPalletForm dialog={true} closeDialog={() => {setOpenNewPalletDialog(false)}} afterSubmit />
                </DialogContent>
            </Dialog>
        </>
    )
}

function packDataDefault() {
    return {
        tray: {id:0, label:'', key:0},
        quanty: '',
        gross: '',
        impurity: '',
        pallet: {id:0, label:'', key:0},
    }
}