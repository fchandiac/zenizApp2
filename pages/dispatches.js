import React, {useState, useEffect} from 'react'
import { Grid, TextField } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'

import DispatchsGrid from '../components/Grids/DispatchsGrid/DispatchsGrid'
import moment from 'moment'

const dispatchs = require('../services/dispatchs')

export default function dispatches() {
  const [filterDates, setFilterDates] = useState({ start: moment(new Date).format('YYYY-MM-DD'), end: moment(new Date).format('YYYY-MM-DD 23:59') })
  const [dispatchesList, setDispatchesList] = useState([])
  const [title, setTitle] = useState('Recepciones')

  useEffect(() => {
    const fetchData = async () => {
      const dispatchesList = await dispatchs.findAllBetweenDate(filterDates.start, filterDates.end)
      console.log(dispatchesList)
      let data = dispatchesList.map(dispatch => ({
        id: dispatch.id,
        customerName: dispatch.Customer.name,
        customerRut: dispatch.Customer.rut,
        customerId: dispatch.Customer.id,
        customer: dispatch.Customer,
        guide: dispatch.guide,
        clp: dispatch.clp,
        usd: dispatch.usd,
        change: dispatch.change,
        money: dispatch.money,
        palletsQuanty: dispatch.pallets_quanty,
        palletsWeight: dispatch.pallets_weight,
        impurityWeight: dispatch.impurity_weight,
        gross: dispatch.gross,
        net: dispatch.net,
        toPay: dispatch.to_pay,
        open: dispatch.open,
    }))
      setDispatchesList(data)
      console.log(data)
    }
    fetchData()

  }, [filterDates])
  
  return (
    <>
  
      <Grid container spacing={1}>
      
        <Grid item xs={1.5}>
          <Grid container direction="column" spacing={1}>
          <Grid item fontSize={12}>
            <DesktopDatePicker
              className='small-date-picker'
              label="Fecha incial"
              inputFormat='DD-MM-YYYY'
              value={filterDates.start}
              onChange={(e) => {
                console.log(e)
                setFilterDates({ ...filterDates, start: e })
              }}
              renderInput={(params) => <TextField 
                {...params} 
                size="small"
                fullWidth
                />}
            />
          </Grid>
          <Grid item>
            <DesktopDatePicker
            className='small-date-picker'
              label="Fecha final"
              inputFormat='DD-MM-YYYY'
              value={filterDates.end}
              onChange={(e) => { setFilterDates({ ...filterDates, end: e }) }}
              renderInput={(params) => <TextField {...params} size={'small'} fullWidth />}
            />
          </Grid>
          </Grid>
        </Grid>
        <Grid item xs={10.5}>
        <DispatchsGrid dispatchsList={dispatchesList}/>

        </Grid>
      </Grid>
    </>
      
   
  )
}
