import { Grid } from '@mui/material'
import React from 'react'
import NewProducerForm from '../components/Forms/NewProducerForm/NewProducerForm'

export default function producers() {
  return (
    <>
    <Grid container spacing={1}>
        <Grid item xs={3} >
            <NewProducerForm />
        </Grid>
        <Grid item xs={8}>
            <h1>Producers</h1>
        </Grid>
    </Grid>

    </>
  )
}
