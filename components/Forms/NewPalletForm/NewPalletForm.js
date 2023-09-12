import { Button, Grid, TextField, Autocomplete } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../appProvider'
import { set } from 'date-fns'

const utils = require('../../../utils')
const storages = require('../../../services/storages')
const trays = require('../../../services/trays')
const pallets = require('../../../services/pallets')

export default function NewPalletForm(props) {
    const { dialog, closeDialog, afterSubmit, palletData, setPalletData } = props
    const { openSnack } = useAppContext()
    const [storagesInput, setStoragesInput] = useState('')
    const [storagesOptions, setStoragesOptions] = useState([{ id: 0, key: 0, label: '' }])
    const [traysInput, setTraysInput] = useState('')
    const [traysOptions, setTraysOptions] = useState([])

    useEffect(() => {
        storages.findAll().then(res => {
            let data = res.map(item => ({
                id: item.id,
                key: item.id,
                label: item.name
            }))
            setStoragesOptions(data)
        })

        trays.findAll().then(res => {
            let data = res.map(item => ({
                id: item.id,
                key: item.id,
                label: item.name
            }))
            setTraysOptions(data)
        })
    }, [])

    const savePallet = async () => {
        openSnack('Nuevo pallet guardado', 'success')
        const newPallet = await pallets.create(
            palletData.tray.id,
            palletData.storage.id,
            palletData.weight,
        )

        console.log('newPallet', newPallet)
        
        if(dialog != false){
            closeDialog()
        }
        afterSubmit()
   
    }
    return (
        <>
            <form onSubmit={(e) => { e.preventDefault(); savePallet() }} >
                <Grid container direction={'column'}>
                    <Grid item>
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
                    <Grid item>
                    <Autocomplete
                            inputValue={traysInput}
                            onInputChange={(e, newInputValue) => {
                                setTraysInput(newInputValue)
                            }}
                            isOptionEqualToValue={(option, value) => null || option.id === value.id}
                            value={palletData.tray}
                            onChange={(e, newValue) => {
                                setPalletData({ ...palletData, tray: newValue })
                            }}
                            getOptionLabel={(option) => option.label}
                            disablePortal
                            options={traysOptions}
                            renderInput={(params) => <TextField {...params} label='bandeja' size={'small'} required />}
                        />

                    </Grid>
                    <Grid item>
                        <TextField
                            label='Peso'
                            value={palletData.weight}
                            onChange={(e) => { setPalletData({ ...palletData, weight: e.target.value }) }}
                            variant="outlined"
                            size={'small'}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item textAlign={'right'}>
                        <Button variant="contained" type='submit'>Guardar</Button>
                        <Button
                            sx={{ marginLeft: 1, display: dialog ? 'inline-block' : 'none' }}
                            variant={'outlined'}
                            onClick={() => { closeDialog() }}
                        >Cerrar</Button>
                    </Grid>
                </Grid>
            </form>
        </>
    )
}

function palletDataDefault() {
    return ({
        storage: { id: 0, key: 0, label: '' },
        tray: { id: 0, key: 0, label: '' },
        weight: ''
    })
}