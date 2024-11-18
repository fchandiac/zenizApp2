
import { Paper, Box, Typography, Divider } from '@mui/material'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

const traysMovements = require('../../../services/traysMovements')


export default function TrayMovementToPrint(props) {
    const { movementId } = props
    const [movement, setMovement] = useState(movementDefaultData())

    useEffect(() => {
        console.log(movementId)
        const fetchData = async () => {
            const mov = await traysMovements.findOneById(movementId)
            let formatMov = {
                id: mov.id,
                producerName: mov.Producer == null ? '' : mov.Producer.name,
                reception: mov.Reception == null ? '' : mov.reception,
                CustomerName: mov.Customer == null ? '' : mov.Customer.name,
                dispatch: mov.dispatch == null ? '' : mov.dispatch,
                trayName: mov.Tray.name,
                type: setType(mov.type),
                quanty: mov.quanty,
                balance: mov.balance,
                date: moment(mov.createdAt).format('DD-MM-YYYY HH:mm'),
            }
            console.log(mov)
            setMovement(formatMov)
        }

        fetchData()

    }, [movementId])

    const setType = (type) => {
        switch (type) {
            case 0:
                return 'Entrada'
            case 1:
                return 'Egreso'
            case 2:
                return 'Devolución al productor'
            case 3:
                return 'Recepción'
            case 4:
                return 'Despacho'
            default:
                return ''
        }
    }

    return (
        <Paper variant='outlined' style={{ padding: '5px', borderColor: 'black', width: '55mm' }}>
            <Box>
                <Typography variant='h6' align='center'>ZENIZ</Typography>
            </Box>
            <Box display='flex' justifyContent={'center'}>
                <Typography variant={'caption'} align='center'>Movimiento de bandejas {movement.id}</Typography>
            </Box>
            <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' }} />

            <Box display='flex' justifyContent={'left'} flexDirection={'column'}>
                <Typography fontSize={12}>Productor: {movement.producerName}</Typography>
                <Typography fontSize={12}>Recepción: {movement.reception}</Typography>
                <Typography fontSize={12}>Cliente: {movement.CustomerName}</Typography>
                <Typography fontSize={12}>Despacho: {movement.dispatch}</Typography>
            </Box>
            <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' }} />
            <Box display='flex' justifyContent={'left'} flexDirection={'column'}>
                <Typography fontSize={12}>Bandeja: {movement.trayName}</Typography>
                <Typography fontSize={12}>Movimiento: {movement.type}</Typography>
                <Typography fontSize={12}>Cantidad: {movement.quanty}</Typography>
                {/* <Typography fontSize={12}>Saldo: {movement.balance}</Typography> */}
                <Typography fontSize={12}>Fecha: {movement.date}</Typography>
            </Box>
     

        </Paper>
    )
}


function movementDefaultData() {
    return ({
        id: 0,
        producerName: '',
        reception: '',
        CustomerName: '',
        dispatch: '',
        trayName: '',
        type: '', 
        quanty: 0,
        balance: 0,
        date: '',

    })
}