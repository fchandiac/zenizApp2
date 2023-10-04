import React, { useEffect, useState } from 'react'
import DataGrid from '../../Karmextron/DataGrid/DataGrid'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PrintIcon from '@mui/icons-material/Print'
import { GridActionsCellItem } from '@mui/x-data-grid'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, FormControlLabel,
  Switch, TextField, InputAdornment
} from '@mui/material'
import InfoDataGrid from './InfoDataGrid'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { useAppContext } from '../../../appProvider'
import PrintDialog from '../../PrintDialog/PrintDialog'
import DistpatchToPrint from './DistpatchToPrint'
import { set } from 'date-fns'



const dispatchs = require('../../../services/dispatchs')
const customerAccounts = require('../../../services/customerAccounts')

export default function DispatchsGrid(props) {
  const { dispatchsList } = props
  const { openSnack, user } = useAppContext()
  const [gridApiRef, setGridApiRef] = useState(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [rowData, setRowData] = useState(rowDataDefault())
  const [showUsd, setShowUsd] = useState(false)
  const [openPrintDialog, setOpenPrintDialog] = useState(false)


  const closeDispatch = async (id, customerId, toPay) => {
    if (toPay === 0) {
      openSnack('El precio en pesos no esta asignado ', 'error')
      return
    } else {
      await dispatchs.close(id)

      const lastMovement = await customerAccounts.findLastByCustomerId(customerId)
      console.log(lastMovement)

      let newBalance = 0
      if (lastMovement == null) {
        newBalance = toPay
      } else {
        newBalance = lastMovement.balance + toPay
      }

      await customerAccounts.create(customerId, toPay, 0, newBalance, id, 0, 'Cierre de despacho')
      gridApiRef.current.updateRows([{
        id: rowData.rowId,
        open: false
      }])
    }
  }

  const calcPrice = (clp, usd, change) => {
    let result = 0
    let toPay = 0

    console.log('clp, usd, change', clp, usd, change)

    if (usd > 1) {
      result = usd * change
    } else {
      result = clp
    }

    if (result > 0) {
      toPay = result * rowData.net
    }

    setRowData({ ...rowData, clp: result, usd: usd, change: change, toPay: toPay })
  }


  const updateDispatch = async () => {

    console.log('rowData', rowData)
    await dispatchs.update(rowData.id, rowData.clp, rowData.usd, rowData.change, rowData.money, rowData.impurityWeight, rowData.toPay, rowData.net, rowData.gross)
    gridApiRef.current.updateRows([{
      id: rowData.rowId,
      clp: rowData.clp,
      usd: rowData.usd,
      change: rowData.change,
      money: rowData.money,
      impurityWeight: rowData.impurityWeight,
      toPay: rowData.toPay,
      net: rowData.net,
      gross: rowData.gross
    }])
    setOpenEditDialog(false)
  }



  const columns = [
    {
      field: 'id', headerName: 'Id', flex: .5, type: 'number', headerClassName: 'row-header-tiny',
      valueFormatter: (params) => params.value


    },
    { field: 'customerName', headerName: 'Cliente', flex: 1, headerClassName: 'row-header-tiny' },
    { field: 'customerRut', headerName: 'Rut', flex: 1, headerClassName: 'row-header-tiny' },
    { field: 'guide', headerName: 'Guia', flex: 1, headerClassName: 'row-header-tiny' },
    {
      field: 'clp', headerName: 'CLP', flex: 1, headerClassName: 'row-header-tiny',
      valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
    },
    {
      field: 'usd', headerName: 'USD', flex: 1, headerClassName: 'row-header-tiny',
      valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
    },
    { field: 'change', headerName: 'Cambio', flex: 1, headerClassName: 'row-header-tiny' },
    { field: 'money', headerName: 'Moneda', flex: 1, headerClassName: 'row-header-tiny' },
    {
      field: 'palletsQuanty', headerName: 'Pallets', flex: 1, headerClassName: 'row-header-tiny',
      valueFormatter: (params) =>
        new Intl.NumberFormat('es-CL', {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(params.value) + ' unds'
    },
    {
      field: 'impurityWeight', headerName: 'Impurezas', flex: 1, headerClassName: 'row-header-tiny',
      valueFormatter: (params) =>
        new Intl.NumberFormat('es-CL', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value) + ' kg'
    },
    {
      field: 'gross', headerName: 'Bruto', flex: 1, headerClassName: 'row-header-tiny',
      valueFormatter: (params) =>
        new Intl.NumberFormat('es-CL', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value) + ' kg'
    },
    {
      field: 'net', headerName: 'Neto', flex: 1, headerClassName: 'row-header-tiny',
      valueFormatter: (params) =>
        new Intl.NumberFormat('es-CL', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value) + ' kg'
    },
    { field: 'toPay', headerName: 'A Pagar', flex: 1, headerClassName: 'row-header-tiny' },
    {
      field: 'actions',
      headerName: '',
      headerClassName: 'data-grid-last-column-header',
      type: 'actions', flex: 2, getActions: (params) => [
        <GridActionsCellItem
          sx={{ display: params.row.open ? 'inline-block' : 'none' }}
          label='edit'
          icon={<EditIcon />}
          onClick={() => {
            setRowData({
              rowId: params.id,
              id: params.row.id,
              name: params.row.name,
              clp: params.row.clp,
              usd: params.row.usd,
              change: params.row.change,
              money: params.row.money,
              toPay: params.row.toPay,
              net: params.row.net,
              gross: params.row.gross,
              impurityWeight: params.row.impurityWeight

            })
            setOpenEditDialog(true)
          }}
        />,
        <GridActionsCellItem
          label='print'
          icon={<PrintIcon />}
          onClick={() => {
            setRowData({
              rowId: params.id,
              id: params.row.id,
              name: params.row.name,
              clp: params.row.clp,
              usd: params.row.usd,
              change: params.row.change,
              money: params.row.money,

            })
            setOpenPrintDialog(true)
          }}
        />,
        <GridActionsCellItem
          label='open'
          icon={params.row.open ? <LockOpenIcon sx={{ fontSize: 16 }} /> : <LockIcon sx={{ fontSize: 16 }} />}
          onClick={() => {
            if (params.row.open === false) {
              openSnack('El despacho ya esta cerrado', 'error')
            } else {
              if (params.row.toPay < 0) {
                openSnack('El precio en pesos no esta asignado ', 'error')
              } else {
                closeDispatch(params.id, params.row.customerId, params.row.toPay)
              }
            }
          }}
        />,

      ]

    },

  ]

  return (
    <>
      {/* <DataGrid title='Despachos' rows={dispatchsList} columns={columns} height='80vh' setGridApiRef={setGridApiRef} /> */}

      <InfoDataGrid title={'Despachos'} rows={dispatchsList} columns={columns} height='80vh' setGridApiRef={setGridApiRef} />
      <Dialog open={openEditDialog} maxWidth={'xs'} fullWidth>
        <form onSubmit={(e) => { e.preventDefault(); updateDispatch() }}>
          <DialogTitle sx={{ padding: 2 }}>Editar Despacho {rowData.id}</DialogTitle>
          <DialogContent sx={{ padding: 1 }}>
            <Grid container spacing={1} direction={'column'}>
              <Grid item>
                <FormControlLabel
                  control={<Switch checked={rowData.showUsd} onChange={() => {
                    setRowData({ ...rowData, showUsd: !rowData.showUsd })
                  }} />}
                  label='Precio en dolares'
                />
              </Grid>
              <Grid item>
                <TextField
                  label='Precio'
                  value={rowData.clp}
                  onChange={(e) => { calcPrice(e.target.value, rowData.usd, rowData.change) }}
                  variant="outlined"
                  type='number'
                  size={'small'}
                  fullWidth
                  autoFocus
                  className='no-spin'
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">CLP</InputAdornment>,
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item sx={{ display: rowData.showUsd ? 'inline-block' : 'none' }}>
                <TextField
                  label='USD'
                  value={rowData.usd}
                  type='number'
                  onChange={(e) => { calcPrice(rowData.clp, e.target.value, rowData.change) }}
                  variant="outlined"
                  className='no-spin'
                  size={'small'}
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">USD</InputAdornment>,

                  }}
                  inputProps={{ min: 0, step: 0.01 }}

                />
              </Grid>
              <Grid item sx={{ display: rowData.showUsd ? 'inline-block' : 'none' }}>
                <TextField
                  label='Cambio'
                  value={rowData.change}
                  type='number'
                  // calcPrice(receptionClp, e.target.value, receptionChange, receptionMoney)
                  onChange={(e) => { calcPrice(rowData.clp, rowData.usd, e.target.value) }}
                  variant="outlined"
                  size={'small'}
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: <InputAdornment position="end">CLP</InputAdornment>,
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label='Impurezas %'
                  value={rowData.impurityPercent}
                  type='number'
                  variant="outlined"
                  onChange={(e) => {
                    setRowData({
                      ...rowData,
                      impurityPercent: e.target.value,
                      impurityWeight: (rowData.net * e.target.value) / 100
                    })
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  inputProps={{ min: 0, step: 0.01, max: 100 }}
                  size={'small'}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  label='Impurezas kg'
                  value={rowData.impurityWeight}
                  type='number'
                  InputProps={
                    {
                      endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                      readOnly: true
                    }
                  }
                  variant="outlined"
                  size={'small'}
                  fullWidth

                />
              </Grid>
              <Grid item>
                <TextField
                  label='Bruto'
                  value={rowData.gross}
                  type='number'
                  onChange={(e) => {setRowData({...rowData, gross: e.target.value })}}
                  InputProps={
                    {
                      endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                    }
                  }
                  variant="outlined"
                  size={'small'}
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}

                />
              </Grid>
              <Grid item>
                <TextField
                  label='Neto'
                  value={rowData.net}
                  type='number'
                  onChange={(e) =>{setRowData({...rowData, net: e.target.value})}}
                  // calcPrice(receptionClp, e.target.value, receptionChange, receptionMoney)
                  InputProps={
                    {
                      endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                    }
                  }
                  variant="outlined"
                  size={'small'}
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}

                />
              </Grid>
            </Grid>

          </DialogContent>
          <DialogActions >
            <Button variant={'contained'} type='submit'>editar</Button>
            <Button variant={'outlined'} onClick={() => { setOpenEditDialog(false) }}>Cerrar</Button>

          </DialogActions>
        </form>
      </Dialog>


      <PrintDialog
        open={openPrintDialog}
        setOpen={setOpenPrintDialog}
        title={'Recibo despacho ' + rowData.id}
        dialogWidth={'xl'}
      >
        <DistpatchToPrint dispatchId={rowData.id} />
      </PrintDialog>



    </>
  )
}

function rowDataDefault() {
  return ({
    rowId: 0,
    id: 0,
    clp: 0,
    usd: 0,
    money: 'CLP',
    close: false,
    impurityWeight: 0,
    impurityPercent: 0,
    net: 0,
    gross: 0,
  })
}

