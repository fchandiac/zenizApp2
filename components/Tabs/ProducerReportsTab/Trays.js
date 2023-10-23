import React, { useState, useEffect } from 'react'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { Grid, IconButton, TextField, Autocomplete } from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import moment from 'moment'
import PrintDialog from '../../PrintDialog/PrintDialog'
import { fi } from 'date-fns/locale'
import ProducerTraysGrid from '../../Grids/ProducerTraysGrid/ProducerTraysGrid'
import TraysReportToPrint from './TraysReportToPrint'



const producers = require('../../../services/producers')
const traysMovements = require('../../../services/traysMovements')
const trays = require('../../../services/trays')

export default function Trays(props) {
  const { producerId } = props
  const [filterDates, setFilterDates] = useState({ start: moment(new Date).format('YYYY-MM-DD'), end: moment(new Date).format('YYYY-MM-DD 23:59') })
  const [title, setTitle] = useState('Bandejas')
  const [reportData, setReportData] = useState(reportDataDefault())
  const [openPrintDialog, setOpenPrintDialog] = useState(false)
  const [trayInput, setTrayInput] = useState('')
  const [traysOptions, setTraysOptions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const traysData = await trays.findAll()
      const traysOptions = traysData.map(tray => ({
        id: tray.id,
        key: tray.id,
        label: tray.name,
      }))
      setTraysOptions(traysOptions)

    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const movs = await traysMovements.findAllByProducerByTray(reportData.tray.id, producerId)
      let filterMovs = movs.filter(mov => (mov.type == 3 || mov.type == 2))
      let balance = 0

      console.log('Balance', balance )

      filterMovs.reverse()

      filterMovs.map(mov => {
        if (mov.type == 2) {
          mov.quanty = mov.quanty * -1
        }
        mov.balance = 0
        let movBalance = balance + mov.quanty
        balance = movBalance
        mov.balance = movBalance
        mov.trayName = mov.Tray.name
      })

      filterMovs.reverse()

      const producer = await producers.findOneById(producerId)
      console.log('Movs', filterMovs)

      setReportData({ ...reportData, 
        movements: filterMovs,
        producerName: producer.name,
        producerRut: producer.rut,
        balance: balance,
       })
    
    }
    fetchData()
  }, [reportData.tray ])



  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          {/* <Grid item>
            <DesktopDatePicker
              label="Fecha incial"
              inputFormat='DD-MM-YYYY'
              value={filterDates.start}
              onChange={(e) => {
                console.log(e)
                setFilterDates({ ...filterDates, start: e })
              }}
              renderInput={(params) => <TextField {...params} size={'small'} fullWidth />}
            />
          </Grid>
          <Grid item>
            <DesktopDatePicker
              label="Fecha final"
              inputFormat='DD-MM-YYYY'
              value={filterDates.end}
              onChange={(e) => { setFilterDates({ ...filterDates, end: e }) }}
              renderInput={(params) => <TextField {...params} size={'small'} fullWidth />}
            />
          </Grid> */}
          <Grid item>
            <Autocomplete
              inputValue={trayInput}
              onInputChange={(e, newInputValue) => {
                setTrayInput(newInputValue)
              }}
              value={reportData.tray}
              onChange={(e, newValue) => {
                setReportData({ ...reportData, tray: newValue })

              }}
              getOptionLabel={(option) => option.label}
              options={traysOptions}
              renderInput={(params) => <TextField {...params} label='Bandeja' size={'small'} fullWidth />}
            />
          </Grid>
          <Grid item textAlign={'right'}>
            <IconButton
              onClick={() => { setOpenPrintDialog(true)}}
            >
              <PrintIcon />
            </IconButton>

          </Grid>
        </Grid>
        <Grid item xs={9}>
              <ProducerTraysGrid movs= {reportData.movements} 
              title={'Movimientos bandeja ' + reportData.tray.label} 
              />

        </Grid>
      </Grid>

      <PrintDialog
        open={openPrintDialog}
        setOpen={setOpenPrintDialog}
        title={'Reporte Bandejas'}
        maxWidth={'lg'}
      >
       <TraysReportToPrint reportData={reportData} />
      </PrintDialog>
    </>
  )
}


function reportDataDefault() {
  return ({
    tray: {id:0, key: 0, label: ''},
    producerName: '',
    producerRut: '',
    balance: 0,
    movements: [],
  })
}