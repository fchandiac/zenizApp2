import React, { useEffect, useState } from 'react'
import DataGrid from '../../Karmextron/DataGrid/DataGrid'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material'
import InfoDataGrid from './InfoDataGrid'
import VarietyForm from '../../Forms/VarietyForm/VarietyForm'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'


const dispatchs = require('../../../services/dispatchs')
const customerAccounts = require('../../../services/customerAccounts')

export default function DispatchsGrid(props) {
  const { dispatchsList } = props
  const [gridApiRef, setGridApiRef] = useState(null)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [rowData, setRowData] = useState(rowDataDefault())


  const closeDispatch = async (id, customerId, toPay) => {
    await dispatchs.close(id)

    const lastMovement = await customerAccounts.findLastByCustomerId(customerId)
    console.log(lastMovement)

    let newBalance = 0
        if (lastMovement == null) {
            newBalance =  toPay
        } else {
            newBalance = lastMovement.balance + toPay
        }

    await customerAccounts.create(customerId, toPay, 0, newBalance, id, 0, 'Cierre de despacho')


    gridApiRef.current.updateRows([{
      id: id,
      open: false

    }])
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
    { field: 'usd', headerName: 'USD', flex: 1, headerClassName: 'row-header-tiny' },
    { field: 'change', headerName: 'Cambio', flex: 1, headerClassName: 'row-header-tiny' },
    { field: 'money', headerName: 'Moneda', flex: 1, headerClassName: 'row-header-tiny' },
    { field: 'trays_quanty', headerName: 'Bandejas', flex: 1, headerClassName: 'row-header-tiny' },
    { field: 'trays_weight', headerName: 'Peso Bandejas', flex: 1, headerClassName: 'row-header-tiny' },
    { field: 'impurity_weight', headerName: 'Impurezas', flex: 1, headerClassName: 'row-header-tiny' },
    { field: 'gross', headerName: 'Bruto', flex: 1, headerClassName: 'row-header-tiny' },
    { field: 'net', headerName: 'Neto', flex: 1, headerClassName: 'row-header-tiny' },
    { field: 'toPay', headerName: 'A Pagar', flex: 1, headerClassName: 'row-header-tiny' },
    {
      field: 'actions',
      headerName: '',
      headerClassName: 'data-grid-last-column-header',
      type: 'actions', flex: 2, getActions: (params) => [
        <GridActionsCellItem
          label='destroy'
          icon={<DeleteIcon />}
          onClick={() => { openSnack('El despacho tiene pallets asociadas', 'error') }}
        />,
        <GridActionsCellItem
          label='edit'
          icon={<EditIcon />}
          onClick={() => {
            // setRowData({
            //     rowId: params.id,
            //     id: params.row.id,
            //     name: params.row.name,
            //     clp: params.row.clp,
            //     usd: params.row.usd,
            //     money: params.row.money,
            //     moneySwitch: params.row.money === 'CLP' ? false : true
            // })
            setOpenEditDialog(true)
          }}
        />,
        <GridActionsCellItem
          // sx={{ display: user.Profile.close_reception ? 'inline-flex' : 'none' }}
          label='open'
          icon={params.row.open ? <LockOpenIcon sx={{ fontSize: 16 }} /> : <LockIcon sx={{ fontSize: 16 }} />}
          onClick={() => {
              closeDispatch(params.id, params.row.customerId, params.row.toPay)
          }}


        />,

      ]

    },
    // { field: 'open', headerName: 'Abierto', flex: 1, headerClassName: 'row-header-tiny' },
  ]

  return (
    <>
      {/* <DataGrid title='Despachos' rows={dispatchsList} columns={columns} height='80vh' setGridApiRef={setGridApiRef} /> */}

      <InfoDataGrid title={'Despachos'} rows={dispatchsList} columns={columns} height='80vh' setGridApiRef={setGridApiRef} />
      <Dialog open={openEditDialog} maxWidth={'xs'} fullWidth>
        <DialogTitle sx={{ padding: 2 }}>Editar Despacho {rowData.id}</DialogTitle>
        <DialogContent sx={{ padding: 1 }}>
          <VarietyForm
            afterSubmit={() => { console.log('afterSubmit') }}
            dialog={true}
            edit={true}
            closeDialog={(e) => { setOpenEditDialog(false) }}
            varietyData={rowData}
            setVarietyData={setRowData}
            gridApiRef={gridApiRef}
          />
        </DialogContent>
      </Dialog>


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
  })
}

