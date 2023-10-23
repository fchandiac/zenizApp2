
import { Paper, Box, Typography, Divider } from '@mui/material'
import React, { useEffect, useState } from 'react'

const traysMovements = require('../../../services/traysMovements')

export default function TrayMovementToPrint(props) {
    const { movementId } = props
    const [movement, setMovement] = useState()

    useEffect(() => {
        console.log(movementId)
        const fetchData = async () => {
            const mov = await traysMovements.findOneById(movementId)
            console.log(mov)
            setMovement(mov)
        }

        fetchData()

    }, [movementId])
    return (
        <Paper variant='outlined' style={{ padding: '5px', borderColor: 'black', width: '55mm' }}>
            <Box>
                <Typography variant='h6' align='center'>ZENIZ</Typography>
            </Box>

            <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' }} />

            <Box display='flex' justifyContent={'center'} flexDirection={'row'}>
                {/* <Typography fontSize={14} align='center'>Movimiento: {movement.id}</Typography> */}
            </Box>
            <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' }} />
            <Box display='flex' justifyContent={'left'} flexDirection={'row'}>
                {/* <Typography fontSize={14} align='left'>Productor: {movement.Producer.name}</Typography> */}
            </Box>
      

            <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' }} />

      

            <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' }} />

     
            <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black', display: returnedTraysData.length > 0 ? 'block' : 'none' }} />

      

        </Paper>
    )
}
