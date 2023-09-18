import React, { useState, useEffect } from 'react'
import {
    Paper, Typography, Table, TableContainer, Button, TableHead, TableRow, TableBody, TableCell, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Divider, Box, FormControl, InputLabel,
    Select, MenuItem, Autocomplete, TableFooter
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
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
        } else if (returnedTrayData.tray.id === 0) {
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
        <TableContainer >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{margin:0, padding:0, paddingLeft:1}}>Bandeja</TableCell>
                        <TableCell sx={{margin:0, padding:0, paddingLeft:1}}>Cantidad</TableCell>
                        <TableCell sx={{margin:0, padding:0, paddingLeft:1}}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {movements.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 'none' } }}
                        >
                            <TableCell sx={{margin:0, padding:0, paddingLeft:1, fontSize:'.75rem'}} >{row.tray.label}</TableCell>
                            <TableCell sx={{margin:0, padding:0, paddingLeft:1, fontSize:'.75rem'}} >{row.quanty}</TableCell>
                            <TableCell sx={{margin:0, padding:0, paddingLeft:1, fontSize:'.75rem'}} >
                                <IconButton sx={{padding:0,  fontSize:'1.2rem'}  }>
                                    <DeleteIcon onClick={() => { removeReturnedTray(row.id) }}
                                     fontSize='inherit'
                                     />
                                </IconButton>
                            
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter sx={{borderTop: '1px solid rgba(0, 0, 0, 0.12)', height:'100%'}}>
                   <Box sx={{display:'flex', alignItems: 'center', paddingTop:1, paddingLeft: 1, width:'100%'}}>
                     <Typography >Total:</Typography>
                        <Typography sx={{paddingLeft:1}} >{movements.reduce((a, b) => a + parseInt(b.quanty), 0)}</Typography>
                     </Box>
                </TableFooter>
            </Table>
        </TableContainer>

    )

    return (
        <>
            <Paper variant='outlined' sx={{ height: '100%', padding: 0 }} margin={0}>
                <Grid container spacing={1} direction={'column'}>
                    <Grid item xs={12}>
                        <Box sx={{
                            padding: 1,
                            display: 'flex',
                            alignItems: 'center',
                     
                            width: '100%'
                        }}>
                            <IconButton
                                sx={{ flex: '0 0 auto', padding: .5 }}
                                onClick={() => { setOpenReturnedTraysDialog(true) }}>
                                <AddCircleIcon fontSize='inherit' />
                            </IconButton>
                            <Typography paddingBottom={0} paddingTop={0}>
                                Bandejas devueltas
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        {table(returnetTrays)}
                    </Grid>
                </Grid>
            </Paper>

            <Dialog open={openReturnedTraysDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Devolver bandejas</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <Grid container spacing={1} direction={'column'}>
                        <Grid item marginTop={1}>
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
                        <Grid item >
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