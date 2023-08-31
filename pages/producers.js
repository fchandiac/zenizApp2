import { Box, Grid, Paper } from '@mui/material'
import React, { useState } from 'react'
import NewProducerForm from '../components/Forms/NewProducerForm/NewProducerForm'
import ProducersGrid from '../components/Grids/ProducersGrid/ProducersGrid'

export default function producers() {
  const [updateGrid, setUpdateGrid] = useState(false)

  const updateGrid_ = () => {
    setUpdateGrid(!updateGrid)
  }


  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Paper variant={'outlined'}>
            <Box paddingLeft={2} paddingTop={2}>
              Nuevo Productor
            </Box>
            <NewProducerForm afterSubmit={updateGrid_} />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <ProducersGrid update={updateGrid} />
        </Grid>
      </Grid>
    </>
  )
}
