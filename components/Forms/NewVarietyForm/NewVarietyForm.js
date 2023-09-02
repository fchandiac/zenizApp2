import { Button, Grid, TextField, InputAdornment, Stack, Typography, Switch } from '@mui/material'
import React, { useState } from 'react'
import { useAppContext } from '../../../appProvider'


const varieties = require('../../../services/varieties')

export default function NewVarietyForm(props) {
  const { dialog, closeDialog, afterSubmit } = props
  const { openSnack } = useAppContext()
  const [varietyData, setVarietyData,] = useState(varietyDataDefault())
  const [moneySwitch, setMoneySwitch] = useState(false)

  const saveVariety = async () => {
    try {
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
              value={varietyData.name}
              onChange={(e) => { setVarietyName(e.target.value) }}
              variant="outlined"
              size={'small'}
              fullWidth
              required
            />
          </Grid>
          <Grid item >
            <Stack direction="row" spacing={1}  justifyContent={'flex-end'}>
              <Typography fontSize={11} sx={{ display: 'flex', alignItems: 'center'}}>CLP</Typography>
              <Switch 
                checked={moneySwitch}
                onChange={(e) => { setMoneySwitch(e.target.checked) }}
                color={'success'}
               size={'small'} />
              <Typography fontSize={11} sx={{ display: 'flex', alignItems: 'center'}}>USD</Typography>
            </Stack>
          </Grid>
          <Grid item display={moneySwitch? 'none': 'inline-block'}>
            <TextField
              label='CLP'
              value={varietyData.clp}
              onChange={(e) => { setVarietyData({ ...varietyData, clp: e.target.value }) }}
              variant="outlined"
              type='number'
              size={'small'}
              fullWidth
              className='no-spin'

              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item display={moneySwitch? 'inline-block': 'none'}>
            <TextField
              label='USD'
              value={varietyData.usd}
              onChange={(e) => { setVarietyData({ ...varietyData, usd: e.target.value }) }}
              variant="outlined"
              type='number'
              size={'small'}
              fullWidth
              className='no-spin'
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
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

function varietyDataDefault() {
  return ({
    id: 0,
    name: '',
    clp: 0,
    usd: 0,
    money: 'CLP'

  })
}