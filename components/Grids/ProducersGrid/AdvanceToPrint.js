import { Divider, Paper, Typography, Box } from '@mui/material'
import moment from 'moment'
import React from 'react'



export default function AdvanceToPrint(props) {
    const {advance} = props
  return (
    <>
            <Typography variant={'subtitle2'} fontWeight="bold">{'Anticipio ' + advance.id}</Typography>
            <Divider sx={{paddingTop:1, paddingBottom:1}}/>
            <Box flexDirection={'column'} paddingTop={1} display={'flex'}>
                <Typography variant={'caption'}>{'Productor: ' + advance.Producer.name}</Typography>
                <Typography variant={'caption'}>{'Rut: ' + advance.Producer.rut}</Typography>
                <Typography variant={'caption'}>{'Fecha: ' + moment(advance.cratedAt).format('DD-MM-YYYY HH:mm')}</Typography>
                <Typography variant={'caption'}>{'Monto: ' + advance.amount.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</Typography>
                <Typography variant={'caption'}>{'Descripción: ' + advance.description}</Typography>
            </Box>
            <Divider sx={{paddingTop:1, paddingBottom:1}}/>
        </>
  )
}
