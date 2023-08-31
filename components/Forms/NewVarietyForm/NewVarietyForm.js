import { Button, Grid, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useAppContext } from '../../../appProvider'


const varieties = require('../../../services/varieties')

export default function NewVarietyForm(props) {
  const { dialog, closeDialog, afterSubmit } = props
  const { openSnack } = useAppContext()
  const [varietyName, setVarietyName] = useState('')


  const saveVariety = async () => {
    try{
      const newVariety = await varieties.create(varietyName)
      openSnack('Variedad ' + newVariety.name + ' creada', 'success')
      setVarietyName('')
      afterSubmit()

    } catch (err) {
      if (err.error[0].message === 'name must be unique') {
        openSnack('Variedad ' + varietyName + ' ya existe', 'error')
      }
        
    }

  }


  return (
    <>
    <form onSubmit={(e) => { e.preventDefault(); saveVariety() }} >
      <Grid container direction={'column'} p={1}>
        <Grid item>
          <TextField
            label='Nombre'
            value={varietyName}
            onChange={(e) => { setVarietyName(e.target.value)}}
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
