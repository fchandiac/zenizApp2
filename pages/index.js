import React from 'react'
import { Dialog, DialogActions, DialogTitle, DialogContent, Grid, TextField, Button } from '@mui/material'
import { useAppContext } from '../appProvider'
import { useRouter } from 'next/router'

const users = require('../services/users')

export default function index() {
  const { setUser, openSnack, setPageTitle} = useAppContext()
  const router = useRouter()
  const [userData, setUserData] = React.useState({ user: '', pass: '' })


  const login = async() => {
    try{
      const findUser = await users.findOneByUser(userData.user)
      if (findUser === null) {
        openSnack('Usuario no encontrado', 'error')
      } else {
        if (findUser.pass === userData.pass) {
          setUser(findUser)
          console.log(findUser)
          openSnack('Bienvenido', 'success')
          router.push('/newReception')
          setPageTitle('Nueva recepción')
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
       <Dialog open={true} maxWidth={'xs'} fullWidth
        BackdropProps={{
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
        }}
      // PaperProps={{
      //   sx: { boxShadow: '0px 20px 300px rgba(0, 0, 0, 0.6)' },
      // }}
      >
        <DialogTitle sx={{ p: 2 }}>
          Acceso
        </DialogTitle>
        <form onSubmit={(e) => { e.preventDefault(); login() }}>
          <DialogContent sx={{ p: 2 }}>
            <Grid container spacing={1} direction={'column'}>
              <Grid item marginTop={1}>
                <TextField
                  label="Usuario"
                  value={userData.user}
                  onChange={(e) => setUserData({ ...userData, user: e.target.value })}
                  variant="outlined"
                  size={'small'}
                  fullWidth
                  required
                  autoFocus
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Contraseña"
                  value={userData.pass}
                  onChange={(e) => setUserData({ ...userData, pass: e.target.value })}
                  variant="outlined"
                  type='password'
                  size={'small'}
                  fullWidth
                  required
                />
              </Grid>

            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button variant={'contained'} type={'submit'}>ingresar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
