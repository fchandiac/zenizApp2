import React, { useState, useEffect } from 'react'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import PrintIcon from '@mui/icons-material/Print'
import {
    Grid, Paper, TextField, Typography, Divider, Box, Tab,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton
} from '@mui/material'
import moment from 'moment'
import PrintDialog from '../../PrintDialog/PrintDialog'


const producerAccounts = require('../../../services/producerAccounts')
const producers = require('../../../services/producers')
const receptions = require('../../../services/receptions')


export default function Statements(props) {
    const { producerId } = props
    const [filterDates, setFilterDates] = useState({ start: moment(new Date).format('YYYY-MM-DD'), end: moment(new Date).format('YYYY-MM-DD 23:59') })
    const [subTitle, setSubTitle] = useState('Movimientos')
    const [startBalance, setStartBalance] = useState(0)
    const [endBalance, setEndBalance] = useState(0)
    const [producer, setProducer] = useState({})
    const [movements, setMovements] = useState([])
    const [openPrintDialog, setOpenPrintDialog] = useState(false)
    const [totalGross, setTotalGross] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            const data = await producerAccounts.findAllByProducerIdBetweenDates(producerId, filterDates.start, filterDates.end)
            const formatData = data.map((item) => ({
                id: item.id,
                credit: item.credit,
                debit: item.debit,
                balance: item.balance,
                description: item.description,
                referenceId: item.reference_id,
                referenceType: item.reference_type,
                createdAt: item.createdAt,
                reception: [],
            }))

            formatData.map(async (item) => {
                if (item.referenceType == 0) {
                    const reception = await receptions.findOneById(item.referenceId)
                    item.reception = reception
                }
            })

            console.log(formatData)
            let gross = formatData.reduce((a, b) => a + b.reception.gros, 0)
            setTotalGross(totalGross)

            setMovements(formatData)
            setProducer(await producers.findOneById(producerId))
            const startBalance_ = await producerAccounts.findFirstByProducerIdBetweenDate(producerId, filterDates.start, filterDates.end)
            setStartBalance(startBalance_ == null ? '' : startBalance_.balance)
            const endBalance_ = await producerAccounts.findLastByProducerIdBetweenDates(producerId, filterDates.start, filterDates.end)
            setEndBalance(endBalance_ == null ? '' : endBalance_.balance)

        }
        fetchData()
        fetchData()
        if (moment(filterDates.start).format('DD-MM-YYYY') == moment(filterDates.end).format('DD-MM-YYYY')) {
            setSubTitle('Movimientos ' + moment(filterDates.start).format('DD-MM-YYYY'))
        } else {
            setSubTitle('Movimientos del ' + moment(filterDates.start).format('DD-MM-YYYY') + ' al ' + moment(filterDates.end).format('DD-MM-YYYY'))
        }
    }, [filterDates])

    const refereceType = (type) => {
        switch (type) {
            case 0: return 'Recepción'
            case 1: return 'Anticipo'
            case 2: return 'Liquidación'
        }
    }

    const table = (movements) => (
        <TableContainer component={Paper} variant={'outlined'}>
            <Table  >
                <TableHead>
                    <TableRow>
                        <TableCell align="right" className='row-header-tiny'>Fecha</TableCell>
                        <TableCell align="right" className='row-header-tiny'>id</TableCell>
                        <TableCell align="right" className='row-header-tiny'>Abono</TableCell>
                        <TableCell align="right" className='row-header-tiny'>Cargo</TableCell>
                        <TableCell align="right" className='row-header-tiny'>Saldo</TableCell>
                        <TableCell align="right" className='row-header-tiny'>Descripción</TableCell>
                        <TableCell align="right" className='row-header-tiny'>Referencia</TableCell>
                        <TableCell align="right" className='row-header-tiny'>Id referencia</TableCell>
                        <TableCell align="right" className='row-header-tiny'>Bandejas</TableCell>
                        <TableCell align="right" className='row-header-tiny'>Precio</TableCell>
                        <TableCell align="right" className='row-header-tiny'>Neto</TableCell>
                        <TableCell align="right" className='row-header-tiny'>Fecha recepción</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {movements.map((row) => (
                        <TableRow
                            key={row.id}
                        // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="right" sx={{ fontSize: 10 }}
                                className='row-tiny'
                            >
                                {moment(row.createdAt).format('DD-MM-YYYY HH:mm')}
                            </TableCell>
                            <TableCell className='row-tiny' component="th" scope="row">
                                {row.id}
                            </TableCell>

                            <TableCell className='row-tiny' align="right">{row.credit}</TableCell>
                            <TableCell className='row-tiny' align="right">{row.debit}</TableCell>
                            <TableCell className='row-tiny' align="right">{row.balance}</TableCell>
                            <TableCell
                                className='row-tiny'
                                align="right"
                                sx={{ fontSize: 10 }}
                            >{row.description}</TableCell>
                            <TableCell className='row-tiny' align="right">{refereceType(row.referenceType)}</TableCell>
                            <TableCell className='row-tiny' align="right">{row.referenceId}</TableCell>
                            <TableCell className='row-tiny' align="right">{row.reception.trays_quanty}</TableCell>
                            <TableCell className='row-tiny' align="right">{
                            row.reception.clp
                            }</TableCell>
                            <TableCell className='row-tiny' align="right">{row.reception.net}</TableCell>
                            <TableCell className='row-tiny' align="right">
                                {
                                    moment(row.reception.createdAt).format('DD-MM-YYYY HH:mm')
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>


    )



    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={2}>
                    <Grid container spacing={1} direction={'column'}>
                        <Grid item>
                            <DesktopDatePicker
                                label="Fecha incial"
                                inputFormat='DD-MM-YYYY'
                                value={filterDates.start}
                                onChange={(e) => {
                                    console.log(e)
                                    setFilterDates({ ...filterDates, start: e })
                                }}
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
                        <Grid item textAlign={'right'}>
                            <IconButton
                                onClick={() => { setOpenPrintDialog(true) }}
                            >
                                <PrintIcon />
                            </IconButton>

                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={10}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }} variant='outlined'>

                        <Typography variant='h6' align='left'>Cartola</Typography>
                        <Typography variant='subtitle1' align='left'>{subTitle}</Typography>
                        <Typography variant='caption' align='left'>Productor: {producer.name}</Typography>
                        <Typography variant='caption' align='left'>Rut: {producer.rut}</Typography>
                        <Typography variant='caption' align='left'>Teléfono: {producer.phone}</Typography>
                        <Divider />
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingTop: 1,
                            paddingBottom: 1
                        }}>
                            <Typography variant='caption' align='left'>Saldo inicial: {startBalance.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</Typography>
                            <Typography variant='caption' align='left'>Saldo Final: {endBalance.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</Typography>
                        </Box>
                        <Divider />
                        <Box sx={{
                            paddingTop: 1,
                            paddingBottom: 1
                        }}>
                            {table(movements)}
                        </Box>

                    </Paper>

                </Grid>
            </Grid>

            <PrintDialog
                open={openPrintDialog}
                setOpen={setOpenPrintDialog}
                title={'Cartola'}
                dialogWidth={'lg'}
            >
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', }} variant='outlined'>

                    <Typography variant='h6' align='left'>Cartola</Typography>
                    <Typography variant='subtitle1' align='left'>{subTitle}</Typography>
                    <Typography variant='caption' align='left'>Productor: {producer.name}</Typography>
                    <Typography variant='caption' align='left'>Rut: {producer.rut}</Typography>
                    <Typography variant='caption' align='left'>Teléfono: {producer.phone}</Typography>
                    <Divider />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingTop: 1,
                        paddingBottom: 1
                    }}>
                        <Typography variant='caption' align='left'>Saldo inicial: {startBalance.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</Typography>
                        <Typography variant='caption' align='left'>Saldo Final: {endBalance.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{
                        paddingTop: 1,
                        paddingBottom: 1
                    }}>
                        {table(movements)}
                    </Box>

                </Paper>
            </PrintDialog>


        </>
    )
}
