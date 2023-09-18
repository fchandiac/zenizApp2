import React, { useState, useEffect } from 'react'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { Grid, TextField, Autocomplete, Paper, Select, MenuItem, FormControl, InputLabel, Box, InputAdornment, Button } from '@mui/material'
import moment from 'moment'
import { set } from 'date-fns'
import TraysMovementsGrid from '../../Grids/TraysMovementsGrid/TraysMovementsGrid'


const trays = require('../../../services/trays')
const traysMovements = require('../../../services/traysMovements')

export default function Movements() {
  const [filterDates, setFilterDates] = useState({ start: moment(new Date).format('YYYY-MM-DD'), end: moment(new Date).format('YYYY-MM-DD 23:59') })
  const [trayInput, setTrayInput] = useState('')
  const [trayInput2, setTrayInput2] = useState('')
  const [traysOptions, setTraysOptions] = useState([])
  const [tray, setTray] = useState({ id: 0, key: 0, label: '' })
  const [movementData, setMovementData] = useState(movementDataDefault())
  const [movementsList, setMovementsList] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      const traysList = await trays.findAll()
      let data = traysList.map(tray => ({
        id: tray.id,
        label: tray.name,
        key: tray.id
      }))
      setTraysOptions(data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const movs = await traysMovements.findAllByTrayBetweenDate(tray.id, filterDates.start, filterDates.end)
      console.log(movs)

      let data = movs.map(mov => ({
        id: mov.id,
        trayId: mov.tray_id,
        trayName: mov.Tray.name,
        producer: mov.Producer == null ? {} : mov.Producer,
        producerName: mov.Producer == null ? '' : mov.Producer.name,
        reception: mov.Reception == null ? {} : mov.Reception,
        receptionId: mov.reception_id == null ? '' : mov.reception_id,
        quanty: mov.quanty,
        type: mov.type,
        balance: mov.balance,
        description: mov.description,
        createdAt: mov.createdAt
      }))
      setMovementsList(data)
    }
    fetchData()
  }, [tray, filterDates])

  const newMovement = async () => {
    const tray = await trays.findOneById(movementData.tray.id)
    let currentBalance = tray == null ? 0 : tray.stock
    if (movementData.type === 0) {
      currentBalance = tray.stock + parseInt(movementData.amount)
    } else if (movementData.type === 1) {
      currentBalance = tray.stock - parseInt(movementData.amount)
    }
    const newMov = await traysMovements.create(movementData.tray.id, null, null, movementData.amount, movementData.type, currentBalance, movementData.description)
    await trays.updateStock(movementData.tray.id, currentBalance)



    setTray({ id: movementData.tray.id, key: movementData.tray.id, label: movementData.tray.label })
    setFilterDates({ start: moment(new Date).format('YYYY-MM-DD'), end: moment(new Date).format('YYYY-MM-DD 23:59') })
    setMovementData(movementDataDefault())
  }



  return (
    <>
      <Grid spacing={1} container>
        <Grid item xs={3}>
          <Grid container spacing={1} direction={'column'}>
            <Grid item>
              <Paper variant='outlined'>
                <Box p={1}>
                  Filtro fecha / bandeja
                </Box>
                <Grid container spacing={1} direction={'column'} p={1}>
                  <Grid item>
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
                  </Grid>
                  <Grid item>
                    <Autocomplete
                      inputValue={trayInput}
                      onInputChange={(e, newInputValue) => {
                        setTrayInput(newInputValue)
                      }}
                      value={tray}
                      onChange={(e, newValue) => {
                        setTray(newValue)

                      }}
                      getOptionLabel={(option) => option.label}
                      options={traysOptions}
                      renderInput={(params) => <TextField {...params} label='Bandeja' size={'small'} fullWidth />}
                    />
                  </Grid>
                </Grid>
              </Paper>

            </Grid>


            <Grid item>
              <Paper variant='outlined'>
                <Box p={1}>
                  Nuevo Movimiento
                </Box>
                <form onSubmit={(e) => { e.preventDefault(); newMovement() }}>
                  <Grid container spacing={1} direction={'column'} p={1}>
                    <Grid item>
                      <FormControl fullWidth size='small' required sx={{ minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-label">Tipo Movimiento</InputLabel>
                        <Select
                          sx={{ padding: 0, margin: 0 }}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={movementData.type}
                          label="Tipo Movimiento"
                          onChange={(e) => setMovementData({ ...movementData, type: e.target.value })}
                        >
                          <MenuItem value={0}>Ingreso</MenuItem>
                          <MenuItem value={1}>Egreso</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        size='small'
                        label='Cantidad'
                        type='number'
                        value={movementData.amount}
                        onChange={(e) => setMovementData({ ...movementData, amount: e.target.value })}
                        required
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        size='small'
                        label='Nota'
                        value={movementData.description}
                        onChange={(e) => setMovementData({ ...movementData, description: e.target.value })}
                        multiline
                        rows={4}
                      />
                    </Grid>
                    <Grid item>
                      <Autocomplete
                        inputValue={trayInput2}
                        onInputChange={(e, newInputValue) => {
                          setTrayInput2(newInputValue)
                        }}
                        value={tray}
                        onChange={(e, newValue) => {
                          setMovementData({ ...movementData, tray: newValue })

                        }}
                        getOptionLabel={(option) => option.label}
                        options={traysOptions}
                        renderInput={(params) => <TextField {...params} label='Bandeja' size={'small'} fullWidth />}
                      />
                    </Grid>
                    <Grid item textAlign={'right'}>
                      <Button variant='contained' type='submit'>Guardar</Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>


            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <TraysMovementsGrid traysMovementsList={movementsList} />
        </Grid>
      </Grid>
    </>
  )
}


function movementDataDefault() {
  return ({
    tray: { id: 0, key: 0, label: '' },
    amount: 0,
    type: 0,
    description: ''

  })
}