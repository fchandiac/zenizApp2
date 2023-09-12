import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Typography, Divider, Box, Paper } from '@mui/material'
import React from 'react'

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
                            <TableCell className='row-header-tiny'>id</TableCell>
                            <TableCell className='row-header-tiny'>Bandeja</TableCell>
                            <TableCell className='row-header-tiny'>Tipo</TableCell>
                            <TableCell className='row-header-tiny'>Descripción</TableCell>
                            <TableCell className='row-header-tiny'>Cantidad</TableCell>
                            <TableCell className='row-header-tiny'>Saldo</TableCell>
                            <TableCell className='row-header-tiny'>Fecha</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className='row-tiny'>{item.id}</TableCell>
                                <TableCell className='row-tiny'>{item.trayName}</TableCell>
                                <TableCell className='row-tiny'>{setType(item.type)}</TableCell>
                                <TableCell className='row-tiny'>{item.description}</TableCell>
                                <TableCell className='row-tiny'>{item.quanty}</TableCell>
                                <TableCell className='row-tiny'>{item.balance}</TableCell>
                                <TableCell className='row-tiny'>{item.createdAt}</TableCell>
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
