import { Grid, IconButton, Paper, TextField, Typography, Autocomplete, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '../appProvider'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import DispatachPalletCard from '../components/Cards/DispatchPalletCard/DispatachPalletCard'


const pallets = require('../services/pallets')
const customers = require('../services/customers')
const dispatchs = require('../services/dispatchs')

export default function newDispatch() {
  const {
    openSnack,
    addDispatchPallet,
    dispatch_,
    dispatchCustomer,
    dispatchGuide,
    dispatchClp,
    dispatchUsd,
    dispatchChange,
    dispatchMoney,
    dispatchShowPrices,
    dispatchShowImpurities,
    dispatchShowUsd,
    dispatchGross,
    dispatchNet,
    dispatchToPay,
    dispatchPalletsQuanty,
    dispatchPalletsWeight,
    dispatchPallets,

    setDispatchCustomer,
    setDispatchGuide,
    setDispatchClp,
    setDispatchUsd,
    setDispatchChange,
    setDispatchMoney,
    setDispatchShowPrices,
    setDispatchShowImpurities,
    setDispatchShowUsd,
    setDispatchGross,
    setDispatchNet,
    setDispatchToPay,
    setDispatchPalletsQuanty,
    setDispatchPalletsWeight,
    resetDispatch

  } = useAppContext()
  const [palletInput, setPalletInput] = useState('')
  const [dispatchWeight, setDispatchWeight] = useState('')

  const [customerInput, setCustomerInput] = useState('')
  const [customerOptions, setCustomerOptions] = useState([])

  useEffect(() => {
    const setOptionsCustomer = async () => {
      const customers_ = await customers.findAll()
      let data = customers_.map(customer => ({ id: customer.id, key: customer.id, label: customer.name }))
      setCustomerOptions(data)
    }
    setOptionsCustomer()

  }, [])

  useEffect(() => {
    let grossSum = 0
    let netSum = 0
    dispatch_.pallets.forEach(pallet => {
      grossSum += pallet.dispatchWeight
      netSum += pallet.dipatchNetSum
    })
    setDispatchGross(grossSum)
    setDispatchNet(netSum)

  }, [dispatchPallets])



  const addPallet = async () => {
    const pallet = await pallets.findOneById(palletInput)
    if (pallet.dispatch) {
      openSnack('Pallet ya despachado', 'error')
    } else {
      console.log('FORMAT_PALLET', formatPallet(pallet))

      addDispatchPallet(formatPallet(pallet))
      setPalletInput('')
      setDispatchWeight('')

    }


  }

  const producerList = (pallet) => { // PALLET
    const uniqueProducers = new Set()
    pallet.Packs.forEach(pack => {
      const producerName = pack.Reception.Producer.name
      uniqueProducers.add(producerName)
    })
    const uniqueProducersArray = Array.from(uniqueProducers)
    return uniqueProducersArray
  }

  const varietyList = (pallet) => { // PALLET
    const uniqueVarieties = new Set()
    pallet.Packs.forEach(pack => {
      const varietyName = pack.Reception.Variety.name
      uniqueVarieties.add(varietyName)
    })
    const uniqueVarietiesArray = Array.from(uniqueVarieties)
    return uniqueVarietiesArray
  }

  const calculateBeforeGrossSum = (pallet) => { // PALLET
    let grossSum = 0
    pallet.Packs.forEach(pack => {
      grossSum += pack.gross
    })
    grossSum = grossSum + pallet.weight

    return grossSum
  }

  const calculateDisptachNetSum = (pallet) => { // PALLET
    let traysWeight = 0
    pallet.Packs.forEach(pack => {
      traysWeight += pack.trays_weight
    })

    return dispatchWeight - (pallet.weight + traysWeight)


  }

  const claculateBeforeNetSum = (pallet) => { // PALLET
    let netSum = 0
    pallet.Packs.forEach(pack => {
      netSum += pack.net
    })
    return netSum
  }

  const calculateTraysWeight = (pallet) => { // PALLET
    let traysWeight = 0
    pallet.Packs.forEach(pack => {
      traysWeight += pack.trays_weight
    })
    return traysWeight
  }

  const formatPallet = (pallet) => ({ // PALLET
    id: pallet.id,
    weight: pallet.weight,
    dispatchWeight: parseInt(dispatchWeight),
    dipatchNetSum: calculateDisptachNetSum(pallet),
    producerList: producerList(pallet),
    varietyList: varietyList(pallet),
    beforeGrossSum: calculateBeforeGrossSum(pallet),
    beforeNetSum: claculateBeforeNetSum(pallet),
    traysWeight: calculateTraysWeight(pallet),
    trayName: pallet.Tray.name,
    packs: pallet.Packs,
  })

  const saveDispatch = async () => {
    const newDispatch = await dispatchs.create(
      dispatchCustomer.id,
      dispatchGuide,
      dispatchClp,
      dispatchUsd,
      dispatchChange,
      dispatchMoney,
      dispatchPalletsQuanty,
      dispatchPalletsWeight,
      0,
      dispatchGross,
      dispatchNet,
      dispatchToPay,
      true
    )

    dispatchPallets.forEach(async (pallet) => {
      const updateDispatch = await pallets.updateDisptach(pallet.id, newDispatch.id)
      console.log('UPDATE_DISPATCH', updateDispatch)
    })

    resetDispatch()

  }


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
              <Typography p={1}>
                Datos despacho
              </Typography>
              <form onSubmit={(e) => { e.preventDefault(); saveDispatch() }}>
                <Grid container direction={'column'} p={1}>
                  <Grid item>

                    <Autocomplete
                      sx={{ flex: '1' }}
                      inputValue={customerInput}
                      onInputChange={(e, newInputValue) => {
                        setCustomerInput(newInputValue)
                      }}
                      isOptionEqualToValue={(option, value) => null || option.id === value.id}
                      value={dispatchCustomer}
                      onChange={(e, newValue) => {
                        setDispatchCustomer(newValue)
                      }}
                      disablePortal
                      options={customerOptions}
                      renderInput={(params) => <TextField {...params} label='Cliente' size={'small'} fullWidth required />}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label={'Guia'}
                      value={dispatchGuide}
                      onChange={(e) => { setDispatchGuide(e.target.value) }}
                      size='small'
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label={'Bruto'}
                      value={dispatchGross}
                      inputProps={{ readOnly: true }}
                      size='small'
                      fullWidth
                    />
                  </Grid>
                  {/* <Grid item>
                  <TextField
                    label={'Peso Pallets'}
                    value={dispatchPalletsWeight}
                    inputProps={{ readOnly: true }}
                    size='small'
                    fullWidth
                  />
                  
                </Grid> */}
                  <Grid item>

                  </Grid>

                  <Grid item>
                    <TextField
                      label={'Neto'}
                      value={dispatchNet}
                      inputProps={{ readOnly: true }}
                      size='small'
                      fullWidth
                    />
                  </Grid>

                  <Grid item>
                    <Button variant='contained' type={'submit'}> guardar </Button>
                  </Grid>
                </Grid>
              </form>

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


