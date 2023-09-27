import {
  Grid, IconButton, Paper, TextField, Typography, Autocomplete, Button, Box,
  Stack, Switch, InputAdornment
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '../appProvider'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import DispatachPalletCard from '../components/Cards/DispatchPalletCard/DispatachPalletCard'
import { set } from 'date-fns'


const pallets = require('../services/pallets')
const customers = require('../services/customers')
const dispatchs = require('../services/dispatchs')
const customerAccounts = require('../services/customerAccounts')

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
    removeDisptachPallet,

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
    setDispatchToPay(netSum * dispatchClp)

  }, [dispatchPallets])



  const addPallet = async () => {
    const pallet = await pallets.findOneById(palletInput)

    if (pallet !== null) {
      if (pallet.dispatch) {
        openSnack('Pallet ya despachado', 'error')
      } else {
        addDispatchPallet(formatPallet(pallet))
        setPalletInput('')
        setDispatchWeight('')
      }
    } else {
      openSnack('Pallet no encontrado', 'error')
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

  const calculteDecrease = (pallet) => {
    let dispatchNetSum = calculateDisptachNetSum(pallet)
    let beforeNetSum = claculateBeforeNetSum(pallet)

    let decrease = beforeNetSum - dispatchNetSum
    let decreasePercent = (decrease / beforeNetSum) * 100
    return { weight: decrease, percent: decreasePercent }
  }


  const formatPallet = (pallet) => ({ // PALLET
    id: pallet.id,
    weight: pallet.weight,
    dispatchWeight: parseFloat(dispatchWeight),
    dipatchNetSum: calculateDisptachNetSum(pallet),
    producerList: producerList(pallet),
    varietyList: varietyList(pallet),
    beforeGrossSum: calculateBeforeGrossSum(pallet),
    beforeNetSum: claculateBeforeNetSum(pallet),
    traysWeight: calculateTraysWeight(pallet),
    trayName: pallet.Tray.name,
    packs: pallet.Packs,
    decrease: calculteDecrease(pallet).weight,
    decreasePercent: calculteDecrease(pallet).percent
  })


  const saveDispatch = async () => {
    console.log('NEW_DISPATCH', dispatch_)
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

    let packs = []


    dispatchPallets.forEach(async (pallet) => {
      packs.push(pallet.packs)

      const updateDispatch = await pallets.updateDisptach(
        pallet.id,
        newDispatch.id,
        pallet.beforeGrossSum,
        pallet.decrease
      )
      console.log('UPDATE_DISPATCH', updateDispatch)
    })





    resetDispatch()

  }

  const calcPrice = (clp, usd, change) => {
    let result = 0

    if (usd) {
      result = usd * change
    } else {
      result = clp
    }
    console.log('result', result)
    setDispatchToPay(result)
    setDispatchUsd(usd)
    setDispatchChange(change)
  }


  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <Grid container direction={'column'} spacing={1}>
          <Grid item>
            <Paper variant={'outlined'}>
              <Typography p={1}>
                Agregar pallet
              </Typography>
              <form onSubmit={(e) => { e.preventDefault(); addPallet() }}>
                <Grid container direction={'column'} p={1} spacing={1}>
                  <Grid item>
                    <TextField
                      label={'Peso Pallet Despacho'}
                      type='number'
                      value={dispatchWeight}
                      onChange={(e) => { setDispatchWeight(e.target.value) }}
                      size='small'
                      required
                      fullWidth
                      InputProps={{
                        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                      }}
                      inputProps={{step: 0.1}}
                    />
                  </Grid>
                  <Grid item>
                    <Box sx={{ display: 'flex' }}>
                      <TextField
                        label={'Pallet id'}
                        type='number'
                        value={palletInput}
                        onChange={(e) => { setPalletInput(e.target.value) }}
                        size='small'
                        required
                        fullWidth
                      />
                      <IconButton sx={{ flex: '0 0 auto', marginLeft: 1 }} type='submit'>
                        <LocalShippingIcon />
                      </IconButton>
                    </Box>
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
                <Grid container direction={'column'} p={1} spacing={1}>
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
                    <Stack direction="row" spacing={1} justifyContent={'flex-end'}>
                      <Typography fontSize={11} sx={{ display: 'flex', alignItems: 'center' }}>CLP</Typography>
                      <Switch
                        checked={dispatchShowUsd}
                        onChange={(e) => {
                          setDispatchShowUsd(e.target.checked)
                          e.target.checked ? setDispatchMoney('USD') : setDispatchMoney('CLP')
                        }}
                        color={'success'}
                        size={'small'} />
                      <Typography fontSize={11} sx={{ display: 'flex', alignItems: 'center' }}>USD</Typography>
                    </Stack>
                  </Grid>
                  <Grid item display={dispatchShowUsd ? 'none' : 'inline-block'}>
                    <TextField
                      label='Precio'
                      value={dispatchClp}
                      onChange={(e) => { setDispatchClp(e.target.value) }}
                      variant="outlined"
                      type='number'
                      size={'small'}
                      fullWidth
                      autoFocus
                      className='no-spin'
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        endAdornment: <InputAdornment position="end">CLP</InputAdornment>,
                      }}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item display={dispatchShowUsd ? 'inline-block' : 'none'}>
                    <TextField
                      label='USD'
                      value={dispatchUsd}
                      type='number'
                      onChange={(e) => { calcPrice(dispatchClp, e.target.value, dispatchChange) }}
                      variant="outlined"
                      className='no-spin'
                      size={'small'}
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        endAdornment: <InputAdornment position="end">USD</InputAdornment>,

                      }}
                      inputProps={{ min: 0 }}

                    />
                  </Grid>
                  <Grid item display={dispatchShowUsd ? 'inline-block' : 'none'}>
                    <TextField
                      label='Cambio'
                      value={dispatchChange}
                      type='number'
                      // calcPrice(receptionClp, e.target.value, receptionChange, receptionMoney)
                      onChange={(e) => { calcPrice(dispatchClp, dispatchUsd, e.target.value) }}
                      variant="outlined"
                      size={'small'}
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        endAdornment: <InputAdornment position="end">CLP</InputAdornment>,
                      }}
                      inputProps={{ min: 0 }}

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
      <Grid item xs={9} display={dispatchPalletsQuanty > 0 ? 'block' : ' none'}>
        <Paper variant={'outlined'}>
          <Typography p={1}>
            Pallets
          </Typography>

          <Grid container spacing={1} p={1} >
            {dispatchPallets.map((pallet) => (
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


