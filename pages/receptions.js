import React, { useState, useEffect } from 'react'
import ReceptionsGrid from '../components/Grids/ReceptionsGrid/ReceptionsGrid'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { Grid, IconButton, TextField } from '@mui/material'
import moment from 'moment'
import PrintIcon from '@mui/icons-material/Print'
import PrintDialog from '../components/PrintDialog/PrintDialog'
import ReceptionsReportToPrint from '../components/Tabs/ProducerReportsTab/ReceptionsReportToPrint'

const receptions = require('../services/receptions')

export default function otherPage() {
  const [filterDates, setFilterDates] = useState({ start: moment(new Date).format('YYYY-MM-DD'), end: moment(new Date).format('YYYY-MM-DD 23:59') })
  const [receptionsList, setReceptionsList] = useState([])
  const [title, setTitle] = useState('Recepciones')
  const [openPrintDialog, setOpenPrintDialog] = useState(false)
  const [reportData, setReportData] = useState(reportDataDefault())

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
        originalNet: reception.original_net,
        packs: reception.Packs,
        toPay: reception.to_pay,
        open: reception.open,
        settlement: reception.settlement,
        settlementId: reception.settlement_id,
        createdAt: reception.createdAt,
      }))
      setReceptionsList(data)

      const receptionsToPrint = receptionsByDates.map(reception => ({
        id: reception.id,
        producerName: reception.Producer.name,
        producerRut: reception.Producer.rut,
        producerId: reception.Producer.id,
        varietyName: reception.Variety.name,
        traysQuanty: reception.trays_quanty,
        traysWeight: reception.trays_weight,
        impurityWeight: reception.impurity_weight,
        gross: reception.gross,
        net: reception.net,
        toPay: reception.to_pay,
        clp: reception.clp,
        usd: reception.usd,
      }))

      setReportData({
        ...reportData,
        producerName: '',
        producerRut: '',
        start: moment(filterDates.start).format('DD-MM-YYYY'),
        end: moment(filterDates.end).format('DD-MM-YYYY'),
        receptions: receptionsToPrint,

        traysQuanty: receptionsToPrint.reduce((acc, item) => acc + item.traysQuanty, 0),
        traysWeight: receptionsToPrint.reduce((acc, item) => acc + item.traysWeight, 0),
        impurityWeight: receptionsToPrint.reduce((acc, item) => acc + item.impurityWeight, 0),
        gross: receptionsToPrint.reduce((acc, item) => acc + item.gross, 0),
        net: receptionsToPrint.reduce((acc, item) => acc + item.net, 0),
        toPay: receptionsToPrint.reduce((acc, item) => acc + item.toPay, 0),
        clp: receptionsToPrint.reduce((acc, item) => acc + item.clp, 0),
        usd: receptionsToPrint.reduce((acc, item) => acc + item.usd, 0),

      })

      
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
          <Grid item textAlign={'right'}>
              <IconButton
                onClick={() => { setOpenPrintDialog(true) }}
              >
                <PrintIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={10.5}>
          <ReceptionsGrid receptionsList={receptionsList} title={title} />
        </Grid>
      </Grid>

      <PrintDialog
        open={openPrintDialog}
        setOpen={setOpenPrintDialog}
        title={'Reporte de recepciones'}
        dialogWidth={'lg'}
      >
      <ReceptionsReportToPrint reportData={reportData} global={true} />
      </PrintDialog>
    </>
  )
}


function reportDataDefault() {
  return ({
    producerName: '',
    producerRut: '',
    start: '',
    end: '',
    balance: 0,
    receptions: [],
  })
}