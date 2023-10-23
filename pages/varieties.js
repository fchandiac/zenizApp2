import React, { useState } from 'react'
import { Box, Grid, Paper } from '@mui/material'
import VarietyForm from '../components/Forms/VarietyForm/VarietyForm'
import VarietyGrid from '../components/Grids/VarietyGrid/VarietyGrid'


export default function varieties() {
  const [updateGrid, setUpdateGrid] = useState(false)
  const [varietyData, setVarietyData] = useState(varietyDataDefault())

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
            <VarietyForm 
            afterSubmit={updateGrid_} 
            varietyData={varietyData} 
            setVarietyData={setVarietyData} 
            />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <VarietyGrid update={updateGrid} />
        </Grid>
      </Grid>
    </>
  )
}


function varietyDataDefault() {
  return ({
    id: 0,
    name: '',
    clp: 0,
    usd: 0,
    money: 'CLP',
    moneySwitch: false

  })
}