import { Grid, IconButton, Paper, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useAppContext } from '../appProvider'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import DispatachPalletCard from '../components/Cards/DispatchPalletCard/DispatachPalletCard'


const pallets = require('../services/pallets')

export default function newDispatch() {
  const { addDispatchPallet, dispatch_ } = useAppContext()
  const [palletInput, setPalletInput] = useState('')
  const [dispatchWeight, setDispatchWeight] = useState('')

  const addPallet = async () => {
    const pallet = await pallets.findOneById(palletInput)
    console.log(pallet)
    console.log(producerList(pallet))
    console.log(varietyList(pallet))
    console.log(calculateGrossSum(pallet))
    console.log('FORMAT_PALLET', formatPallet(pallet))

    addDispatchPallet(formatPallet(pallet))
    setPalletInput('')
    setDispatchWeight('')

  }

  const producerList = (pallet) => {
    const uniqueProducers = new Set()
    pallet.Packs.forEach(pack => {
      const producerName = pack.Reception.Producer.name
      uniqueProducers.add(producerName)
    })
    const uniqueProducersArray = Array.from(uniqueProducers)
    return uniqueProducersArray
  }

  const varietyList = (pallet) => {
    const uniqueVarieties = new Set()
    pallet.Packs.forEach(pack => {
      const varietyName = pack.Reception.Variety.name
      uniqueVarieties.add(varietyName)
    })
    const uniqueVarietiesArray = Array.from(uniqueVarieties)
    return uniqueVarietiesArray
  }

  const calculateGrossSum = (pallet) => {
    let grossSum = 0
    pallet.Packs.forEach(pack => {
      grossSum += pack.gross
    });
    return grossSum
  }

  const formatPallet = (pallet) => ({
    id: pallet.id,
    dispatchWeight: dispatchWeight,
    producerList: producerList(pallet),
    varietyList: varietyList(pallet),
    grossSum: calculateGrossSum(pallet),
    trayName: pallet.Tray.name,
    packs: pallet.Packs,
  })





  return (
    <Grid container>
      <Grid item xs={3}>
        <Grid container direction={'column'} spacing={1}>
          <Grid item>
            <Paper variant={'outlined'}>
              <Typography p={1}>
                Agregar pallet
              </Typography>
              <form onSubmit={(e) => { e.preventDefault(); addPallet() }}>
                <Grid container direction={'column'} p={1}>
                  <Grid item>
                    <TextField
                      label={'Peso Pallet Despacho'}
                      type='number'
                      value={dispatchWeight}
                      onChange={(e) => { setDispatchWeight(e.target.value) }}
                      size='small'
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label={'Pallet id'}
                      type='number'
                      value={palletInput}
                      onChange={(e) => { setPalletInput(e.target.value) }}
                      size='small'
                      required
                      fullWidth
                    />
                  </Grid>

                  <Grid item>
                    <IconButton sx={{ flex: '0 0 auto', marginLeft: 1 }} type='submit'>
                      <LocalShippingIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          <Grid item>
            <Paper variant={'outlined'}>
              <Grid container direction={'column'} p={1}>
                <TextField
                  label={'Cliente'}
                  type='number'
                  value={palletInput}
                  onChange={(e) => { setPalletInput(e.target.value) }}
                  size='small'
                  required
                  fullWidth
                />
              </Grid>
            </Paper>
            <Grid item>
            </Grid>

          </Grid>
        </Grid>
      </Grid>
          <Grid item xs={9}>
            <Paper variant={'outlined'}>
              <Typography p={1}>
                Pallets
              </Typography>

              <Grid container spacing={1} p={1}>
                {dispatch_.pallets.map((pallet) => (
                  <Grid item xs={4} key={pallet.id}>
                    <DispatachPalletCard pallet={pallet} />
                  </Grid>
                ))}
              </Grid>

            </Paper>
          </Grid>
        </Grid>
        )
}


