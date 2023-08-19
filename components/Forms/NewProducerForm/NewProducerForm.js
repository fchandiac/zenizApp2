import { Button, Grid, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useAppContext } from '../../../appProvider'

const utils = require('../../../utils')

export default function NewProducerForm(props) {
  const { dialog, closeDialog, afterSubmit } = props
  const { openSnack } = useAppContext()
  const [producerData, setProducerData] = useState(producerDataDefault())

  const saveProducer = () => {
    openSnack('Productor guardado', 'success')
    console.log(producerData)
  }
  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); saveProducer() }} >
        <Grid container direction={'column'}>
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