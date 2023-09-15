import { Button, Grid, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useAppContext } from '../../../appProvider'

const utils = require('../../../utils')
const producers = require('../../../services/producers')

export default function ProducerForm(props) {
  const { dialog, edit, closeDialog, afterSubmit, producerData, setProducerData } = props
  const { openSnack } = useAppContext()
  

  const saveProducer = async () => {
    try {
      const newProducer = await producers.create(
        producerData.rut,
        producerData.name,
        producerData.phone,
        producerData.mail,
        producerData.address
      )
      openSnack('Productor ' + newProducer.name + ' Guardado', 'success')
      setProducerData(producerDataDefault())
      afterSubmit()
      closeDialog()
    } catch (err) {
      if (err.errors[0].message == 'rut must be unique') {
        openSnack('Rut ya existe', 'error')
      } else if (err.errors[0].message == 'name must be unique') {
        openSnack('Nombre ya existe', 'error')
      }
    }
  }
  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); saveProducer() }} >
        <Grid container direction={'column'} p={1}>
          <Grid item>
            <TextField
              label='Nombre'
              value={producerData.name}
              onChange={(e) => { setProducerData({ ...producerData, name: e.target.value }) }}
              variant="outlined"
              size={'small'}
              fullWidth
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label='Rut'
              value={producerData.rut}
              onChange={(e) => { setProducerData({ ...producerData, rut: utils.formatRut(e.target.value) }) }}
              variant="outlined"
              size={'small'}
              fullWidth
              required
            />
          </Grid>
          <Grid item>
            <TextField
              label='Teléfono'
              value={producerData.phone}
              onChange={(e) => { setProducerData({ ...producerData, phone: e.target.value }) }}
              variant="outlined"
              size={'small'}
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              label='Mail'
              value={producerData.mail}
              onChange={(e) => { setProducerData({ ...producerData, mail: e.target.value }) }}
              variant="outlined"
              size={'small'}
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              label='Dirección'
              value={producerData.address}
              onChange={(e) => { setProducerData({ ...producerData, address: e.target.value }) }}
              variant="outlined"
              size={'small'}
              fullWidth
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

function producerDataDefault() {
  return {
    name: '',
    rut: '',
    phone: '',
    mail: '',
    address: ''
  }
}