import { Grid, Typography, Box, Divider,Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material'
import moment from 'moment'
import React from 'react'

export default function SettlementToPrint(props) {
    const { settlement } = props
    console.log('settlementToPrint', settlement)

    const table = ({ data }) => {
        return (
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className='row-header-tiny'>id</TableCell>
                            <TableCell className='row-header-tiny'>Variedad</TableCell>
                            <TableCell className='row-header-tiny'># Bandejas</TableCell>
                            <TableCell className='row-header-tiny'>Bandejas</TableCell>
                            <TableCell className='row-header-tiny'>Bruto</TableCell>
                            <TableCell className='row-header-tiny'>Impurezas</TableCell>
                            <TableCell className='row-header-tiny'>Neto</TableCell>
                            <TableCell className='row-header-tiny'>A pagar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className='row-tiny'>{item.id}</TableCell>
                                <TableCell className='row-tiny'>{item.Variety.name}</TableCell>
                                <TableCell className='row-tiny'>{item.trays_quanty}</TableCell>
                                <TableCell className='row-tiny'>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.trays_weight) + ' kg'
                                }</TableCell >
                                <TableCell className='row-tiny'>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.gross) + ' kg'
                                }</TableCell>
                                <TableCell className='row-tiny'>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.impurity_weight) + ' kg'
                                }</TableCell>
                                <TableCell className='row-tiny'>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.net) + ' kg'
                                }</TableCell>
                                <TableCell className='row-tiny'>{item.to_pay.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
    return (
        <>
            <Typography variant={'subtitle2'} fontWeight="bold">{'Liquidación ' + settlement.id}</Typography>
            <Divider />
            <Box flexDirection={'column'} paddingTop={1} display={'flex'}>
                <Typography variant={'caption'}>{'Productor: ' + settlement.producerName}</Typography>
                <Typography variant={'caption'}>{'Rut: ' + settlement.producerRut}</Typography>
                <Typography variant={'caption'}>{'Fecha: ' + moment(settlement.createdAt).format('DD-MM-YYYY HH:mm')}</Typography>
            </Box>
            <Box flexDirection={'column'} paddingBottom={1}>
                {table({ data: settlement.receptions })}
            </Box>

        </>
    )
}
