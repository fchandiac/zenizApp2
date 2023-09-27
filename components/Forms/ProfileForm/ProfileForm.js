import { Grid, FormControlLabel, Switch, TextField, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'

const profiles = require('../../../services/profiles')

export default function ProfileForm(props) {
    const { afterSubmit } = props
    const [profileData, setProfileData] = useState(profileDataDefault())

    const saveProfile = async () => {
        {
            const newProfile = await profiles.create(
                profileData.name,
                profileData.delete_,
                profileData.edit,
                profileData.settlement,
                profileData.new_reception,
                profileData.new_dispatch,
                profileData.close_reception,
                profileData.close_dispatch,
                profileData.advance
            )
            setProfileData(profileDataDefault())
            afterSubmit()
        }
    }

    return (
        <>
            <form onSubmit={(e) => { e.preventDefault(); saveProfile() }}>
                <Grid container spacing={1} direction={'column'} p={1}>
                    <Grid item>
                        <TextField
                            label={'Nombre'}
                            variant={'outlined'}
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            fullWidth
                            size='small'
                            required
                        />
                    </Grid>
                    <Grid item >
                        <FormControlLabel
                            sx={{ paddingLeft: 1 }}
                            control={<Switch checked={profileData.delete_} onChange={() => {
                                setProfileData({ ...profileData, delete_: !profileData.delete_ })
                            }}
                                size='small'
                            />}
                            label='Eliminar'
                        />
                    </Grid>
                    <Grid item>
                        <FormControlLabel
                        sx={{ paddingLeft: 1 }}
                            control={<Switch checked={profileData.edit} onChange={() => {
                                setProfileData({ ...profileData, edit: !profileData.edit })
                            }}
                                size='small'
                            />}
                            label='Editar'
                        />
                    </Grid>
                    <Grid item>
                        <FormControlLabel
                        sx={{ paddingLeft: 1 }}
                            control={<Switch checked={profileData.settlement} onChange={() => {
                                setProfileData({ ...profileData, settlement: !profileData.settlement })
                            }}
                                size='small'
                            />}
                            label='Liquidar'
                        />
                    </Grid>
                    <Grid item>
                        <FormControlLabel
                        sx={{ paddingLeft: 1 }}
                            control={<Switch checked={profileData.new_reception} onChange={() => {
                                setProfileData({ ...profileData, new_reception: !profileData.new_reception })
                            }}
                                size='small'
                            />}
                            label='Nueva Recepción'
                        />

                    </Grid>
                    <Grid item>
                        <FormControlLabel
                        sx={{ paddingLeft: 1 }}
                            control={<Switch checked={profileData.new_dispatch} onChange={() => {
                                setProfileData({ ...profileData, new_dispatch: !profileData.new_dispatch })
                            }}
                                size='small'
                            />}
                            label='Nuevo Despacho'
                        />

                    </Grid>
                    <Grid item>
                        <FormControlLabel
                        sx={{ paddingLeft: 1 }}
                            control={<Switch checked={profileData.close_reception} onChange={() => {
                                setProfileData({ ...profileData, close_reception: !profileData.close_reception })
                            }}
                                size='small'
                            />}
                            label='Cerrar Recepción'
                        />

                    </Grid>
                    <Grid item>
                        <FormControlLabel
                        sx={{ paddingLeft: 1 }}
                            control={<Switch checked={profileData.close_dispatch} onChange={() => {
                                setProfileData({ ...profileData, close_dispatch: !profileData.close_dispatch })
                            }}
                                size='small'
                            />}
                            label='Cerrar Despacho'
                        />

                    </Grid>
                    <Grid item>
                        <FormControlLabel
                        sx={{ paddingLeft: 1 }}
                            control={<Switch checked={profileData.advance} onChange={() => {
                                setProfileData({ ...profileData, advance: !profileData.advance })
                            }}
                                size='small'
                            />}
                            label='Adelanto'
                        />
                    </Grid>
                    <Grid item textAlign={'right'}>
                        <Button variant='contained' type='submit'>Guardar</Button>
                    </Grid>
                </Grid>
            </form>
        </>
    )
}


function profileDataDefault() {
    return ({
        id: 0,
        name: '',
        delete_: false,
        edit: false,
        settlement: false,
        new_reception: false,
        new_dispatch: false,
        close_reception: false,
        close_dispatch: false,
        advance: false

    })

}


