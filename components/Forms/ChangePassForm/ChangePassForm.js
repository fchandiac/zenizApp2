
import { Button, Grid, TextField } from '@mui/material'
import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import { useAppContext } from '../../../appProvider'

const users = require('../../../services/users')


export default function ChangePassForm(props) {
  const {openSnack} = useAppContext()
  const {closeDialog, user, afterSubmit} = props
  const [userData, setUserData] = useState(userDataDefault())
  const router = useRouter()

  const updatePass = async () => {

    try{
      const findUser = await users.findOneByUser(user)
      if (findUser === null) {
        openSnack('Usuario no encontrado', 'error')
      } else {
        if (findUser.pass === userData.pass) {
          await users.updatePass(findUser.id, userData.newPass)
          openSnack('Constraseña actualizada', 'success')
          afterSubmit()
          router.push('/')
        } else {
          openSnack('Contraseña incorrecta', 'error')
        }
      }

    } catch(err){
      openSnack('Error de conexión al servidor', 'error')
      
      // if (err.errors[0].message === 'user not found') {])
    }
    


  }


  return (
    <>
    <Grid container spacing={1} direction={'column'} paddingTop={1}>
      <Grid item>
        <TextField
          label="Contraseña actual"
          value={userData.pass}
          onChange={(e) => setUserData({ ...userData, pass: e.target.value })}
          type={'password'}
          fullWidth
          size='small'
        />
      </Grid>

      <Grid item>
        <TextField
          label="Nueva contraseña"
          value={userData.newPass}
          onChange={(e) => setUserData({ ...userData, newPass: e.target.value })}
          type={'password'}
          fullWidth
          size='small'
        />
      </Grid>
      <Grid item spacing={1} textAlign={'right'}>
        <Button variant={'contained'}  onClick={() => updatePass()}>Actualizar</Button>
        <Button variant={'outlined'}  onClick={() => closeDialog()}>Cerrar</Button>
      </Grid>
    </Grid>
    </>
  )
}

function userDataDefault() {
  return {
    user: '',
    pass: '',
    newPass: '',
  }
}
