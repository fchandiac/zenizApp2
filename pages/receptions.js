import React, { useState, useEffect } from 'react'
import ReceptionsGrid from '../components/Grids/ReceptionsGrid/ReceptionsGrid'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { Grid, TextField } from '@mui/material'
import moment from 'moment'

const receptions = require('../services/receptions')

export default function otherPage() {
  const [filterDates, setFilterDates] = useState({ start: moment(new Date).format('YYYY-MM-DD'), end: moment(new Date).format('YYYY-MM-DD 23:59') })
  const [receptionsList, setReceptionsList] = useState([])
  const [title, setTitle] = useState('Recepciones')

  useEffect(() => {
    const fetchData = async () => {
      const receptionsByDates = await receptions.findAllBetweenDates(filterDates.start, filterDates.end)
      console.log(receptionsByDates)
      let data = receptionsByDates.map(reception => ({
        id: reception.id,
        producerName: reception.Producer.name,
        producerRut: reception.Producer.rut,
        producerId: reception.Producer.id,
        varietyName: reception.Variety.name,
        variety: {id: reception.Variety.id, key: reception.Variety.id, label: reception.Variety.name},
        typeName: reception.Type.name,
        type: {id: reception.Type.id, key: reception.Type.id, label: reception.Type.name},
        guide: reception.guide,
        clp: reception.clp,
        usd: reception.usd,
        change: reception.change,
        money: reception.money,
        traysQuanty: reception.trays_quanty,
        traysWeight: reception.trays_weight,
        impurityWeight: reception.impurity_weight,
        gross: reception.gross,
        net: reception.net,
        packs: reception.Packs,
        toPay: reception.to_pay,
        open: reception.open,
        settlement: reception.settlement,
        settlementId: reception.settlement_id
      }))
      setReceptionsList(data)
    }
    fetchData()
    if (moment(filterDates.start).format('DD-MM-YYYY') == moment(filterDates.end).format('DD-MM-YYYY')) {
      setTitle('Recepciones ' + moment(filterDates.start).format('DD-MM-YYYY'))
    } else {
      setTitle('Recepciones del ' + moment(filterDates.start).format('DD-MM-YYYY') + ' al ' + moment(filterDates.end).format('DD-MM-YYYY'))
    }

  }, [filterDates])


  return (
    <>
      <Grid container spacing={1} >
        <Grid item xs={1.5}>
          <Grid container spacing={1} direction='column'>
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
          <ReceptionsGrid receptionsList={receptionsList} title={title} />
        </Grid>
      </Grid>
    </>
  )
}
