import React, {useEffect, useState} from 'react'
import DataGrid from '../../Karmextron/DataGrid/DataGrid'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material'

const dispatchs = require('../../../services/dispatchs')

export default function DispatchsGrid() {
    const [gridApiRef, setGridApiRef] = useState(null)
    const [dispatchsList, setDispatchsList] = useState([])

    useEffect(() => {
        const getDispatchs = async () => {
            const dispatchs_ = await dispatchs.findAll()
            console.log(dispatchs_)
            let data = dispatchs_.map(dispatch => ({
                id: dispatch.id,
                customerName: dispatch.Customer.name,
                customerRut: dispatch.Customer.rut,
                customer: dispatch.Customer,
                guide: dispatch.guide,
                clp: dispatch.clp,
                usd: dispatch.usd,
                change: dispatch.change,
                money: dispatch.money,
                trays_quanty: dispatch.trays_quanty,
                trays_weight: dispatch.trays_weight,
                impurity_weight: dispatch.impurity_weight,
                gross: dispatch.gross,
                net: dispatch.net,
                to_pay: dispatch.to_pay,
                open: dispatch.open,
            }))
            setDispatchsList(data)
        }
        getDispatchs()

    }, [])

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number' },
        { field: 'customerName', headerName: 'Cliente', flex: 1 },
        { field: 'customerRut', headerName: 'Rut', flex: 1 },
        { field: 'guide', headerName: 'Guia', flex: 1 },
        { field: 'clp', headerName: 'CLP', flex: 1 },
        { field: 'usd', headerName: 'USD', flex: 1 },
        { field: 'change', headerName: 'Cambio', flex: 1 },
        { field: 'money', headerName: 'Moneda', flex: 1 },
        { field: 'trays_quanty', headerName: 'Bandejas', flex: 1 },
        { field: 'trays_weight', headerName: 'Peso Bandejas', flex: 1 },
        { field: 'impurity_weight', headerName: 'Impurezas', flex: 1 },
        { field: 'gross', headerName: 'Bruto', flex: 1 },
        { field: 'net', headerName: 'Neto', flex: 1 },
        { field: 'to_pay', headerName: 'A Pagar', flex: 1 },
        { field: 'open', headerName: 'Abierto', flex: 1 },
    ]

  return (
    <>
        <DataGrid title='Despachos' rows={dispatchsList} columns={columns} height='80vh' setGridApiRef={setGridApiRef} />


    </>
  )
}
