import React, {useState, useEffect} from 'react'
import InfoDataGrid from '../../Karmextron/InfoDataGrid/InfoDataGrid'
import moment from 'moment'

const customerAccounts = require('../../../services/customerAccounts')

export default function CustomerAccountGrid() {
    const [customerAccountsList, setCustomerAccountsList] = useState([])
    const [gridApiRef, setGridApiRef] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const customerAccountsList_ = await customerAccounts.findAll()
            setCustomerAccountsList(customerAccountsList_)
        }
        fetchData()

    }, [])



const refereceType = (type) => {
    switch (type) {
        case 0: return 'Despacho'
        case 1: return 'Anticipo'
        case 2: return 'Liquidación'
    }
}

const columns = [
    { field: 'id', headerName: 'Id', flex: 1, type: 'number', valueFormatter: (params) => params.value },
    { field: 'credit', headerName: 'Abono', flex: 1,
    valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
 },
    { field: 'debit', headerName: 'Cargo', flex: 1,
    valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
 },
    { field: 'balance', headerName: 'Saldo', flex: 1,
    valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
 },
    { field: 'reference_id', headerName: 'Referencia', flex: 1 },
    { field: 'reference_type', headerName: 'Tipo', flex: 1,
    valueFormatter: (params) => refereceType(params.value) },
    { field: 'description', headerName: 'Descripción', flex: 1 },
    { field: 'createdAt', headerName: 'Fecha', flex: 1, 
    
 },
]
   

  return (
    <>
    <InfoDataGrid  title= {'Movimientos'}columns={columns} rows={customerAccountsList} height='60vh' setGridApiRef={setGridApiRef} />
    </>
  )
}
