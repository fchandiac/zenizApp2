import { Button, Grid, TextField, InputAdornment, Stack, Typography, Switch } from '@mui/material'
import React, { useState } from 'react'
import { useAppContext } from '../../../appProvider'

const trays = require('../../../services/trays')

export default function TrayForm(props) {
  const { dialog, edit, closeDialog, afterSubmit, trayData, setTrayData, gridApiRef } = props
  const { openSnack } = useAppContext()

  const saveTray = async () => {
    if (edit) {
      console.log(trayData)
      await update()
    } else {
      await create()
    }
  }

  const create = async () => {

    try {
      const newTray = await trays.create(
        trayData.name,
        parseFloat(trayData.weight)
      )
      openSnack('Bandeja ' + newTray.name + ' creada', 'success')
      afterSubmit()
    } catch (err) {
      if (err.errors[0].message === 'name must be unique') {
        openSnack('Ya existe una bandeja con ese nombre', 'error')
      } else {
      openSnack('Error al crear la bandeja', 'error')
      }
    }
  }

  const update = async () => {
    try {
      const updatedTray = await trays.update(
        trayData.id,
        trayData.name,
        parseFloat(trayData.weight)
      )
      openSnack('Bandeja ' + updatedTray.name + ' actualizada', 'success')
   

      afterSubmit()
    } catch (err) {
      console.log(err)
      if (err.errors[0].message === 'name must be unique') {
        openSnack('Ya existe una bandeja con ese nombre', 'error')
      } else {
      openSnack('Error al actualizar la bandeja', 'error')
      }
    }
  }

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); saveTray() }} >
        <Grid container direction={'column'} p={1}>
          <Grid item>
            <TextField
              label='Nombre'
              value={trayData.name}
              onChange={(e) => { setTrayData({ ...trayData, name: e.target.value }) }}
              variant="outlined"
              size={'small'}
              fullWidth
              required
              autoFocus={dialog ? true : false}
            />
          </Grid>
          <Grid item>
            <TextField
              label='Peso'
              value={trayData.weight}
              onChange={(e) => { setTrayData({ ...trayData, weight: e.target.value }) }}
              variant="outlined"
              size={'small'}
              type='number'
              fullWidth
              required
              InputProps={{
                endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
              }}

            />
          </Grid>

          <Grid item textAlign={'right'}>
            <Button variant="contained" type='submit'>
              {(edit ? 'Editar' : 'Guardar')}
            </Button>
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
