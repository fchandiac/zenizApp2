import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Typography, Divider, Box, Paper } from '@mui/material'
import moment from 'moment'
import React from 'react'

export default function ReceptionsReportToPrint(props) {
    const { reportData } = props
    console.log('reportData', reportData)

   

    const receptionsTable = ({ data }) => {
        return (
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className='row-header-tiny'>id</TableCell>
                            <TableCell className='row-header-tiny'>Variedad</TableCell>
                            <TableCell className='row-header-tiny'>Bandejas</TableCell>
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
                                <TableCell className='row-tiny'>{item.varietyName}</TableCell>
                                <TableCell className='row-tiny'>{item.traysQuanty}</TableCell>
                                <TableCell className='row-tiny'>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.traysWeight) + ' kg'
                                }</TableCell>
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
                                    }).format(item.impurityWeight) + ' kg'
                                }</TableCell>
                                <TableCell className='row-tiny'>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.net) + ' kg'
                                }</TableCell>
                                <TableCell className='row-tiny'>{item.toPay.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
    return (

        <>
            <Typography variant={'subtitle2'} fontWeight="bold">{'Recepciones'}</Typography>
            <Divider />
            <Box flexDirection={'column'} paddingTop={1} display={'flex'}>
                <Typography variant={'caption'}>{'Productor: ' + reportData.producerName}</Typography>
                <Typography variant={'caption'}>{'Rut: ' + reportData.producerRut}</Typography>
                <Typography variant={'caption'}>{'Fecha inicial: ' + reportData.start}</Typography>
                <Typography variant={'caption'}>{'Fecha final: ' + reportData.end}</Typography>
            </Box>
            <Box flexDirection={'column'} paddingBottom={1}>
                {receptionsTable({ data: reportData.receptions })}
            </Box>

        </>

    )
}
