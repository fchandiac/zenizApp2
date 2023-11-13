import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Typography, Divider, Box, Paper } from '@mui/material'
import moment from 'moment/moment'
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

export default function TraysReportToPrint(props) {
    const { reportData } = props

    const setType = (type) => {
        switch (type) {
            case 0:
                return 'Entrada'
            case 1:
                return 'Egreso'
            case 2:
                return 'Devolución al productor'
            case 3:
                return 'Recepción'
            default:
                return ''
        }
    }


    const table = ({ data }) => {
        return (
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={rowHeaderTinyStyle}>id</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Bandeja</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Tipo</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Descripción</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Cantidad</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Saldo</TableCell>
                            <TableCell style={rowHeaderTinyStyle}>Fecha</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell style={rowTinyStyle}>{item.id}</TableCell>
                                <TableCell style={rowTinyStyle}>{item.trayName}</TableCell>
                                <TableCell style={rowTinyStyle}>{setType(item.type)}</TableCell>
                                <TableCell style={rowTinyStyle}>{item.description}</TableCell>
                                <TableCell style={rowTinyStyle}>{item.quanty}</TableCell>
                                <TableCell style={rowTinyStyle}>{item.balance}</TableCell>
                                <TableCell style={rowTinyStyle}>{moment(item.createdAt).format('DD-MM-YYYY HH:mm')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
    return (
        <>
            <Typography variant={'subtitle2'} fontWeight="bold">{'Bandejas'}</Typography>
            <Divider />
            <Box flexDirection={'column'} paddingTop={1} display={'flex'}>
                <Typography variant={'caption'}>{'Productor: ' + reportData.producerName}</Typography>
                <Typography variant={'caption'}>{'Rut: ' + reportData.producerRut}</Typography>
            </Box>
            <Box flexDirection={'column'} paddingBottom={1}>
                {table({ data: reportData.movements })}
            </Box>

        </>
    )
}
