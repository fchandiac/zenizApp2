import { Grid, Autocomplete, TextField, Button, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent } from '@mui/material';
import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../appProvider'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import EditIcon from '@mui/icons-material/Edit'



const pallets = require('../../services/pallets')
const trays = require('../../services/trays')
const storages = require('../../services/storages')
const records = require('../../services/records')



export default function AddPackForm(props) {
    const { showImpurities, closeDialog } = props
    const { currentPallets, setCurrentPallets, addPack, user, openSnack, addPalletToCurrentPallets } = useAppContext()
    const [packTraysInput, setPackTraysInput] = useState('')
    const [packTraysOptions, setPackTraysOptions] = useState([{ id: 0, label: '', key: 0 }])
    const [packData, setPackData] = useState(packDataDefault())

    const [palletsInput, setPalletsInput] = useState('')
    const [palletsOptions, setPalletsOptions] = useState([{ id: 0, label: '', key: 0 }])

    const [storagesInput, setStoragesInput] = useState('')
    const [storagesOptions, setStoragesOptions] = useState([{ id: 0, key: 0, label: '' }])

    const [openNewPalletDialog, setOpenNewPalletDialog] = useState(false)
    const [openEditPalletDialog, setOpenEditPalletDialog] = useState(false)

    const [palletData, setPalletData] = useState(palletDataDefault())


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

        storages.findAll().then(res => {
            let data = res.map(item => ({
                id: item.id,
                key: item.id,
                label: item.name
            }))
            setStoragesOptions(data)
        })
    }, [])



    useEffect(() => {
        setPackData({ ...packData, pallet: { id: 0, label: '', key: 0 } })
        let filterData = currentPallets.filter(pallet => pallet.tray_id === packData.tray.id)
        filterData = filterData.filter(item => item.max - item.virtualTrays > 0)
        formatPalletsOptions(packData.tray.id, filterData)

    }, [packData.tray.id])


    const formatPalletsOptions = (tray_id, pallets) => {
        console.log('pallets', pallets)
        let data = pallets.filter(pallet => pallet.tray_id === tray_id)
   
        data = data.filter(item => item.dispatch == false)

        data = data.map(item => ({
            id: item.id,
            key: item.id,
            label: item.id + ' - max: ' + item.max + ' - capacidad: ' + item.virtualCapacity,
            trays: item.trays,
            max: item.max,
            virtualTrays: item.virtualTrays,
            virtualCapacity: item.virtualCapacity,

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

    const submit = async () => {
        // evitar sobrecarga de Palletss  
        const pallet = pallets.findOneById(packData.pallet.id)
        if (pallet.max - pallet.virtualTrays < packData.quanty) {
            openSnack('La cantidad de bandejas supera la capacidad del pallet', 'error')
            return
        } else {
            updateVirtualPallet(packData.pallet.id, packData.quanty)
            addPack(formatPack(packData))
            setPackData(packDataDefault())
            closeDialog()
        }

    }

    const editMax = async () => {
        await pallets.updateMax(palletData.id, palletData.max)
        openSnack('Capacidad máxima actualizada', 'success')

        let editCurrentPallet = currentPallets.find(pallet => pallet.id === palletData.id)
        editCurrentPallet.max = palletData.max
        editCurrentPallet.virtualCapacity = palletData.max - editCurrentPallet.virtualTrays
        setCurrentPallets(currentPallets.map(pallet => pallet.id === palletData.id ? editCurrentPallet : pallet))
        await records.create('Pallets', 'Edición', 'Capacidad máxima actualizada a ' + palletData.max, user.id)
        setOpenEditPalletDialog(false)

    }

    const createPallet = async () => {
        const newPallet = await pallets.create(
            packData.tray.id,
            palletData.storage.id,
            palletData.weight,
        )

        let newCurrentPallet = {
            id: newPallet.id,
            trays: newPallet.trays,
            max: newPallet.max,
            virtualTrays: newPallet.trays,
            tray_id: newPallet.tray_id,
            virtualCapacity: newPallet.max - newPallet.trays
        }

        addPalletToCurrentPallets(newCurrentPallet)
        openSnack('Nuevo pallet guardado', 'success')
        setPalletData(palletDataDefault())
        setOpenNewPalletDialog(false)
    }

    return (
        <>
            <form onSubmit={(e) => { e.preventDefault(); submit() }} >
                <Grid container direction={'column'} paddingTop={1} spacing={1}>
                    <Grid item>
                        <Autocomplete
                            inputValue={packTraysInput}
                            onInputChange={(e, newInputValue) => {
                                setPackTraysInput(newInputValue)
                            }}
                            isOptionEqualToValue={(option, value) => null || option.id === value.id}
                            value={packData.tray}
                            onChange={(e, newValue) => {
                                console.log('currentPallets', currentPallets)
                                if (newValue == null) {
                                    setPackData({ ...packData, tray: { id: 0, label: '', key: 0 } })
                                    return
                                } else {
                                    setPackData({ ...packData, tray: newValue })
                                }

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
                            sx={{ flex: '0 0 auto', marginRight: 1, display: user.Profile.id == 1001 ? 'flex' : 'none' }}
                            onClick={() => {
                                console.log(packData.tray)
                                if (packData.tray.id == 0) {
                                    openSnack('Seleccione una bandeja', 'error')
                                    return
                                }
                                setOpenNewPalletDialog(true)
                            }}>
                            <AddCircleIcon fontSize='inherit' />
                        </IconButton>
                        <IconButton
                            sx={{ flex: '0 0 auto', marginRight: 1, display: user.Profile.id == 1001 ? 'flex' : 'none' }}
                            onClick={() => {
                                if (packData.pallet.id == 0) {
                                    openSnack('Seleccione un pallet', 'error')
                                    return
                                }
                                setOpenEditPalletDialog(true)
                            }}>
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
                                console.log('newValue', newValue)
                                setPalletData({
                                    id: newValue.id,
                                    storage: { id: 0, key: 0, label: '' },
                                    tray: { id: 0, key: 0, label: '' },
                                    weight: '',
                                    max: newValue.max,
                                    virtualCapacity: newValue.virtualCapacity,
                                    virtualTrays: newValue.virtualTrays,
                                    trays: newValue.trays,
                                    label: newValue.label,
                                })
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
                <DialogTitle sx={{ p: 0, paddingLeft: 1, paddingTop: 1 }}>Nuevo pallet</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <form onSubmit={(e) => { e.preventDefault(); createPallet() }} >
                        <DialogContent sx={{ padding: 0 }}>
                            <Grid container direction={'column'} spacing={1} paddingTop={1}>
                                <Grid item >
                                    <Autocomplete
                                        inputValue={storagesInput}
                                        onInputChange={(e, newInputValue) => {
                                            setStoragesInput(newInputValue)
                                        }}

                                        value={palletData.storage}
                                        onChange={(e, newValue) => {
                                            setPalletData({ ...palletData, storage: newValue })
                                        }}
                                        getOptionLabel={(option) => option.label}
                                        disablePortal
                                        options={storagesOptions}
                                        renderInput={(params) => <TextField {...params} label='Almacén' size={'small'} required />}
                                    />
                                </Grid>
                                <Grid item >
                                    <TextField
                                        label='Peso'
                                        value={palletData.weight}
                                        onChange={(e) => { setPalletData({ ...palletData, weight: e.target.value }) }}
                                        variant="outlined"
                                        type='number'
                                        size={'small'}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">kg</InputAdornment>
                                        }}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item textAlign={'right'}>
                                    <Button variant="contained" type='submit' >guardar</Button>
                                    <Button sx={{ marginLeft: 1 }} variant={'outlined'} onClick={() => { setOpenNewPalletDialog(false) }}>Cerrar</Button>
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </form>

                </DialogContent>
            </Dialog>

            <Dialog open={openEditPalletDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Editar pallet</DialogTitle>

                <form onSubmit={(e) => { e.preventDefault(); editMax() }} >
                    <DialogContent sx={{ padding: 1 }}>
                        <Grid container direction={'column'} spacing={1} paddingTop={1}>
                            <Grid item >
                                <TextField
                                    label='Capacidad máxima'
                                    value={palletData.max}
                                    onChange={(e) => { setPalletData({ ...palletData, max: e.target.value }) }}
                                    variant="outlined"
                                    type='number'
                                    size={'small'}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">bandejas</InputAdornment>
                                    }}
                                    fullWidth
                                    required
                                    autoFocus
                                />
                            </Grid>
                            <Grid item textAlign={'right'}>
                                <Button variant="contained"
                                    type='submit'
                                >editar</Button>
                                <Button
                                    sx={{ marginLeft: 1 }}
                                    variant={'outlined'}
                                    onClick={() => { setOpenEditPalletDialog(false) }}
                                >Cerrar</Button>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </form>
            </Dialog>
        </>
    )
}

function packDataDefault() {
    return {
        tray: { id: 0, label: '', key: 0 },
        quanty: '',
        gross: '',
        impurity: '',
        pallet: { id: 0, label: '', key: 0 },
    }
}

function palletDataDefault() {
    return ({
        id: 0,
        storage: { id: 0, key: 0, label: '' },
        tray: { id: 0, key: 0, label: '' },
        weight: '',
        max: 0,
        virtualCapacity: 0,
        virtualTrays: 0,
        trays: 0,
        label: '',
    })
}