import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { Card, Box, Typography, IconButton, Grid } from '@mui/material'
import PalletPackCard from '../PalletPackCard/PalletPackCard'

export default function DispatachPalletCard(props) {
    const { pallet } = props
    return (
        <>
            <Card variant={'outlined'}>
                <Box sx={{ p: 1, backgroundColor: '#e0e0e0' }} display="flex" flexDirection="column">
                    <Typography fontSize={16} >{'Pallet ' + pallet.id}</Typography>
                    <Typography variant={'caption'} >{pallet.trayName}</Typography>
                    <Typography variant={'caption'} >{pallet.grossSum + ' Kg bruto'}</Typography>
                    <Box>
                        <Typography variant={'caption'} >{'Productores: '}</Typography>
                        {pallet.producerList.map((item, index) => (
                            <Typography fontSize={10} key={index}>{item}</Typography>
                        ))}

                    </Box>
                    <Box>
                        <Typography variant={'caption'} >{'Variedades: '}</Typography>
                        {pallet.varietyList.map((item, index) => (
                            <Typography fontSize={10} key={index}>{item}</Typography>
                        ))}

                    </Box>
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
                    <IconButton>
                        <DeleteIcon fontSize={'small'} />
                    </IconButton>
                </Box>
            </Card>
        </>
    )
}
