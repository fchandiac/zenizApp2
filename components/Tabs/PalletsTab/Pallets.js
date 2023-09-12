import { Grid } from '@mui/material'
import React, {useState} from 'react'
import PalletsGrid from '../../Grids/PalletsGrid'
import NewPalletForm from '../../Forms/NewPalletForm/NewPalletForm'

const storages = require('../../../services/storages')

export default function Pallets() {
  const [palletData, setPalletData] = useState(palletDataDefault())
  const [updateGrid, setUpdateGrid] = useState(false)

  const updateGrid_ = () => {
    setUpdateGrid(!updateGrid)
  }

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={2}>
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
        </Grid>
        <Grid item xs={10}>
          <PalletsGrid update={updateGrid}/>
        </Grid>
      </Grid>

    </>
  )
}


function palletDataDefault() {
  return ({
      storage: { id: 0, key: 0, label: '' },
      tray: { id: 0, key: 0, label: '' },
      weight: ''
  })
}