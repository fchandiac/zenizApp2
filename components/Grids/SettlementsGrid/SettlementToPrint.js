import { Grid, Typography, Box, Divider,Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material'
import React from 'react'

export default function SettlementToPrint(props) {
    const { settlement } = props
    console.log('settlementToPrint', settlement)

    const receptionsTable = ({ data }) => {
        return (
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell>Variedad</TableCell>
                            <TableCell># Bandejas</TableCell>
                            <TableCell>Bandejas</TableCell>
                            <TableCell>Bruto</TableCell>
                            <TableCell>Impurezas</TableCell>
                            <TableCell>Neto</TableCell>
                            <TableCell>A pagar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.Variety.name}</TableCell>
                                <TableCell>{item.trays_quanty}</TableCell>
                                <TableCell>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.trays_weight) + ' kg'
                                }</TableCell>
                                <TableCell>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.gross) + ' kg'
                                }</TableCell>
                                <TableCell>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.impurity_weight) + ' kg'
                                }</TableCell>
                                <TableCell>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.net) + ' kg'
                                }</TableCell>
                                <TableCell>{item.to_pay.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</TableCell>
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
                <Typography variant={'caption'}>{'Fecha: ' + settlement.cratedAt}</Typography>
            </Box>
            <Box flexDirection={'column'} paddingBottom={1}>
                {receptionsTable({ data: settlement.receptions })}
            </Box>

        </>
    )
}
