import React, { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import PrintIcon from '@mui/icons-material/Print'
import { GridActionsCellItem } from '@mui/x-data-grid'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import InfoDataGrid from '../../Karmextron/InfoDataGrid/InfoDataGrid'
import { useAppContext } from '../../../appProvider'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Paper, TextField, InputAdornment } from '@mui/material'
import CustomerAccountGrid from '../CustomerAccountsGrid/CustomerAccountGrid'

const customers = require('../../../services/customers')
const customerAccounts = require('../../../services/customerAccounts')
const customerAdvances = require('../../../services/customerAdvances')


export default function CustomersGrid(props) {
    const { user } = useAppContext()
    const { update } = props
    const [customersList, setCustomersList] = useState([])
    const [gridApiRef, setGridApiRef] = useState(null)
    const [rowData, setRowData] = useState(rowDataDefault())
    const [openAccountDialog, setOpenAccountDialog] = useState(false)
    const [advanceData, setAdvanceData] = useState({ producerId: 0, amount: 0, description: '' })
    const [updateCustomerAcountGrid, setUpdateCustomerAcountGrid] = useState(false) 
    

    useEffect(() => {
        const fetchData = async () => {
            const customersList = await customers.findAll()
            setCustomersList(customersList)
        }
        fetchData()
    }, [update])

    const newAdvance = async () => {
        const newAdvance = await customerAdvances.create(rowData.id, advanceData.amount, advanceData.description)
        const lastCustomerAccount = await customerAccounts.findLastByCustomerId(rowData.id)
        const lastBalance = lastCustomerAccount ? lastCustomerAccount.balance : 0
        await customerAccounts.create(
            rowData.id,
            0,
            parseInt(advanceData.amount),
            parseInt(lastBalance) - parseInt(advanceData.amount),
            newAdvance.id,
            1,
            'Anticipo ' + newAdvance.id,
        )
        setUpdateCustomerAcountGrid(!updateCustomerAcountGrid)
        setAdvanceData({ producerId: 0, amount: 0, description: '' })
    }

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
                    <Grid container spacing={1}>
                        <Grid item xs={3} md={3}>
                            <Paper sx={{ padding: 1 }} variant='outlined'>
                                <Typography>
                                    Nuevo Anticipo
                                </Typography>
                                <form onSubmit={(e) => { e.preventDefault(); newAdvance()  }}>
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
                        <Grid item xs={9} md={9}>
                            <CustomerAccountGrid customer_id={rowData.id} updateCustomerAcountGrid={updateCustomerAcountGrid} />
                        </Grid>
                    </Grid>

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
