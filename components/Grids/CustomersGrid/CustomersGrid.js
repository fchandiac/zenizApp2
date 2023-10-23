import React, { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import PrintIcon from '@mui/icons-material/Print'
import { GridActionsCellItem } from '@mui/x-data-grid'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import InfoDataGrid from '../../Karmextron/InfoDataGrid/InfoDataGrid'
import { useAppContext } from '../../../appProvider'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material'
import CustomerAccountGrid from '../CustomerAccountsGrid/CustomerAccountGrid'

const customers = require('../../../services/customers')


export default function CustomersGrid(props) {
    const { user } = useAppContext()
    const { update } = props
    const [customersList, setCustomersList] = useState([])
    const [gridApiRef, setGridApiRef] = useState(null)
    const [rowData, setRowData] = useState(rowDataDefault())
    const [openAccountDialog, setOpenAccountDialog] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const customersList = await customers.findAll()
            setCustomersList(customersList)
        }
        fetchData()
    }, [update])

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number' },
        { field: 'name', headerName: 'Nombre', flex: 1 },
        { field: 'rut', headerName: 'Rut', flex: 1 },
        { field: 'phone', headerName: 'Teléfono', flex: 1 },
        { field: 'mail', headerName: 'Correo', flex: 1 },
        { field: 'address', headerName: 'Dirección', flex: 1 },
        {
            field: 'actions',
            headerName: '',
            headerClassName: 'data-grid-last-column-header',
            type: 'actions', flex: .5, getActions: (params) => [
                <GridActionsCellItem
                    sx={{ display: user.Profile.delete ? 'block' : 'none' }}
                    label='delete'
                    icon={<DeleteIcon />}
                    onClick={() => {
                        openSnack('El Cliente tiene cuentas asociadas', 'error')
                    }}
                />,
                <GridActionsCellItem
                    label='account'
                    icon={<AccountBalanceIcon />}
                    onClick={async () => {
                        setRowData({
                            id: params.row.id,
                            name: params.row.name,
                            rut: params.row.rut,
                            phone: params.row.phone,
                            mail: params.row.mail,
                            address: params.row.address
                        })
                        setOpenAccountDialog(true)
                    }}
                />,
            ]

        }
    ]

    return (
        <>
            <InfoDataGrid
                columns={columns}
                rows={customersList}
                title={'Clientes'}
                headerVariant={'h6'}
                height={'80vh'}
                setGridApiRef={setGridApiRef}
                infoField={''}
                infoTitle={''}
                money={false}
            />

            <Dialog open={openAccountDialog} maxWidth={'lg'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}> Cuenta cliente</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <CustomerAccountGrid />

                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button variant='outlined' onClick={() => setOpenAccountDialog(false)}>Cerrar</Button>
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
        mail: '',
        address: ''
    })
}
