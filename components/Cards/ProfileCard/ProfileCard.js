import React from 'react'
import { Card, Box, Typography, CardActions, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAppContext } from '../../../appProvider'

export default function ProfileCard(props) {
  const { user } = useAppContext()
    const {profileData} = props
  return (
    <>
    <Card variant={'outlined'}>
        <Box sx={{ p: 1, backgroundColor: '#e0e0e0' }} display="flex" flexDirection="column">
            <Typography fontSize={16} >{profileData.name}</Typography>
        </Box>
        <Box sx={{ p: 1, display: profileData.id == 1002? 'inline-block': 'none' }} display="flex" flexDirection="column">
        <Typography
            marginBottom={0} fontSize={10}>{'Sin ningún permiso'}</Typography>
        </Box>
        <Box sx={{ p: 1 }} display="flex" flexDirection="column">
            <Typography
            sx={{display: profileData.delete? 'inline-block' : 'none'}}
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
        <CardActions sx={{ justifyContent: 'flex-end', alignItems:'center' }}>
          
                    <IconButton
                            sx={{ 
                                display: user.Profile.delete == false || profileData.id == 1001  || profileData.id == 1002? 'none' : 'inline-flex', 
                            }}
                            onClick={(e) => { console.log('delete', user.id) }}
                        >
                            <DeleteIcon fontSize='small' />
                        </IconButton>
                </CardActions>

    </Card>
</>
  )
}
