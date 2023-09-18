import { Grid, Paper, Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CustomerForm from '../components/Forms/CustomerForm/CustomerForm'
import CustomersGrid from '../components/Grids/CustomersGrid/CustomersGrid'


export default function customer() {
  const [customerData, setCustomerData] = useState(customerDataDefault())
  const [updateGrid, setUpdateGrid] = useState(false)

  const updateGrid_ = () => {
    setUpdateGrid(!updateGrid)
  }
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={3} >
          <Paper variant='outlined'>
            <Box p={1}>
              Nuevo cliente
            </Box>
         
            <CustomerForm
              customerData={customerData}
              setCustomerData={setCustomerData}
              afterSubmit={() => {
                setCustomerData(customerDataDefault())
                updateGrid_()
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <CustomersGrid update={updateGrid} />
        </Grid>
      </Grid>

    </>
  )
}

function customerDataDefault() {
  return ({
    name: '',
    rut: '',
    phone: '',
    mail: '',
    address: '',
  })
}
