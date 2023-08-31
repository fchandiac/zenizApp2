import React, {useState} from 'react'
import { Box, Grid, Paper } from '@mui/material'
import TypesGrid from '../components/Grids/TypesGrid/TypesGrid'
import NewTypesForm from '../components/Forms/NewTypesForm/NewTypesForm'

export default function types() {
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
              Nueva tipo de fruta
            </Box>
            <NewTypesForm afterSubmit={updateGrid_} />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <TypesGrid update={updateGrid} />
      </Grid>
      </Grid>
    </>
  )
}
