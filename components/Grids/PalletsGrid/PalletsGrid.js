import React, { useState, useEffect } from 'react'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Box } from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import Barcode from 'react-barcode'

import DataGrid from '../../Karmextron/DataGrid/DataGrid'
import PalletPackCard from '../../Cards/PalletPackCard/PalletPackCard';
import PrintDialog from '../../PrintDialog/PrintDialog'

const pallets = require('../../../services/pallets')


export default function PalletsGrid(props) {
    const {update} = props
    const [gridApiRef, setGridApiRef] = useState(null)
    const [palletsList, setPalletsList] = useState([])
    const [openInfoDialog, setOpenInfoDialog] = useState(false)
    const [openPacksDialog, setOpenPacksDialog] = useState(false)
    const [rowData, setRowData] = useState(rowDataDefault())
    const [openPrintDialog, setOpenPrintDialog] = useState(false)

    useEffect(() => {
        pallets.findAll()
            .then(res => {
                console.log(res)
                let data = res.map(pallet => ({
                    id: pallet.id,
                    storageName: pallet.Storage.name,
                    trayName: pallet.Tray == null ? '': pallet.Tray.name,
                    weight: pallet.weight,
                    trays: pallet.trays,
                    max: pallet.max,
                    packs: pallet.Packs,
                    dispatch: pallet.dispatch ? 'Si' : 'No',
                    dispatchId: pallet.dispatch_id == null ? '' : pallet.dispatch_id
                }))
                setPalletsList(data)
            })
            .catch(err => { console.log(err) })

    }, [update])

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number' },
        { field: 'storageName', headerName: 'Almacen', flex: 1 },
        { field: 'trayName', headerName: 'Bandeja', flex: 1 },
        { field: 'weight', headerName: 'Peso', flex: 1 },
        { field: 'trays', headerName: 'Bandejas', flex: 1 },
        { field: 'max', headerName: 'Max', flex: 1 },
        {
            field: 'dispatch', headerName: 'Despacho', flex: 1,
            renderCell: (params) => {
                return params.row.dispatch === 'Si' ? 
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <LocalShippingIcon color='success' sx={{paddingRight:1}} /> 
                {params.row.dispatchId}
                </Box>: 
                <LocalShippingIcon />

            }
        },
        {
            field: 'actions',
            headerName: '',
            type: 'actions', flex: .8, getActions: (params) => [
                <GridActionsCellItem
                    label='delete'
                    icon={<DeleteIcon />}
                    onClick={() => {

                    }}
                />,
                <GridActionsCellItem
                    label='print'
                    icon={<PrintIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            storageName: params.row.storageName,
                            trayName: params.row.trayName,
                            weight: params.row.weight,
                            trays: params.row.trays,
                            max: params.row.max,
                            packs: params.row.packs
                        })
                        setOpenPrintDialog(true)

                    }}
                />,
                <GridActionsCellItem
                    label='packs'
                    icon={<ViewQuiltIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            storageName: params.row.storageName,
                            trayName: params.row.trayName,
                            weight: params.row.weight,
                            trays: params.row.trays,
                            max: params.row.max,
                            packs: params.row.packs
                        })

                        setOpenPacksDialog(true)
                    }}
                />
            ]
        }
    ]

    return (
        <>

            <DataGrid title='Pallets' rows={palletsList} columns={columns} height='80vh' setGridApiRef={setGridApiRef} />

            <Dialog open={openPacksDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}> Packs en Pallet {rowData.id}</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>

                    <Grid container>
                        {rowData.packs.map((pack) => (
                            <Grid item key={pack.id} xs={4}>
                                <PalletPackCard pack={pack} />
                            </Grid>
                        ))}
                    </Grid>


                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button variant='contained' onClick={() => setOpenPacksDialog(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            <PrintDialog
                open={openPrintDialog}
                setOpen={setOpenPrintDialog}
                title='Imprimir etiqueta'
                maxWidth={'xs'}
            >
                <Typography variant={'subtitle1'} fontWeight="bold" align='center'>{'ZENIZ'}</Typography>
                <Typography variant={'subtitle2'} fontWeight="bold" align='center'>{'Pallet ' + rowData.id}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Barcode value={rowData.id.toString()} />
                </Box>
            </PrintDialog>
        </>
    )
}

function rowDataDefault() {
    return ({
        rowId: '',
        id: '',
        storageName: '',
        trayName: '',
        weight: '',
        trays: '',
        max: '',
        packs: []

    })
}