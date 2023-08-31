import React, { useState, useEffect } from 'react'
import DataGrid from '../../Karmextron/DataGrid/DataGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoIcon from '@mui/icons-material/Info'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import EditIcon from '@mui/icons-material/Edit'
import { GridActionsCellItem } from '@mui/x-data-grid'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, FormControlLabel,
  Switch, TextField, InputAdornment, Autocomplete, Paper
} from '@mui/material'
import ProducerAccountsGrid from '../ProducerAccountsGrid/ProducerAccountsGrid';



const producers = require('../../../services/producers')
const advances = require('../../../services/advances')
const producerAccounts = require('../../../services/producerAccounts')

export default function ProducersGrid(props) {
  const {update} = props
  const [gridApiRef, setGridApiRef] = useState(null)
  const [prodecersList, setProducersList] = useState([])
  const [rowData, setRowData] = useState(rowDataDefault())
  const [openAccountDialog, setOpenAccountDialog] = useState(false)
  const [advanceData, setAdvanceData] = useState({producerId: 0, amount: 0,  description: ''})
  const [accountsGridState, setAccountsGridState] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const producersData = await producers.findAll()

      let data = producersData.map((producer) => ({
        id: producer.id,
        name: producer.name,
        address: producer.address,
        phone: producer.phone,
        email: producer.email,
        rut: producer.rut,
        accounts: producer.ProducerAccounts
      }))
      setProducersList(data)
    }
    fetchData()
  }, [update])

  const newAdvance = async () => {
    const currentBalance = await producerAccounts.producerAccountBalance(advanceData.producerId)
    const newAdvance = await advances.create(advanceData.producerId, advanceData.amount, advanceData.description)
    await producerAccounts.create(
      advanceData.producerId,
      0,
      advanceData.amount,
      currentBalance - advanceData.amount,
      newAdvance.id,
      1,
      advanceData.description
    )

    setAdvanceData({producerId: rowData.id, amount: 0,  description: ''})
    setAccountsGridState(!accountsGridState)

  }


  const columns = [
    { field: 'id', headerName: 'Id', flex: .5, type: 'number' },
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'rut', headerName: 'Rut', flex: 1 },
    { field: 'phone', headerName: 'Teléfono', flex: 1 },
    { field: 'address', headerName: 'Dirección', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'actions',
      headerName: '',
      headerClassName: 'data-grid-last-column-header',
      type: 'actions', flex: 2, getActions: (params) => [
        <GridActionsCellItem
          label='accounts'
          icon={<AccountBalanceIcon />}
          onClick={() => {
            setRowData({
              rowId: params.id,
              id: params.row.id,
              name: params.row.name,
              rut: params.row.rut,
              phone: params.row.phone,
              address: params.row.address,
              email: params.row.email,
              accounts: params.row.accounts
            })
            setAdvanceData({...advanceData, producerId: params.row.id})
            setOpenAccountDialog(true)
          }}
        />,
      ]

    },
  ]

  return (
    <>
      <DataGrid title='Productores' rows={prodecersList} columns={columns} height='80vh' setGridApiRef={setGridApiRef} />

      <Dialog open={openAccountDialog} maxWidth={'lg'} fullWidth>
        <DialogTitle sx={{ padding: 2 }}> Cuenta Productor</DialogTitle>
        <DialogContent sx={{ padding: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Paper sx={{ padding: 1 }} variant='outlined'>
                <Typography>
                  Nuevo Anticipo
                </Typography>
                <form onSubmit={(e) => {e.preventDefault(); newAdvance(advanceData.producerId)}}>
                <Grid container spacing={1} direction={'column'} paddingTop={1}>
                  <Grid item>
                    <TextField
                      label='Monto'
                      variant='outlined'
                      size='small'
                      type='number'
                      value={advanceData.amount}
                      onChange={(e) => setAdvanceData({ ...advanceData, amount: e.target.value })}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label='Descripción'
                      variant='outlined'
                      size='small'
                      value={advanceData.description}
                      onChange={(e) => setAdvanceData({ ...advanceData, description: e.target.value })}
                      fullWidth
                      rows={4}
                      multiline
                    />
                  </Grid>
                  <Grid item textAlign={'right'}>
                    <Button variant='contained' type={'submit'}>Guardar</Button>
                  </Grid>
                </Grid>
                </form>

              </Paper>

            </Grid>
            <Grid item xs={9}>
              <ProducerAccountsGrid producer={rowData} update={accountsGridState} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button variant='contained' onClick={() => setOpenAccountDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function rowDataDefault() {
  return ({
    id: 0,
    name: '',
    rut: '',
    phone: '',
    address: '',
    email: '',
    accounts: []
  })
}