import React, { useState, useEffect } from 'react'
import {
    Paper, Typography, Table, TableContainer, Button, TableHead, TableRow, TableBody, TableCell, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Divider, Box, FormControl, InputLabel,
    Select, MenuItem, Autocomplete
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { useAppContext } from '../../appProvider'
import { tr } from 'date-fns/locale'


const trays = require('../../services/trays')

export default function ReturnedTrays() {
    const { returnetTrays, addReturnetTrays, removeReturnetTray, openSnack } = useAppContext()
    const [openReturnedTraysDialog, setOpenReturnedTraysDialog] = useState(false)
    const [traysInput, setTraysInput] = useState('')
    const [traysOptions, setTraysOptions] = useState([{ id: 0, label: '', key: 0 }])
    const [returnedTrayData, setReturnedTrayData] = useState(returnedTrayDataDefault())

    useEffect(() => {
        trays.findAll().then(res => {
            let data = res.map(item => ({
                id: item.id,
                key: item.id,
                label: item.name,
                weight: item.weight
            }))
            setTraysOptions(data)
        })
    }, [])

    const addReturnedTray = () => {
        if (returnedTrayData.tray == null) {
            openSnack('Seleccione una bandeja', 'error')
            return
        } else if (returnedTrayData.quanty === '') {
            openSnack('Ingrese una cantidad', 'error')
            return
        } else if (returnedTrayData.quanty <= 0) {
            openSnack('La cantidad debe ser mayor a 0', 'error')
            return
        } else if ( returnedTrayData.tray.id === 0) {
            openSnack('Seleccione una bandeja', 'error')
        }
        else {
            addReturnetTrays(returnedTrayData)
            setReturnedTrayData(returnedTrayDataDefault())
            setOpenReturnedTraysDialog(false)
        }

    }

    const removeReturnedTray = (id) => {
        removeReturnetTray(id)
    }



    const table = (movements) => (

        <Table  >
            <TableHead>
                <TableRow>
                    <TableCell align="right">Bandeja</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right"></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {movements.map((row) => (
                    <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 'none' } }}
                    >
                        <TableCell align="right">{row.tray.label}</TableCell>
                        <TableCell align="right">{row.quanty}</TableCell>
                        <TableCell align="right">{() => (
                            <Button variant='outlined' color='primary' onClick={() => { }}>Ver</Button>
                        )}</TableCell>

                    </TableRow>
                ))}
            </TableBody>
        </Table>

    )

    return (
        <>
            <Paper variant='outlined'>
                <Grid container spacing={1} direction={'column'}>
                    <Grid item xs={12}>
                        <Box sx={{
                            padding: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%'
                        }}>
                            <IconButton
                                sx={{ flex: '0 0 auto', marginLeft: 1 }}
                                onClick={() => { setOpenReturnedTraysDialog(true) }}>
                                <AddCircleIcon fontSize='inherit' />
                            </IconButton>
                            <Typography p={1}>
                                Bandejas devueltas
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} padding={1} height={'100%'}>
                        {table(returnetTrays)}
                    </Grid>
                </Grid>
            </Paper>

            <Dialog open={openReturnedTraysDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Devolver bandejas</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <Grid container spacing={1} direction={'column'}>
                        <Grid item marginTop={1}>
                            <TextField
                                fullWidth
                                label='Cantidad'
                                variant='outlined'
                                size='small'
                                type='number'
                                value={returnedTrayData.quanty}
                                onChange={(e) => { setReturnedTrayData({ ...returnedTrayData, quanty: e.target.value }) }}
                                required
                            />
                        </Grid>
                        <Grid item>
                            <Autocomplete
                                inputValue={traysInput}
                                onInputChange={(e, newInputValue) => {
                                    setTraysInput(newInputValue)
                                }}
                                isOptionEqualToValue={(option, value) => null || option.id === value.id}
                                value={returnedTrayData.tray}
                                onChange={(e, newValue) => {
                                    setReturnedTrayData({ ...returnedTrayData, tray: newValue })
                                }}
                                options={traysOptions}
                                renderInput={(params) => <TextField {...params} label='Bandeja' size={'small'} fullWidth required />}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button variant='contained' onClick={() => { addReturnedTray() }}>Agregar</Button>
                    <Button variant='outlined' onClick={() => { setOpenReturnedTraysDialog(false) }}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

function returnedTrayDataDefault() {
    return {
        tray: { id: 0, label: '', key: 0 },
        quanty: '',
    }
}