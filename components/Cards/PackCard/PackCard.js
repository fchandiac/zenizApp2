import { Card, CardContent, Typography, Box } from '@mui/material'
import React from 'react'

export default function PackCard(props) {
    const { pack } = props
    console.log(pack)
    return (
        <>
            <Card variant={'outlined'}>
                <Box sx={{ p: 1, backgroundColor: '#e0e0e0' }} display="flex" flexDirection="column">
                    <Typography fontSize={16} >{'Pack ' + pack.id}</Typography>
                </Box>
                <Box sx={{ p: 1 }} display="flex" flexDirection="column">
                    <Typography marginBottom={0} fontSize={10}>{'Pallet ' + pack.PalletId}</Typography>
                    <Typography marginBottom={0} fontSize={10}>{pack.quanty + ' Bandejas'}</Typography>
                    <Typography marginBottom={0} fontSize={10}>{pack.trays_weight.toLocaleString('es-CL') + ' Kg en Bandejas' }</Typography>
                    <Typography marginBottom={0} fontSize={10}>{pack.net.toLocaleString('es-CL') + ' Kg Neto '}</Typography>
                    <Typography marginBottom={0} fontSize={10}>{ pack.gross.toLocaleString('es-CL') + ' Kg Bruto'}</Typography>
                </Box>
            </Card>
        </>
    )
}
