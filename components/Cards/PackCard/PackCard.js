import { Card, CardContent, Typography } from '@mui/material'
import React from 'react'

export default function PackCard(props) {
    const { pack } = props
    return (
        <>
            <Card variant={'outlined'}>
                <CardContent>
                    <Typography variant={'subtitle2'} gutterBottom>{'Pack ' + pack.id}</Typography>
                    <Typography variant={'caption'} gutterBottom>{'Pallet ' + pack.PalletId}</Typography>
                    <Typography variant={'caption'} gutterBottom>{'Bandejas ' + pack.quanty}</Typography>
                    <Typography variant={'caption'} gutterBottom>{'Peso Bandejas ' + pack.trays_weight}</Typography>
                    <Typography variant={'caption'} gutterBottom>{'Neto ' + pack.net}</Typography>
                    <Typography variant={'caption'} gutterBottom>{'Bruto ' + pack.gross}</Typography>
                </CardContent>

            </Card>
        </>
    )
}
