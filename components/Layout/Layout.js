import React, { useState } from 'react'
import { AppBar, Container, Drawer, IconButton, Box, Divider, List, ListItem, ListItemButton, ListItemText,
Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { useRouter } from 'next/router'


import { useAppContext } from '../../appProvider'

export default function Layout(props) {
    const { children } = props
    const { pageTitle, setPageTitle } = useAppContext()
    const router = useRouter()
    const [openDrawer, setOpenDrawer] = useState()

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
                            <ListItemText primary={'Home'}
                                onClick={() => {
                                    router.push({
                                        pathname: '/',
                                    })
                                    setPageTitle('Home')
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary={'otherPage'}
                                onClick={() => {
                                    router.push({
                                        pathname: '/otherPage',
                                    })
                                    setPageTitle('otherPage')
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>


            {/* Children */}
            {children}
        </>
    )
}
