import React, { useState, useEffect } from 'react'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import {
    Grid, Paper, TextField, Typography, Divider, Box, Tab,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button
} from '@mui/material'
import moment from 'moment'


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

            setMovements(formatData)
            setProducer(await producers.findOneById(producerId))
            const startBalance_ = await producerAccounts.findFirstByProducerIdBetweenDate(producerId, filterDates.start, filterDates.end)
            setStartBalance(startBalance_.balance)
   

            const endBalance_ = await producerAccounts.findLastByProducerIdBetweenDates(producerId, filterDates.start, filterDates.end)
            setEndBalance(endBalance_.balance)


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
                        <TableCell align="right">Fecha</TableCell>
                        <TableCell align="right">id</TableCell>
                        <TableCell align="right">Abono</TableCell>
                        <TableCell align="right">Cargo</TableCell>
                        <TableCell align="right">Saldo</TableCell>
                        <TableCell align="right">Descripción</TableCell>
                        <TableCell align="right">Referencia</TableCell>
                        <TableCell align="right">Id referencia</TableCell>
                        <TableCell align="right">Bandejas</TableCell>
                        <TableCell align="right">Precio</TableCell>
                        <TableCell align="right">Neto</TableCell>
                        <TableCell align="right">Fecha recepción</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {movements.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="right" sx={{fontSize: 10}}>
                                    {moment(row.createdAt).format('DD-MM-YYYY HH:mm')}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.id}
                            </TableCell>

                            <TableCell align="right">{row.credit}</TableCell>
                            <TableCell align="right">{row.debit}</TableCell>
                            <TableCell align="right">{row.balance}</TableCell>
                            <TableCell 
                            align="right" 
                            sx={{fontSize: 10}}
                            >{row.description}</TableCell>
                            <TableCell align="right">{refereceType(row.referenceType)}</TableCell>
                            <TableCell align="right">{row.referenceId}</TableCell>
                            <TableCell align="right">{row.reception.trays_quanty}</TableCell>
                            <TableCell align="right">{row.reception.clp}</TableCell>
                            <TableCell align="right">{row.reception.net}</TableCell>
                            <TableCell align="right">
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
                            <Typography variant='caption' align='left'>Saldo inicial: {startBalance}</Typography>
                            <Typography variant='caption' align='left'>Saldo Final: {endBalance}</Typography>
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
        </>
    )
}
