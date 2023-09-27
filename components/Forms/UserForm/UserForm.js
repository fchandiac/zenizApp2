import { Button, Grid, TextField, Typography, Autocomplete } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../../appProvider'

const users = require('../../../services/users')
const profiles = require('../../../services/profiles')

export default function UserForm(props) {
  const { afterSubmit } = props
  const { openSnack, user } = useAppContext()
  const [userData, setUserData] = useState(userDataDefault())
  const [profileInput, setProfileInput] = useState('')
  const [profilesOptions, setProfilesOptions] = useState([])

  useEffect(() => {
    const fecthData = async () => {
      const profiles_ = await profiles.findAll()
      let data = profiles_.map(item => ({
        id: item.id,
        key: item.id,
        label: item.name
      }))

      setProfilesOptions(data)
    }
    fecthData()
  }, [])

  const saveUser = async () => {
    try {
      const newUser = await users.create(
        userData.user,
        '1234',
        userData.name,
        '',
        userData.profile.id
      )

      setUserData(userDataDefault())
      afterSubmit()

    } catch (err) {
      console.log('errOnCreate', err)
      if (err.errors[0].message === 'user must be unique') {
        openSnack('El usuario ya existe', 'error')
      }
    }


  }

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); saveUser() }}>
        <Grid container spacing={1} direction={'column'} padding={1}>

          <Grid item>
            <TextField
              label={'Usuario'}
              variant={'outlined'}
              value={userData.user}
              onChange={(e) => setUserData({ ...userData, user: e.target.value })}
              fullWidth
              size='small'
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label={'Nombre completo'}
              variant={'outlined'}
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              fullWidth
              size='small'
              required
            />
          </Grid>
          <Grid item>
            <Autocomplete
              inputValue={profileInput}
              onInputChange={(e, newInputValue) => {
                setProfileInput(newInputValue)
              }}

              value={userData.profile}
              onChange={(e, newValue) => {
                setUserData({ ...userData, profile: newValue })
              }}
              getOptionLabel={(option) => option.label}
              disablePortal
              options={profilesOptions}
              renderInput={(params) => <TextField {...params} label='Perfil' size={'small'} required />}
            />
          </Grid>
          <Grid item textAlign={'right'}>
            <Typography variant={'caption'}>Contraseña por defecto "1234"</Typography>

          </Grid>
          <Grid item textAlign={'right'}>
            <Button variant='contained' type='submit'>Guardar</Button>
          </Grid>

        </Grid >
      </form>
    </>
  )
}



function userDataDefault() {
  return ({
    id: 0,
    user: '',
    pass: '',
    name: '',
    mail: '',
    profile: { id: 0, key: 0, label: '' }
  })
}