import { Button, Grid, TextField, InputAdornment, Stack, Typography, Switch } from '@mui/material'
import React, { useState } from 'react'
import { useAppContext } from '../../../appProvider'



const varieties = require('../../../services/varieties')
const records = require('../../../services/records')

export default function VarietyForm(props) {
  const { dialog, edit, closeDialog, afterSubmit, varietyData, setVarietyData, gridApiRef } = props
  const { openSnack, user } = useAppContext()


  const saveVariety = async () => {
    if (edit) {
      await update()
    } else {
      await create()
    }
  }

  const create = async () => {
    try {
      const newVariety = await varieties.create(
        varietyData.name,
        parseInt(varietyData.clp),
        parseFloat(varietyData.usd),
        varietyData.money
      )
      openSnack('Variedad ' + newVariety.name + ' creada', 'success')
      afterSubmit()
      setVarietyData(varietyDataDefault())

    } catch (err) {
      console.log('errOnCreate', err)
      if (err.errors[0].message === 'name must be unique') {
        openSnack('Variedad ' + varietyData.name + ' ya existe', 'error')
      }
    }
  }

  const update = async () => {
    console.log('varietyDataUpdate', varietyData)
    try {
      await varieties.update(
        varietyData.id,
        varietyData.name,
        parseInt(varietyData.clp),
        parseFloat(varietyData.usd),
        varietyData.money
      )
      openSnack('Variedad ' + varietyData.name + ' actualizada', 'success')
      gridApiRef.current.updateRows([{
        id: varietyData.id,
        name: varietyData.name,
        clp: varietyData.clp,
        usd: varietyData.usd,
        money: varietyData.money,
      }])
      await records.create(
        'Variedades',
        'Edición',
        'Variedad ' + varietyData.name +  'Moneda: ' + varietyData.money + ' - CLP: ' + varietyData.clp + ' - USD: ' + varietyData.usd,
        user.id
      )
      setVarietyData(varietyDataDefault())
      dialog ? closeDialog() : null
    } catch (err) {
      console.log('errOnUpdate', err)
      if (err.errors[0].message === 'name must be unique') {
        openSnack('Variedad ' + varietyData.name + ' ya existe', 'error')
      }
    }
  }


  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); saveVariety() }} >
        <Grid container direction={'column'} p={1} spacing={1}>
          <Grid item>
            <TextField
              label='Nombre'
              value={varietyData.name}
              onChange={(e) => { setVarietyData({ ...varietyData, name: e.target.value }) }}
              variant="outlined"
              size={'small'}
              fullWidth
              required
              autoFocus={dialog ? true : false}
            />
          </Grid>
          <Grid item >
            <Stack direction="row" spacing={1} justifyContent={'flex-end'}>
              <Typography fontSize={11} sx={{ display: 'flex', alignItems: 'center' }}>CLP</Typography>
              <Switch
                checked={varietyData.moneySwitch}
                onChange={(e) => {
                  setVarietyData({
                    ...varietyData,
                    moneySwitch: e.target.checked,
                    clp: e.target.checked ? 0 : varietyData.clp,
                    usd: e.target.checked ? varietyData.usd : 0,
                    money: e.target.checked ? 'USD' : 'CLP'
                  })
                }}
                color={'success'}
                size={'small'} />
              <Typography fontSize={11} sx={{ display: 'flex', alignItems: 'center' }}>USD</Typography>
            </Stack>
          </Grid>
          <Grid item display={varietyData.moneySwitch ? 'none' : 'inline-block'}>
            <TextField
              label='CLP'
              value={varietyData.clp}
              onChange={(e) => {
                setVarietyData({ ...varietyData, usd: 0, clp: e.target.value })
              }}
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
          <Grid item display={varietyData.moneySwitch ? 'inline-block' : 'none'}>
            <TextField
              label='USD'
              value={varietyData.usd}
              onChange={(e) => {
                setVarietyData({ ...varietyData, clp: 0, usd: e.target.value })
              }}
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

function varietyDataDefault() {
  return ({
    id: 0,
    name: '',
    clp: 0,
    usd: 0,
    money: 'CLP',
    moneySwitch: false

  })
}