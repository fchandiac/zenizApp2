import React from 'react'
import { Card, CardActionArea, CardContent, CardHeader, IconButton, Typography, Box } from '@mui/material'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import IosShareIcon from '@mui/icons-material/IosShare'

export default function PalletPackCard(props) {
    const { pack } = props
    return (
        <>
            <Card variant={'outlined'}>
                <Box sx={{ p: 1, backgroundColor: '#e0e0e0' }} display="flex" flexDirection="column">
                    <Typography fontSize={16} >{'Pack ' + pack.id}</Typography>
                    <Typography variant={'caption'} >{pack.Reception.Producer.name}</Typography>
                </Box>
                <Box sx={{ p: 1 }} display="flex" flexDirection="column">
                    <Typography marginBottom={0} fontSize={10}>{ pack.quanty + ' Bandejas ' + pack.Tray.name}</Typography>
                    <Typography marginBottom={0} fontSize={10}>{'Peso Bandejas ' + pack.trays_weight + ' Kg'}</Typography>
                    <Typography marginBottom={0} fontSize={10}>{pack.net + ' Kg neto'}</Typography>
                    <Typography marginBottom={0} fontSize={10}>{pack.gross + ' Kg bruto'}</Typography>
                </Box>
                <Box sx={{ paddingLeft: 1, paddingBottom: 1, paddingRight: 1 }}>
                    <IconButton>
                        <ContentCutIcon fontSize={'small'} />
                    </IconButton>
                    <IconButton  >
                        <IosShareIcon fontSize={'small'}/>
                    </IconButton>
                </Box>
            </Card>
        </>
    )
}
