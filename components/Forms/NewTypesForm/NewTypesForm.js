import { Button, Grid, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useAppContext } from '../../../appProvider'

const types = require('../../../services/types')

export default function NewTypesForm(props) {
  const { dialog, closeDialog, afterSubmit } = props
  const { openSnack } = useAppContext()
  const [typeName, setTypeName] = useState('')


  const saveType = async () => {
    try {
      const newType = await types.create(typeName)
      openSnack('Variedad ' + newType.name + ' creada', 'success')
      setTypeName('')
      afterSubmit()

    } catch (err) {
      console.log(err)
      if (err.errors[0].message === 'name must be unique') {
        openSnack('Variedad ' + typeName + ' ya existe', 'error')
      }

    }

  }


  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); saveType() }} >
        <Grid container direction={'column'} p={1}>
          <Grid item>
            <TextField
              label='Nombre'
              value={typeName}
              onChange={(e) => { setTypeName(e.target.value) }}
              variant="outlined"
              size={'small'}
              fullWidth
              required
            />
          </Grid>

          <Grid item textAlign={'right'}>
            <Button variant="contained" type='submit'>Guardar</Button>
            <Button
              sx={{ marginLeft: 1, display: dialog ? 'inline-block' : 'none' }}
              variant={'outlined'}
              onClick={() => { closeDialog() }}
            >Cerrar</Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}
