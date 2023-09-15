import React from 'react'
import { Card, Box, Typography } from '@mui/material'
export default function ProfileCard(props) {
    const {profileData} = props
  return (
    <>
    <Card variant={'outlined'}>
        <Box sx={{ p: 1, backgroundColor: '#e0e0e0' }} display="flex" flexDirection="column">
            <Typography fontSize={16} >{profileData.name}</Typography>
        </Box>
        <Box sx={{ p: 1 }} display="flex" flexDirection="column">
            <Typography 
            sx={{display: profileData.name? 'inline-block' : 'none'}}
            marginBottom={0} fontSize={10}>{profileData.name}</Typography>
            <Typography
            sx={{display: profileData.delete_? 'inline-block' : 'none'}}
            marginBottom={0} fontSize={10}>{'Eliminar'}</Typography>
            <Typography
            sx={{display: profileData.edit? 'inline-block' : 'none'}}
            marginBottom={0} fontSize={10}>{'Editar'}</Typography>
            <Typography
            sx={{display: profileData.settlement? 'inline-block' : 'none'}}
            marginBottom={0} fontSize={10}>{'Liquidar'}</Typography>
            <Typography
            sx={{display: profileData.new_reception? 'inline-block' : 'none'}}
            marginBottom={0} fontSize={10}>{'Nueva Recepción'}</Typography>
            <Typography
            sx={{display: profileData.new_dispatch? 'inline-block' : 'none'}}
            marginBottom={0} fontSize={10}>{'Nuevo Despacho'}</Typography>
            <Typography
            sx={{display: profileData.close_reception? 'inline-block' : 'none'}}
            marginBottom={0} fontSize={10}>{'Cerrar Recepción'}</Typography>
            <Typography
            sx={{display: profileData.close_dispatch? 'inline-block' : 'none'}}
            marginBottom={0} fontSize={10}>{'Cerrar Despacho'}</Typography>
            <Typography
            sx={{display: profileData.advance? 'inline-block' : 'none'}}
            marginBottom={0} fontSize={10}>{'Adelanto'}</Typography>
        </Box>
    </Card>
</>
  )
}
