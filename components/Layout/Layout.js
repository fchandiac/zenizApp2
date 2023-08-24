import React, { useState } from 'react'
import {
    AppBar, Container, Drawer, IconButton, Box, Divider, List, ListItem, ListItemButton, ListItemText,
    Typography, Dialog, DialogTitle, DialogContent, Button
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { useRouter } from 'next/router'


import { useAppContext } from '../../appProvider'
import Snack from '../Karmextron/Snack/Snack'

export default function Layout(props) {
    const { children } = props
    const { pageTitle, setPageTitle, lock, setLock } = useAppContext()
    const router = useRouter()
    const [openDrawer, setOpenDrawer] = useState()
    const [openAuthDialog, setOpenAuthDialog] = useState(false)

    const updateLock = () => {
        setLock(!lock)
        setOpenAuthDialog(false)
    }

    return (
        <>
            <AppBar name="appBar">
                <Container sx={{ display: 'flex', alignItems: 'center', paddingTop: '0.3rem', paddingBottom: '0.3rem' }}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        name='menuButton'
                        aria-label="Menu"
                        sx={{ mr: 2 }}
                        onClick={() => { setOpenDrawer(!openDrawer) }}
                    >
                        <MenuIcon />

                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {pageTitle}
                    </Typography>
                    <IconButton onClick={() => { lock ? setOpenAuthDialog(true) : updateLock() }} color={'inherit'} size="large" sx={{ mr: 1 }}>
                        <LockOpenIcon sx={{ display: lock ? 'none' : 'block' }} />
                        <LockIcon sx={{ display: lock ? 'block' : 'none' }} />
                    </IconButton>
                </Container>
            </AppBar>
            <Drawer
                anchor='left'
                open={openDrawer}
                onClick={() => { setOpenDrawer(!openDrawer) }}
            // sx={{backgroundColor:'rgba(158, 158, 158, 0.1)'}}
            >
                <Box sx={{ justifyContent: 'flex-end', display: 'flex', padding: 1 }}>
                    <IconButton onClick={() => setOpenDrawer(false)} >
                        <ChevronLeft />
                    </IconButton>
                </Box>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary={'Nueva recepción'}
                                onClick={() => {
                                    router.push({
                                        pathname: '/',
                                    })
                                    setPageTitle('Nueva recepción')
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary={'Recepciones'}
                                onClick={() => {
                                    router.push({
                                        pathname: '/receptions',
                                    })
                                    setPageTitle('Recepciones')
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary={'Pallets'}
                                onClick={() => {
                                    router.push({
                                        pathname: '/pallets',
                                    })
                                    setPageTitle('Pallets')
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary={'Nuevo despacho'}
                                onClick={() => {
                                    router.push({
                                        pathname: '/newDispatch',
                                    })
                                    setPageTitle('Nuevo despacho')
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary={'Despachos'}
                                onClick={() => {
                                    router.push({
                                        pathname: '/dispatches',
                                    })
                                    setPageTitle('Despachos')
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary={'Productores'}
                                onClick={() => {
                                    router.push({
                                        pathname: '/producers',
                                    })
                                    setPageTitle('Productores')
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary={'Clientes'}
                                onClick={() => {
                                    router.push({
                                        pathname: '/customers',
                                    })
                                    setPageTitle('Clientes')
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary={'Variedades'}
                                onClick={() => {
                                    router.push({
                                        pathname: '/varieties',
                                    })
                                    setPageTitle('variedades')
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary={'Tipos de Fruta'}
                                onClick={() => {
                                    router.push({
                                        pathname: '/types',
                                    })
                                    setPageTitle('Tipos de Fruta')
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            {/* Karmextron */}
            <Snack />
            {/* AuthDialog */}
            <Dialog open={openAuthDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Autorización</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                   <Button variant='contained' fullWidth onClick={() => { updateLock() }}>Autorizar</Button>
                   {/* <Button variant={'outlined'} onClick={() => { setOpenAuthDialog(false) }}>Cerrar</Button> */}
                </DialogContent>
            </Dialog>
            {/* Children */}
            {children}
        </>
    )
}
