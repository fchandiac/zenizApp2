import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Typography, Divider, Box, Paper } from '@mui/material'
import moment from 'moment'
import React from 'react'


const rowTinyStyle = {
    fontSize: '.65rem',
    minHeight: 'fit-content',
    maxWidth: '7rem',
    padding: '.2rem',
    margin: 0,
    textAlign: 'right',
    width: 'fit-content',
}

const rowHeaderTinyStyle = {
    fontSize: '.65rem',
    fontWeight: 'bold',
    padding: '.2rem',
    textAlign: 'right',
    width: 'fit-content',
}

export default function ReceptionsReportToPrint(props) {
    const { reportData, global } = props
    console.log('reportData', reportData)

    const calculateTotals = (data) => {
        const totals = {
            traysQuanty: 0,
            traysWeight: 0,
            gross: 0,
            impurityWeight: 0,
            net: 0,
            toPay: 0,
        };

        data.forEach((item) => {
            totals.traysQuanty += item.traysQuanty;
            totals.traysWeight += item.traysWeight;
            totals.gross += item.gross;
            totals.impurityWeight += item.impurityWeight;
            totals.net += item.net;
            totals.toPay += item.toPay;
        });

        return totals;
    };





    const receptionsTable = ({ data }) => {
        const totals = calculateTotals(data)
        return (
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={rowHeaderTinyStyle} className='row-header-tiny' >id</TableCell>
                            <TableCell style={rowHeaderTinyStyle} className='row-header-tiny'>Variedad</TableCell>
                            <TableCell style={rowHeaderTinyStyle} className='row-header-tiny'>Bandejas</TableCell>

                            <TableCell style={rowHeaderTinyStyle} className='row-header-tiny'>Bruto</TableCell>
                            <TableCell style={rowHeaderTinyStyle} className='row-header-tiny'>Impurezas</TableCell>
                            <TableCell style={rowHeaderTinyStyle} className='row-header-tiny'>Neto</TableCell>
                            <TableCell style={rowHeaderTinyStyle} className='row-header-tiny'>Precio kg CLP</TableCell>
                            <TableCell style={rowHeaderTinyStyle} className='row-header-tiny'>Precio kg USD</TableCell>
                            {/* <TableCell className='row-header-tiny'>A pagar</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell style={rowTinyStyle} >{item.id}</TableCell>
                                <TableCell style={rowTinyStyle} >{item.varietyName}</TableCell>
                                <TableCell style={rowTinyStyle} >{

                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(item.traysQuanty) + ' unds'
                                }</TableCell>

                                <TableCell style={rowTinyStyle} className='row-tiny'>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.gross) + ' kg'
                                }</TableCell>
                                <TableCell style={rowTinyStyle} className='row-tiny'>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.impurityWeight) + ' kg'
                                }</TableCell>
                                <TableCell style={rowTinyStyle} className='row-tiny'>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.net) + ' kg'
                                }</TableCell>
                                <TableCell style={rowTinyStyle} className='row-tiny'>{
                                    item.clp.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 2 })

                                }</TableCell>
                                <TableCell style={rowTinyStyle} className='row-tiny'>{
                                    item.usd.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 2 })

                                }</TableCell>

                                {/* <TableCell className='row-tiny'>{item.toPay.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</TableCell> */}
                            </TableRow>
                        ))}

                        <TableRow>
                            <TableCell style={rowTinyStyle} sx={{ backgroundColor: '#eeeeee' }} className='row-tiny'>TOTALES</TableCell>
                            <TableCell style={rowTinyStyle} sx={{ backgroundColor: '#eeeeee' }} className='row-tiny'></TableCell>
                            <TableCell style={rowTinyStyle} sx={{ backgroundColor: '#eeeeee' }} className='row-tiny'>{
                                new Intl.NumberFormat('es-CL', {
                                    style: 'decimal',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }).format(totals.traysQuanty) + ' unds'
                            }</TableCell>

                            <TableCell style={rowTinyStyle} sx={{ backgroundColor: '#eeeeee' }} className='row-tiny'>
                                {new Intl.NumberFormat('es-CL', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(totals.gross) + ' kg'}
                            </TableCell>
                            <TableCell style={rowTinyStyle} sx={{ backgroundColor: '#eeeeee' }} className='row-tiny'>
                                {new Intl.NumberFormat('es-CL', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(totals.impurityWeight) + ' kg'}
                            </TableCell>
                            <TableCell style={rowTinyStyle} sx={{ backgroundColor: '#eeeeee' }} className='row-tiny'>
                                {new Intl.NumberFormat('es-CL', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(totals.net) + ' kg'}
                            </TableCell>
                            <TableCell style={rowTinyStyle} sx={{ backgroundColor: '#eeeeee' }} className='row-tiny'>
                            </TableCell>
                            <TableCell style={rowTinyStyle} sx={{ backgroundColor: '#eeeeee' }} className='row-tiny'>
                            </TableCell>
                            {/* <TableCell>{totals.toPay.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</TableCell> */}
                        </TableRow>


                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
    return (

        <>
            <Typography variant={'subtitle2'} fontWeight="bold">{'Recepciones'}</Typography>
            <Divider />
            <Box paddingTop={1}
                display="flex"
                justifyContent="space-between"
            >
                <Box flexDirection={'column'} paddingTop={1} display={'flex'}>
                    <Typography sx={{display: global? 'none': 'block'}} variant={'caption'}>{'Productor: ' + reportData.producerName}</Typography>
                    <Typography sx={{display: global? 'none': 'block'}} variant={'caption'}>{'Rut: ' + reportData.producerRut}</Typography>
                    <Typography variant={'caption'}>{'Fecha inicial: ' + reportData.start}</Typography>
                    <Typography variant={'caption'}>{'Fecha final: ' + reportData.end}</Typography>
                </Box>
                {/* <Box flexDirection={'column'} paddingTop={1} display={'flex'}>
                    <Typography variant={'caption'}>{'Bandejas: ' + reportData.traysQuanty + ' unds'}</Typography>
                    <Typography variant={'caption'}>{'Bandejas: ' + reportData.traysWeight + ' kg'}</Typography>
                    <Typography variant={'caption'}>{'Bruto: ' + reportData.gross + ' kg'}</Typography>
                    <Typography variant={'caption'}>{'Impurezas: ' + reportData.impurityWeight + ' kg'}</Typography>
                    <Typography variant={'caption'}>{'Neto: ' +reportData.net + ' kg'}</Typography>
                    <Typography variant={'caption'}>{'A pagar: $' + reportData.toPay}</Typography>
                </Box> */}
            </Box>
            <Box flexDirection={'column'} paddingBottom={1}>
                {receptionsTable({ data: reportData.receptions })}
            </Box>

        </>

    )
}
