import React from 'react'
import { Card, Box, Typography, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAppContext } from '../../../appProvider'

export default function UserCard(props) {
    const { user } = useAppContext()
    const { userData } = props
    console.log(userData)
    return (
        <>
            <>
                <Card variant={'outlined'} sx={{ height: '100%', justifyContent: 'space-between', flexDirection: 'column', display: 'flex' }} >
                    <Box>
                        <Box sx={{ p: 1, backgroundColor: '#e0e0e0' }} display="flex" flexDirection="column">
                            <Typography fontSize={16} >{userData.user}</Typography>
                        </Box>
                        <Box sx={{ p: 1 }} display="flex" flexDirection="column">
                            <Typography marginBottom={0} fontSize={10}>{'Nombre Completo: ' + userData.name}</Typography>
                            <Typography marginBottom={0} fontSize={10} >{userData.Profile == undefined ? '' : userData.Profile.name}</Typography>
                        </Box>

                    </Box>
                    <Box sx={{ padding: 1 }}>

                        <IconButton
                            sx={{ display: user.Profile.delete == false || userData.id === 1001 ? 'none' : 'inline-block' }}
                            onClick={(e) => { s }}
                        >
                            <DeleteIcon fontSize={'small'} />
                        </IconButton>
                    </Box>
                </Card>
            </>
        </>
    )
}
