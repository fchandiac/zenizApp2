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
            case 0 : return 'Recepción'
            case 1: return 'Anticipo'
        }
    }

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number' },
        { field: 'credit', headerName: 'Crédito', flex: 1 },
        { field: 'debit', headerName: 'Débito', flex: 1 },
        { field: 'balance', headerName: 'Saldo', flex: 1 },
        { field: 'referenceType', headerName: 'Tipo referecia', flex: 1, valueFormatter: (params) => (refereceType(params.value)) },
        { field: 'referenceId', headerName: 'Id referencia', flex: 1 },
        { field: 'date', headerName: 'fecha', headerClassName: 'data-grid-last-column-header', flex: 1, valueFormatter: (params) => (moment(params.value).format('DD-MM-YYYY HH:mm')) },
    ]

    return (
        <>
            <DataGrid title={producer.name} rows={accountsList} columns={columns} height='40vh' setGridApiRef={setGridApiRef} />
        </>
    )
}
