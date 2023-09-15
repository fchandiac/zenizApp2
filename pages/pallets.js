// import React from 'react'
// import PalletsTab from '../components/Tabs/PalletsTab/PalletsTab'

// export default function pallets() {
//   return (
//    <PalletsTab />
//   )
// }

import { Grid, Paper, Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import PalletsGrid from '../components/Grids/PalletsGrid'
import NewPalletForm from '../components/Forms/NewPalletForm/NewPalletForm'
import StoragesTable from '../components/Tables/StoragesTable/StoragesTable'

const storages = require('../services/storages')

export default function Pallets() {
  const [palletData, setPalletData] = useState(palletDataDefault())
  const [updateGrid, setUpdateGrid] = useState(false)
  const [storagesList, setStoragesList] = useState([])




  const updateGrid_ = () => {
    setUpdateGrid(!updateGrid)
  }

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Grid container spacing={1} direction={'column'}>
            <Grid item>
              <Paper variant='outlined'>
                <NewPalletForm
                  dialog={false}
                  closeDialog={() => { }}
                  palletData={palletData}
                  setPalletData={setPalletData}
                  afterSubmit={() => {
                    setPalletData(palletDataDefault())
                    updateGrid_()
                  }}
                />
              </Paper>
            </Grid>
            <Grid item>
              <Paper variant='outlined' >
                <Grid container spacing={1} direction={'column'}>
                  <Grid item>

                <StoragesTable />
                  </Grid>
                </Grid>



              </Paper>
            </Grid>
          </Grid>

        </Grid>
        <Grid item xs={10}>
          <PalletsGrid update={updateGrid} />
        </Grid>
      </Grid>

    </>
  )
}


function palletDataDefault() {
  return ({
    storage: { id: 0, key: 0, label: '' },
    tray: { id: 0, key: 0, label: '' },
    weight: '',
    max: 0,
  })
}