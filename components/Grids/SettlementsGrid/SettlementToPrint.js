import { Grid, Typography, Box, Divider, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material'
import moment from 'moment'
import React, {useState, useEffect} from 'react'

const settlements = require('../../../services/settlements')
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


export default function SettlementToPrint(props) {
    const { settlement_id} = props
    const [settlement, setSettlement] = useState(settlementDataDefault())

    useEffect(() => {
        const fetchData = async () => {
            const settlementToPrint_ = await settlements.findOneById(settlement_id)
            settlementToPrint_.producerName = settlementToPrint_.Producer.name
            settlementToPrint_.producerRut = settlementToPrint_.Producer.rut
            setSettlement(settlementToPrint_)
            console.log('settlementToPrint_', settlementToPrint_)
          
        }

        fetchData()
    }, [])

    



    const calculateTotals = (data) => {
        const totals = {
            traysQuanty: 0,
            // traysWeight: 0,
            gross: 0,
            // impurityWeight: 0,
            net: 0,
            toPay: 0,
        };

        data.forEach((item) => {
            totals.traysQuanty += item.trays_quanty;
            // totals.traysWeight += item.trays_weight;
            totals.gross += item.gross;
            // totals.impurityWeight += item.impurity_weight;
            totals.net += item.net;
            totals.toPay += item.to_pay;
        });

        return totals;
    }

    const table = ({ data }) => {
        const totals = calculateTotals(data)
        return (
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={rowHeaderTinyStyle}>Recepción</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Fecha</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Variedad</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Bandejas</TableCell>
                            {/* <TableCell style={rowHeaderTinyStyle}>Bandejas</TableCell> */}
                            <TableCell style={rowHeaderTinyStyle}>Bruto</TableCell>
                            {/* <TableCell style={rowHeaderTinyStyle}>Impurezas</TableCell> */}
                            <TableCell style={rowHeaderTinyStyle}>Neto</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Precio Kg</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>A pagar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell style={rowTinyStyle}>{item.id}</TableCell>
                                <TableCell style={rowTinyStyle}>{moment(item.createdAt).format('DD-MM-YYYY HH:00')}</TableCell>
                                <TableCell style={rowTinyStyle}>{item.Variety.name}</TableCell>
                                <TableCell style={rowTinyStyle}>{

                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(item.trays_quanty) + ' unds'
                                }</TableCell>
                                {/* <TableCell style={rowTinyStyle}>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.trays_weight) + ' kg'
                                }</TableCell > */}
                                <TableCell style={rowTinyStyle}>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.gross) + ' kg'
                                }</TableCell>
                                {/* <TableCell style={rowTinyStyle}>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.impurity_weight) + ' kg'
                                }</TableCell> */}
                                <TableCell style={rowTinyStyle}>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(item.net) + ' kg'
                                }</TableCell>
                                <TableCell style={rowTinyStyle}>{item.clp.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</TableCell>
                                <TableCell style={rowTinyStyle}>{item.to_pay.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</TableCell>
                            </TableRow>
                        ))}

                        <TableRow>
                            <TableCell sx={{backgroundColor: '#eeeeee', textAlign: 'right'}} style={rowTinyStyle}>TOTALES</TableCell>
                            <TableCell sx={{backgroundColor: '#eeeeee'}} style={rowTinyStyle}></TableCell>
                            <TableCell sx={{backgroundColor: '#eeeeee'}} style={rowTinyStyle}></TableCell>
                            <TableCell sx={{backgroundColor: '#eeeeee'}} style={rowTinyStyle}>{totals.traysQuanty} unds</TableCell>
                            {/* <TableCell sx={{backgroundColor: '#eeeeee'}} style={rowTinyStyle}>{totals.traysWeight.toFixed(2)} kg</TableCell> */}
                            <TableCell sx={{backgroundColor: '#eeeeee'}} style={rowTinyStyle}>{totals.gross.toFixed(2)} kg</TableCell>
                            {/* <TableCell sx={{backgroundColor: '#eeeeee'}} style={rowTinyStyle}>{totals.impurityWeight.toFixed(2)} kg</TableCell> */}
                            <TableCell sx={{backgroundColor: '#eeeeee'}} style={rowTinyStyle}>{totals.net.toFixed(2)} kg</TableCell>
                            <TableCell sx={{backgroundColor: '#eeeeee'}} style={rowTinyStyle}></TableCell>
                            <TableCell sx={{backgroundColor: '#eeeeee'}} style={rowTinyStyle}>
                                {totals.toPay.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                            </TableCell>
                        </TableRow>
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
                {table({ data: settlement.Receptions })}
            </Box>

        </>
    )
}


function settlementDataDefault() {
    return{
        id: 0,
        producerName: '',
        producerRut: '',
        amount: 0,
        description: '',
        createdAt: '',
        Receptions: []

    }
}