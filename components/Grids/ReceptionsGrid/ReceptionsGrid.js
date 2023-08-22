import React, { useState, useEffect } from 'react'
import DataGrid from '../../Karmextron/DataGrid/DataGrid'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material'
import PackCard from '../../Cards/PackCard/PackCard'

const receptions = require('../../../services/receptions')

export default function ReceptionsGrid() {
    const [gridApiRef, setGridApiRef] = useState(null)
    const [receptionsList, setReceptionsList] = useState([])
    const [openInfoDialog, setOpenInfoDialog] = useState(false)
    const [openPacksDialog, setOpenPacksDialog] = useState(false)
    const [rowData, setRowData] = useState(rowDataDefault())

    useEffect(() => {
        receptions.findAll().then(res => {
            let data = res.map(reception => ({
                id: reception.id,
                producerName: reception.Producer.name,
                producerRut: reception.Producer.rut,
                varietyName: reception.Variety.name,
                typeName: reception.Type.name,
                guide: reception.guide,
                clp: reception.clp,
                usd: reception.usd,
                change: reception.change,
                money: reception.money,
                traysQuanty: reception.trays_quanty,
                traysWeight: reception.trays_weight,
                gross: reception.gross,
                net: reception.net,
                packs: reception.Packs
            }))
            console.log(data)
            setReceptionsList(data)

        })
    }, [])

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number' },
        { field: 'producerName', headerName: 'Productor', flex: 1 },
        { field: 'producerRut', headerName: 'Rut', flex: 1 },
        { field: 'varietyName', headerName: 'Variedad', flex: 1 },
        { field: 'typeName', headerName: 'Tipo', flex: 1, hide: true },
        { field: 'guide', headerName: 'Guía', flex: 1, hide: true },
        { field: 'clp', headerName: 'CLP', flex: 1, hide: true },
        { field: 'usd', headerName: 'USD', flex: 1, hide: true },
        { field: 'change', headerName: 'Cambio', flex: 1, hide: true },
        { field: 'money', headerName: 'Moneda', flex: 1, hide: true },
        { field: 'traysQuanty', headerName: 'Cantidad de Bandejas', flex: 1 },
        { field: 'traysWeight', headerName: 'Peso de Bandejas', flex: 1 },
        { field: 'gross', headerName: 'Bruto', flex: 1 },
        { field: 'net', headerName: 'Neto', flex: 1 },
        {
            field: 'actions',
            headerName: '',
            type: 'actions', flex: 1, getActions: (params) => [
                <GridActionsCellItem
                    label='delete'
                    icon={<DeleteIcon />}
                    onClick={() => {

                    }}
                />,
                <GridActionsCellItem
                    label='info'
                    icon={<InfoIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            producerName: params.row.producerName,
                            producerRut: params.row.producerRut,
                            varietyName: params.row.varietyName,
                            typeName: params.row.typeName,
                            guide: params.row.guide,
                            clp: params.row.clp,
                            usd: params.row.usd,
                            change: params.row.change,
                            money: params.row.money,
                            traysQuanty: params.row.traysQuanty,
                            traysWeight: params.row.traysWeight,
                            gross: params.row.gross,
                            net: params.row.net,
                            packs: params.row.packs
                        })
                        console.log(rowData)
                        setOpenInfoDialog(true)
                    }}
                />,
                <GridActionsCellItem
                    label='packs'
                    icon={<ViewQuiltIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            producerName: params.row.producerName,
                            producerRut: params.row.producerRut,
                            varietyName: params.row.varietyName,
                            typeName: params.row.typeName,
                            guide: params.row.guide,
                            clp: params.row.clp,
                            usd: params.row.usd,
                            change: params.row.change,
                            money: params.row.money,
                            traysQuanty: params.row.traysQuanty,
                            traysWeight: params.row.traysWeight,
                            gross: params.row.gross,
                            net: params.row.net,
                            packs: params.row.packs
                        })
                        console.log(rowData)
                        setOpenPacksDialog(true)
                    }}
                />
            ]
        }
    ]
    return (
        <>
            <DataGrid title='Recepciones' rows={receptionsList} columns={columns} height='80vh' setGridApiRef={setGridApiRef} />

            <Dialog open={openInfoDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}> Información recepción {rowData.id}</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <Grid>
                        

                    </Grid>
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button variant='contained' onClick={() => setOpenInfoDialog(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openPacksDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}> Packs recepción {rowData.id}</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <Grid>
                        {rowData.packs.map((pack) => (
                            <Grid item key={pack.id}>
                                <PackCard pack={pack} />
                            </Grid>
                        ))}

                    </Grid>
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button variant='contained' onClick={() => setOpenPacksDialog(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}


function rowDataDefault() {
    return ({
        rowId: '',
        id: '',
        producerName: '',
        producerRut: '',
        varietyName: '',
        typeName: '',
        guide: '',
        clp: '',
        usd: '',
        change: '',
        money: '',
        traysQuanty: '',
        traysWeight: '',
        gross: '',
        net: '',
        packs: []
    })
}