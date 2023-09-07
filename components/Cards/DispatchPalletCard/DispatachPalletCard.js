import React, {useState} from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { Card, Box, Typography, IconButton, Grid, Popover, Paper, Divider } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PalletPackCard from '../PalletPackCard/PalletPackCard'
import { useAppContext } from '../../../appProvider'

export default function DispatachPalletCard(props) {
    const { pallet } = props
    const { removeDisptachPallet } = useAppContext()
    const [anchorElPopOver, setAnchorElPopOver] = useState(null)
    const openMoreInfo = Boolean(anchorElPopOver)
    const id = openMoreInfo ? 'simple-popover' : undefined

    const deletePallet = () => {
        removeDisptachPallet(pallet.id) // remove Pallet from dispatch
    }

    return (
        <>
            <Card variant={'outlined'}>
                <Box sx={{ p: 1, backgroundColor: '#e0e0e0' }} display="flex" >
                    <Typography fontSize={16} sx={{ flex: '1' }}>{'Pallet ' + pallet.id}</Typography>
                    <IconButton
                        sx={{ flex: '0 0 auto', marginLeft: 1 }}
                        onClick={(e) => { setAnchorElPopOver(e.currentTarget) }}
                        aria-describedby={id}
                    >
                        <MoreVertIcon fontSize={'small'} />
                    </IconButton>
                </Box>
                <Box sx={{ p: 1 }} >
                    <Grid container spacing={1}>
                        {pallet.packs.map((pack) => (
                            <Grid item xs={6} key={pack.id}>
                                <PalletPackCard pack={pack} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Box sx={{ paddingLeft: 1, paddingBottom: 1, paddingRight: 1 }}>
                    <IconButton onClick={(e) => { deletePallet() }}>
                        <DeleteIcon fontSize={'small'} />
                    </IconButton>
                </Box>
            </Card>

            <Popover
                id={id}
                open={openMoreInfo}
                anchorEl={anchorElPopOver}
                onClose={() => { setAnchorElPopOver(null)}}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Paper sx={{ p: 1 }}>
                    <Typography variant={'caption'} fontWeight="bold">{'Pallet ' + pallet.id}</Typography>
                    <Divider />
                    <Box flexDirection={'column'} paddingTop={1}>
                        <Typography variant={'caption'} fontWeight="bold">{'Productores: '}</Typography>
                        {pallet.producerList.map((item, index) => (
                            <Typography fontSize={10} key={index}>{item}</Typography>
                        ))}
                    </Box>
                    <Box flexDirection={'column'} paddingBottom={1}>
                        <Typography variant={'caption'} fontWeight="bold">{'Variedades: '}</Typography>
                        {pallet.varietyList.map((item, index) => (
                            <Typography fontSize={10} key={index}>{item}</Typography>
                        ))}
                    </Box>
                    <Divider />
                    <Box flexDirection={'column'} display={'flex'} paddingTop={1}>
                        <Typography  fontSize={10}>{'Bandeja ' + pallet.trayName}</Typography>
                        <Typography fontSize={10}>{pallet.beforeGrossSum.toLocaleString('es-CL') + ' Kg bruto'}</Typography>
                        <Typography fontSize={10}>{pallet.dispatchWeight.toLocaleString('es-CL') + ' Kg bruto (despacho)'}</Typography>
                        <Typography  fontSize={10}>{pallet.traysWeight.toLocaleString('es-CL') + ' Kg bandejas'}</Typography>
                        <Typography  fontSize={10}>{pallet.beforeNetSum.toLocaleString('es-CL') + ' Kg neto'}</Typography>
                        <Typography  fontSize={10}>{pallet.dipatchNetSum .toLocaleString('es-CL')+ ' Kg neto (despacho)'}</Typography>
                    </Box>
                </Paper>
            </Popover>
        </>
    )
}
