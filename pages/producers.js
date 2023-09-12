import { Box, Grid, Paper, TextField } from '@mui/material'
import React, { useState } from 'react'
import NewProducerForm from '../components/Forms/ProducerForm/ProducerForm'
import ProducersGrid from '../components/Grids/ProducersGrid/ProducersGrid'
import ProducersTab from '../components/Tabs/PrducerTab'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'

export default function producers() {
  const [updateGrid, setUpdateGrid] = useState(false)
  const [producerData, setProducerData] = useState(producerDataDefault())

  const updateGrid_ = () => {
    setUpdateGrid(!updateGrid)
  }


  return (
    <>
    <ProducersTab 
      producers={( <Grid container spacing={1}>
        <Grid item xs={3}>
          <Paper variant={'outlined'}>
            <Box paddingLeft={2} paddingTop={2}>
              Nuevo Productor
            </Box>
            <NewProducerForm afterSubmit={updateGrid_} producerData={producerData} setProducerData={setProducerData}/>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <ProducersGrid update={updateGrid} />
        </Grid>
      </Grid>)}
    />
  
     
    </>
  )
}
function producerDataDefault() {
  return {
    name: '',
    rut: '',
    phone: '',
    mail: '',
    address: ''
  }
}