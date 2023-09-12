import React, { useState } from 'react'
import {
    Card, CardActionArea, CardContent, CardHeader, IconButton, Typography, Box,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Grid
} from '@mui/material'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import IosShareIcon from '@mui/icons-material/IosShare'
import { useAppContext } from '../../../appProvider'
import PrintIcon from '@mui/icons-material/Print'
import PrintDialog from '../../PrintDialog/PrintDialog'
import Barcode from 'react-barcode'


const pallets = require('../../../services/pallets')
const packs = require('../../../services/packs')

export default function PalletPackCard(props) {
    const { dispatchPallets,
        addDispatchPallet,
        removeAllDispatchPallet,
        updateDispatchPalletPacks, 
        openSnack
    } = useAppContext()
    const { pack } = props
    const [openMoveDialog, setOpenMoveDialog] = useState(false)
    const [targetPalletToMove, setTargetPalletToMove] = useState(null)
    const [openDivideDialog, setOpenDivideDialog] = useState(false)
    const [divideValues, setDivideValues] = useState({packQuantyA: 0, packQuantyB: 0})
    const [openPrintDialog, setOpenPrintDialog] = useState(false)


    const movePack = async () => {
        let findTargetPallet = dispatchPallets.find((pallet) => pallet.id == targetPalletToMove)
        if (!findTargetPallet) {
            openSnack( 'Debe cargar el pallet '  + targetPalletToMove +  ' al despacho','error' )
        } else {
            await packs.updatePallet(pack.id, targetPalletToMove)
            const palletA = await pallets.findOneById(pack.pallet_id)
            const palletB = await pallets.findOneById(targetPalletToMove)
            updateDispatchPalletPacks(palletA.id, palletA.Packs)
            updateDispatchPalletPacks(palletB.id, palletB.Packs)
            setTargetPalletToMove(null)
            setOpenMoveDialog(false)
        }
        // pallet a - b 
    }

    const dividePack = async () => {
        if (divideValues.packA == 0 || divideValues.packB == 0) {
            openSnack('Debe ingresar los valores de los packs', 'error')
        } else {
            let originalQuanty = pack.quanty
            console.log('originalQuanty', originalQuanty)
            await packs.divide(pack.id, divideValues.packQuantyA, divideValues.packQuantyB)
            const pallet = await pallets.findOneById(pack.pallet_id)
            updateDispatchPalletPacks(pallet.id, pallet.Packs)
            setDivideValues({packQuantyA: 0, packQuantyB: 0})
            setOpenDivideDialog(false)
        }
    }


    return (
        <>
            <Card variant={'outlined'}>
                <Box sx={{ p: 1, backgroundColor: '#e0e0e0' }} display="flex" flexDirection="column">
                    <Typography fontSize={16} >{'Pack ' + pack.id}</Typography>
                    <Typography variant={'caption'} >{pack.Reception.Producer.name}</Typography>
                </Box>
                <Box sx={{ p: 1 }} display="flex" flexDirection="column">
                    <Typography marginBottom={0} fontSize={10}>{pack.quanty + ' Bandejas ' + pack.Tray.name}</Typography>
                    <Typography marginBottom={0} fontSize={10}>{'Peso Bandejas ' + pack.trays_weight + ' Kg'}</Typography>
                    <Typography marginBottom={0} fontSize={10}>{pack.net + ' Kg neto'}</Typography>
                    <Typography marginBottom={0} fontSize={10}>{pack.gross + ' Kg bruto'}</Typography>
                </Box>
                <Box sx={{ paddingLeft: 1, paddingBottom: 1, paddingRight: 1 }}>
                    <IconButton
                        onClick={(e) => { setOpenDivideDialog(true)}}
                    >
                        <ContentCutIcon fontSize={'small'} />
                    </IconButton>
                    <IconButton
                        onClick={(e) => { setOpenMoveDialog(true) }}
                    >
                        <IosShareIcon fontSize={'small'} />
                    </IconButton>
                    <IconButton
                        onClick={(e) => { setOpenPrintDialog(true) }}
                    >
                        <PrintIcon fontSize={'small'} />
                    </IconButton>
                </Box>
            </Card>

            <Dialog open={openMoveDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Mover Pack</DialogTitle>
                <form onSubmit={(e) => { e.preventDefault(); movePack() }}>
                <DialogContent sx={{ padding: 1 }}>
                    <TextField
                        label='Pallet destino'
                        variant='outlined'
                        type='number'
                        value={ targetPalletToMove}
                        onChange={(e) => { setTargetPalletToMove(e.target.value) }}
                        fullWidth
                        required
                        autoFocus
                        size='small'
                    />
                        

                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button variant={'contained'} type='submit'>Mover</Button>
                    <Button variant={'outlined'} onClick={() => { setOpenMoveDialog(false) }}>Cerrar</Button>
                </DialogActions>
                </form>
            </Dialog>

            <Dialog open={openDivideDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Mover Pack</DialogTitle>
                <form onSubmit={(e) => { e.preventDefault(); dividePack() }}>
                <DialogContent sx={{ padding: 1 }}>

                    <Grid container spacing={1} direction={'column'}>
                        <Grid item>
                    <TextField
                        label='pack A'
                        variant='outlined'
                        type='number'
                        value={ divideValues.packQuantyA}
                        onChange={(e) => { setDivideValues({...divideValues, packQuantyA: e.target.value}) }}
                        fullWidth
                        required
                        autoFocus
                        size='small'
                    />
                        </Grid>
                        <Grid item>
                    <TextField
                        label='pack B'
                        variant='outlined'
                        type='number'
                        value={ divideValues.packQuantyB}
                        onChange={(e) => { setDivideValues({...divideValues, packQuantyB: e.target.value}) }}
                        fullWidth
                        size='small'
                        required
                    />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button variant={'contained'} type='submit'>Dividir</Button>
                    <Button variant={'outlined'} onClick={() => { setOpenDivideDialog(false) }}>Cerrar</Button>
                </DialogActions>
                </form>
            </Dialog>

            <PrintDialog 
                open={openPrintDialog}
                setOpen={setOpenPrintDialog}
                maxWidth={'xs'}
                title={'Imprimir etiqueta'}
            >
                <Typography variant={'subtitle1'} fontWeight="bold" align='center'>{'ZENIZ'}</Typography>
                <Typography variant={'subtitle2'} fontWeight="bold" align='center'>{'Pack ' + pack.id}</Typography>
                <Typography variant={'subtitle2'} fontWeight="bold" align='center'>{'Recepción' + pack.Reception.id}</Typography>
                <Typography variant={'subtitle2'} fontWeight="bold" align='center'>{pack.Reception.Producer.name}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Barcode value={pack.id.toString()} />
                </Box>

            </PrintDialog>

        </>
    )
}
