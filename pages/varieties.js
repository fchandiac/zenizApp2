import React, { useState } from 'react'
import { Box, Grid, Paper } from '@mui/material'
import NewVarietyForm from '../components/Forms/NewVarietyForm/NewVarietyForm'
import VarietyGrid from '../components/Grids/VarietyGrid/VarietyGrid'


export default function varieties() {
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
              Nueva Variedad
            </Box>
            <NewVarietyForm afterSubmit={updateGrid_} />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <VarietyGrid update={updateGrid} />
        </Grid>
      </Grid>
    </>
  )
}
