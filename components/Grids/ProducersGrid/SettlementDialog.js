import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, Typography, TextField, InputAdornment } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import moment from 'moment'
import AppDataGrid from '../../Karmextron/DataGrid/DataGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import { GridActionsCellItem } from '@mui/x-data-grid'
import InfoDataGrid from '../../Karmextron/InfoDataGrid/InfoDataGrid'
import PrintDialog from '../../PrintDialog/PrintDialog'
import SettlementToPrint from '../SettlementsGrid/SettlementToPrint'



const receptions = require('../../../services/receptions')
const producerAccounts = require('../../../services/producerAccounts')
const settlements = require('../../../services/settlements')

export default function SettlementDialog(props) {
    const { open, setOpen, title, producer_id, accountsGridState, setAccountsGridState } = props
    const [gridApiRef, setGridApiRef] = useState(null)
    const [filterDates, setFilterDates] = useState({ start: moment(new Date).format('YYYY-MM-DD'), end: moment(new Date).format('YYYY-MM-DD 23:59') })
    const [receptionsList, setReceptionsList] = useState([])
    const [gridTitle, setGridTitle] = useState('Recepciones')
    const [balance, setBalance] = useState(0)
    const [openPrintDialog, setOpenPrintDialog] = useState(false)
    const [settlementData, setSettlementData] = useState({})
    const [settlement_id, setSettlement_id] = useState(0)


    useEffect(() => {
        const fetchData = async () => {
            const data = await receptions.findAllByProducerBetweenDates(producer_id, filterDates.start, filterDates.end)
            let filterData = data.filter((reception) => (reception.settlement === false && reception.open === false))

            let formattedData = filterData.map((reception) => ({
                id: reception.id,
                producerId: reception.ProducerId,
                producerName: reception.Producer.name,
                clp: reception.clp,
                net: reception.net,
                toPay: reception.to_pay,
                createdAt: reception.createdAt,
            }))
            setReceptionsList(formattedData)

            if (moment(filterDates.start).format('DD-MM-YYYY') == moment(filterDates.end).format('DD-MM-YYYY')) {
                setGridTitle('Recepciones cerradas a liquidar ' + moment(filterDates.start).format('DD-MM-YYYY'))
            } else {
                setGridTitle('Recepciones cerradas a liquidar del ' + moment(filterDates.start).format('DD-MM-YYYY') + ' al ' + moment(filterDates.end).format('DD-MM-YYYY'))
            }

       
        }
        fetchData()

    }, [open, filterDates])

    useEffect(() => {
        let balance = 0

        if (receptionsList.length > 0) {

        balance = receptionsList.reduce((acc, reception) => {
                return acc + reception.toPay;
            }, 0)}

        setBalance(balance)

    }, [receptionsList])

    const destroy = (id) => {
        let filteredReceptions = receptionsList.filter((reception) => reception.id !== id)
        setReceptionsList(filteredReceptions)
    }

    const settlementDescription = () => {
        let description = ' Liquidación de las recepciones cerradas del ' + moment(filterDates.start).format('DD-MM-YYYY') + ' al ' + moment(filterDates.end).format('DD-MM-YYYY') + ' por un total de ' + balance.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) + ' '
        receptionsList.map((reception) => {
            description = description + 'Recepción id: ' + reception.id + ' '
        })
        return description
    }

    const credit = () => {
        console.log('balance', balance)
        let credit = balance >= 0 ? 0 : balance * -1
        return credit
    }

    const debit = () => {
        let debit = balance < 0 ? 0 : balance
        return debit
    }

    const newSettlement = async () => {

        console.log(receptionsList)
        let currentBalance = balance
        console.log(currentBalance)
        const newSettlement = await settlements.create(producer_id, currentBalance, 'Liquidación')
        await producerAccounts.create(
            producer_id,
            credit(),
            debit(),
            0,
            newSettlement.id,
            2,
            settlementDescription()
        )

        setSettlement_id(newSettlement.id)



        receptionsList.map(async (reception) => {
            // await receptions.updateSettlement(reception.id, newSettlement.id)
            await receptions.updateSettlement(reception.id, newSettlement.id)
        })

        setAccountsGridState(!accountsGridState)
        setOpen(false)
        setOpenPrintDialog(true)

    }


    const columns = [
        {
            field: 'id', headerName: 'Id', flex: .5, type: 'number',
            valueFormatter: (params) => params.value
        },
        { field: 'producerName', headerName: 'Productor', flex: 1 },
        {
            field: 'clp', headerName: 'Precio CLP', flex: 1,
            valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
        },
        {
            field: 'net', headerName: 'Neto', flex: 1,
            valueFormatter: (params) =>
                new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(params.value) + ' kg'
        },
        {
            field: 'toPay', headerName: 'Por pagar', flex: 1,
            valueFormatter: (params) => params.value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
        },
        {
            field: 'createdAt', headerName: 'Fecha', flex: 1,
            valueFormatter: (params) => moment(params.value).format('DD-MM-YYYY HH:mm')
        },
        {
            field: 'actions',
            headerName: '',
            headerClassName: 'data-grid-last-column-header',
            type: 'actions', flex: .5, getActions: (params) => [
                <GridActionsCellItem
                    label='delete'
                    icon={<DeleteIcon />}
                    onClick={() => {
                        destroy(params.row.id)
                    }}
                />,
            ]

        },

    ]


    return (
        <>
            <Dialog open={open} maxWidth={'lg'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>
                    {title}
                </DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            <Grid container spacing={1} direction={'column'}>
                                <Grid item>
                                    <Paper sx={{ padding: 1 }} variant='outlined'>
                                        <Typography>
                                            Periodo
                                        </Typography>
                                        <Grid container spacing={1} direction={'column'} paddingTop={1}>
                                            <Grid item>
                                                <DesktopDatePicker
                                                    label="Fecha incial"
                                                    inputFormat='DD-MM-YYYY'
                                                    value={filterDates.start}
                                                    onChange={(e) => { setFilterDates({ ...filterDates, start: e }) }}
                                                    renderInput={(params) => <TextField {...params} size={'small'} fullWidth />}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <DesktopDatePicker
                                                    label="Fecha final"
                                                    inputFormat='DD-MM-YYYY'
                                                    value={filterDates.end}
                                                    onChange={(e) => { setFilterDates({ ...filterDates, end: e }) }}
                                                    renderInput={(params) => <TextField {...params} size={'small'} fullWidth />}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                                <Grid item>
                                    <Paper sx={{ padding: 1 }} variant='outlined'>
                                        <Typography>
                                            Liquidar
                                        </Typography>
                                        <Grid container spacing={1} direction={'column'} paddingTop={1}>
                                            <Grid item>
                                                <TextField
                                                    label="Saldo a liquidar"
                                                    value={balance.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                                                    size={'small'}
                                                    fullWidth
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant='contained'
                                                    fullWidth
                                                    onClick={() => { newSettlement() }}
                                                >
                                                    Liquidar
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                            </Grid>
                        </Grid>
                        <Grid item xs={9}>
                            <InfoDataGrid
                                title={gridTitle}
                                rows={receptionsList}
                                columns={columns}
                                height='40vh'
                                setGridApiRef={setGridApiRef}
                                headerVariant={'caption'}
                                infoField='toPay'
                                infoTitle='Total por pagar'
                                money={true}

                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button variant='outlined' onClick={() => setOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            <PrintDialog
                open={openPrintDialog}
                setOpen={setOpenPrintDialog}
                title={'Liquidación'}
                dialogWidth={'lg'}
            >
                <SettlementToPrint settlement_id={settlement_id} />
            </PrintDialog>

        </>
    )
}
