import React, { useState, useEffect } from 'react'
import DataGrid from '../../Karmextron/DataGrid/DataGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoIcon from '@mui/icons-material/Info'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import EditIcon from '@mui/icons-material/Edit'
import { GridActionsCellItem } from '@mui/x-data-grid'
import moment from 'moment';

const producerAccounts = require('../../../services/producerAccounts')

export default function ProducerAccountsGrid(props) {
    const { producer, update } = props
    const [gridApiRef, setGridApiRef] = useState(null)
    const [accountsList, setAccountsList] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const accountsData = await producerAccounts.findAllByProducerId(producer.id)
            let data = accountsData.map((account) => ({
                id: account.id,
                producerId: account.ProducerId,
                credit: account.credit,
                debit: account.debit,
                balance: account.balance,
                referenceType: account.reference_type,
                referenceId: account.reference_id,
                description: account.description,
                date: account.createdAt,
            }))
            setAccountsList(data)
            console.log(accountsData)
        }
        fetchData()
    }, [update])

    const refereceType = (type) => {
        switch (type) {
            case 0: return 'Recepción'
            case 1: return 'Anticipo'
            case 2: return 'Liquidación'
        }
    }

    const getRowClassName = (params) =>  {
        // Verifica el valor de 'estadoPago' en la fila actual
        if (params.row.ereferenceType === 2) {
          // Si el estado de pago es verdadero, devuelve una clase CSS para fondo verde
          return 'row-settlement';
        }
        // De lo contrario, no se aplica ninguna clase adicional
        return '';
      }

    const columns = [
        { field: 'id', headerName: 'Id', flex: .3, type: 'number', valueFormatter: (params) => params.value },
        {
            field: 'credit', headerName: 'Abonos', flex: .4,
            valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
        },
        { field: 'debit', headerName: 'Cargos', flex: .4,
        valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
     },
        { field: 'balance', headerName: 'Saldo', flex: .4, 
        valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
    },
        {
            field: 'referenceType', headerName: 'Referencia', flex: .5,
            valueFormatter: (params) => (refereceType(params.value)),
            cellClassName: (params) => (params.value === 2 ? 'data-grid-cell-green' : '')
        },
        { field: 'referenceId', headerName: 'Id referencia', flex: .5 },
        { field: 'description', headerName: 'Descripción', flex: 1, cellClassName: 'row-tiny' },
        { field: 'date', headerName: 'fecha', headerClassName: 'data-grid-last-column-header', flex: .5, valueFormatter: (params) => (moment(params.value).format('DD-MM-YYYY HH:mm')) },
    ]

    return (
        <>
            <DataGrid title={producer.name} rows={accountsList} columns={columns} height='40vh' setGridApiRef={setGridApiRef} />
        </>
    )
}
