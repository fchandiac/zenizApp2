import { Grid, Typography, Divider, Box, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material'
import { set } from 'date-fns'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

const dispatchs = require('../../../services/dispatchs')

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


export default function DistpatchToPrint(props) {
    const { dispatchId } = props
    const [dispatch, setDispatch] = useState(dispatchDataDefault())
    const [pallets, setPallets] = useState([])

    useEffect(() => {
        console.log(dispatchId)
        const fetchData = async () => {
            const dispatch = await dispatchs.findOneById(dispatchId)
            setDispatch({
                id: dispatch.id,
                customerId: dispatch.CustomerId,
                custmerName: dispatch.Customer.name,
                customerRut: dispatch.Customer.rut,
                guide: dispatch.guide,
                clp: dispatch.clp,
                usd: dispatch.usd,
                change: dispatch.change,
                money: dispatch.money,
                palletsQuanty: dispatch.pallets_quanty,
                palletsWeight: dispatch.pallets_weight,
                impurityWeight: dispatch.impurity_weight,
                gross: dispatch.gross,
                net: dispatch.net,
                to_pay: dispatch.to_pay,
                open: dispatch.open,
                createdAt: dispatch.createdAt,
                Pallets: dispatch.Pallets
            })


            let pallets = dispatch.Pallets.map(pallet => {
                let packs = pallet.Packs
                let sumTrayQuantys = 0
                let sumTraysWeight = 0
                let sumNet = 0
                for (const pack of packs) {
                    sumTrayQuantys += pack.quanty
                    sumTraysWeight += pack.trays_weight
                    sumNet += pack.net
                }

                return ({
                    id: pallet.id,
                    trayName: pallet.Tray.name,
                    traysQuanty: sumTrayQuantys,
                    traysWeight: sumTraysWeight,
                    receptionNet: sumNet,
                    decrease: pallet.decrease_weight,
                    dispatchNet: sumNet - pallet.decrease_weight

                })
            })
            setPallets(pallets)
        }
        fetchData()

    }, [])

    const calculateTotals = (data) => {
        let totalTraysQuanty = 0;
        let totalTraysWeight = 0;
        let totalReceptionNet = 0;
        let totalDecrease = 0;
        let totalDispatchNet = 0;

        data.forEach((item) => {
            totalTraysQuanty += item.traysQuanty;
            totalTraysWeight += item.traysWeight;
            totalReceptionNet += item.receptionNet;
            totalDecrease += item.decrease;
            totalDispatchNet += item.dispatchNet;
        });

        return ({
            totalTraysQuanty: totalTraysQuanty,
            totalTraysWeight: totalTraysWeight,
            totalReceptionNet: totalReceptionNet,
            totalDecrease: totalDecrease,
            totalDispatchNet: totalDispatchNet

        })
    };



    const table = (data) => {
        const total = calculateTotals(data)




        return (
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={rowHeaderTinyStyle}>Id pallet</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Bandeja</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Bandejas</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Bandejas</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Neto recepción</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Merma</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Neto despacho</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell style={rowTinyStyle}>{item.id}</TableCell>
                                <TableCell style={rowTinyStyle}>{item.trayName}</TableCell>
                                <TableCell style={rowTinyStyle}>{
                                    new Intl.NumberFormat('es-CL', {
                                        style: 'decimal',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(item.traysQuanty) + ' unds'
                                }</TableCell>
                                <TableCell style={rowTinyStyle}>{item.traysWeight}</TableCell>
                                <TableCell style={rowTinyStyle}>{item.receptionNet}</TableCell>
                                <TableCell style={rowTinyStyle}>{item.decrease}</TableCell>
                                <TableCell style={rowTinyStyle}>{item.dispatchNet}</TableCell>
                            </TableRow>
                        ))}
                        {/* Fila de totales */}
                        <TableRow>
                            <TableCell colSpan={2} sx={{ backgroundColor: '#eeeeee' }} className='row-header-tiny'>Totales:</TableCell>
                            <TableCell sx={{ backgroundColor: '#eeeeee' }} style={rowTinyStyle}>{total.totalTraysQuanty}</TableCell>
                            <TableCell sx={{ backgroundColor: '#eeeeee' }} style={rowTinyStyle}>{total.totalTraysWeight}</TableCell>
                            <TableCell sx={{ backgroundColor: '#eeeeee' }} style={rowTinyStyle}>{total.totalReceptionNet}</TableCell>
                            <TableCell sx={{ backgroundColor: '#eeeeee' }} style={rowTinyStyle}>{total.totalDecrease}</TableCell>
                            <TableCell sx={{ backgroundColor: '#eeeeee' }} style={rowTinyStyle}>{total.totalDispatchNet}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };


    return (
        <>

            <Typography variant={'subtitle2'} fontWeight="bold">{'Despacho ' + dispatch.id}</Typography>
            <Divider />
            <Box flexDirection={'row'} paddingTop={1} display={'flex'}>
                <Box flexDirection={'column'} display={'flex'} paddingRight={1}>
                    <Typography variant={'caption'}>{'Cliente: ' + dispatch.custmerName}</Typography>
                    <Typography variant={'caption'}>{'Rut: ' + dispatch.customerRut}</Typography>
                    <Typography variant={'caption'}>{'Guía: ' + dispatch.guide}</Typography>
                    <Typography variant={'caption'}>{'Precio kg ' + dispatch.clp.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</Typography>
                    <Typography variant={'caption'}>{'Dolar ' + dispatch.usd.toLocaleString('es-CL', { style: 'currency', currency: 'USD' })}</Typography>
                    <Typography variant={'caption'}>{'Cambio ' + dispatch.change.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</Typography>

                </Box>
                <Box flexDirection={'column'} display={'flex'}>
                    <Typography variant={'caption'}>{'Pallets ' +
                        new Intl.NumberFormat('es-CL', {
                            style: 'decimal',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }).format(dispatch.palletsQuanty) + ' unds'
                    }</Typography>
                    <Typography variant={'caption'}>{'Pallets ' +
                        new Intl.NumberFormat('es-CL', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(dispatch.palletsWeight) + ' kg'
                    }</Typography>
                    <Typography variant={'caption'}>{'Bruto ' +
                        new Intl.NumberFormat('es-CL', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(dispatch.gross) + ' kg'
                    }</Typography>
                    <Typography variant={'caption'}>{'Neto ' +
                        new Intl.NumberFormat('es-CL', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(dispatch.net) + ' kg'
                    }</Typography>
                    <Typography variant={'caption'}>{'Pago a recibir ' + dispatch.to_pay.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</Typography>
                    <Typography variant={'caption'}>{'Fecha: ' + moment(dispatch.createdAt).format('DD-MM-YYYY HH:ss')}</Typography>

                </Box>

            </Box>
            <Box flexDirection={'column'} paddingBottom={1}>
                {table(pallets)}
            </Box>

        </>
    )
}

function dispatchDataDefault() {
    return ({
        id: 1002,
        customerId: 1001,
        custmerName: '',
        customerRut: '',
        guide: "",
        clp: 0,
        usd: 0,
        change: 0,
        money: "CLP",
        palletsQuanty: 1,
        palletsWeight: 5,
        impurityWeight: 0,
        gross: 0,
        net: -5,
        to_pay: 0,
        open: true,
        createdAt: '',
        Pallets: []
    })
}
