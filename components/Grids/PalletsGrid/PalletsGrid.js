import React, { useState, useEffect } from 'react'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Box, Paper } from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import Barcode from 'react-barcode'
import EditIcon from '@mui/icons-material/Edit'

import DataGrid from '../../Karmextron/DataGrid/DataGrid'
import PalletPackCard from '../../Cards/PalletPackCard/PalletPackCard';
import PrintDialog from '../../PrintDialog/PrintDialog'
import PalletForm from '../../Forms/PalletForm/PalletForm'
import { useAppContext } from '../../../appProvider'

const pallets = require('../../../services/pallets')


export default function PalletsGrid(props) {
    const { update } = props
    const {user, openSnack} = useAppContext()
    const [gridApiRef, setGridApiRef] = useState(null)
    const [palletsList, setPalletsList] = useState([])
    const [openInfoDialog, setOpenInfoDialog] = useState(false)
    const [openPacksDialog, setOpenPacksDialog] = useState(false)
    const [rowData, setRowData] = useState(rowDataDefault())
    const [openPrintDialog, setOpenPrintDialog] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false)


    useEffect(() => {
        pallets.findAll()
            .then(res => {
                console.log(res)
                let data = res.map(pallet => ({
                    id: pallet.id,
                    storageName: pallet.Storage.name,
                    trayName: pallet.Tray == null ? '' : pallet.Tray.name,
                    weight: pallet.weight,
                    trays: pallet.trays,
                    tray: { id: pallet.tray_id, key: pallet.tray_id, label: pallet.Tray == null ? '' : pallet.Tray.name },
                    max: pallet.max,
                    Storage: { id: pallet.storage_id, key: pallet.storage_id, label: pallet.Storage.name },
                    packs: pallet.Packs,
                    dispatch: pallet.dispatch,
                    dispatchId: pallet.dispatch_id == null ? '' : pallet.dispatch_id
                }))
                setPalletsList(data)
            })
            .catch(err => { console.log(err) })

    }, [update])


    const showDelete = (dispatch, packs) => {

        if (dispatch || packs.length > 0 || user.Profile.delete == false) {
            return false
        }

        return true
    }

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number', valueFormatter: (params) => params.value },
        { field: 'storageName', headerName: 'Almacen', flex: 1 },
        { field: 'trayName', headerName: 'Bandeja', flex: 1 },
        {
            field: 'weight', headerName: 'Peso', flex: 1,
            valueFormatter: (params) =>
                new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(params.value) + ' kg'
        },
        { field: 'trays', headerName: 'Bandejas', flex: 1 },
        { field: 'max', headerName: 'Max', flex: 1 },
        {
            field: 'dispatch', headerName: 'Despacho', flex: 1,

            renderCell: (params) => {
                return params.row.dispatch === true ?
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <LocalShippingIcon color='success' sx={{ paddingRight: 1 }} />
                        {params.row.dispatchId}
                    </Box> :
                    <Box sx={{ display: 'flex', justifyContent: 'center', color: '#e0e0e0' }}>
                        <LocalShippingIcon />
                    </Box>

            }
        },
        {
            field: 'actions',
            headerName: '',
            headerClassName: 'data-grid-last-column-header',
            type: 'actions', flex: 1.2, getActions: (params) => [
                <GridActionsCellItem
                    sx={{ display: showDelete(params.row.dispatch, params.row.packs) ? 'inline-flex' : 'none' }}
                    label='delete'
                    icon={<DeleteIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            storageName: params.row.storageName,
                            trayName: params.row.trayName,
                            weight: params.row.weight,
                            trays: params.row.trays,
                            tray: params.row.tray,
                            max: params.row.max,
                            packs: params.row.packs,
                            storage: params.row.Storage
                        })
                        openSnack('El Pallet tiene Packs asociadas', 'error')

                    }}
                />,
                <GridActionsCellItem
                    // si no tiene permisos
                    // si fue despachado
                    // si tiene packs asociadas
                    sx={{ display: params.row.dispatch ? 'none' : 'inline-flex' }}
                    label='edit'
                    icon={<EditIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            storageName: params.row.storageName,
                            trayName: params.row.trayName,
                            weight: params.row.weight,
                            trays: params.row.trays,
                            tray: params.row.tray,
                            max: params.row.max,
                            packs: params.row.packs,
                            storage: params.row.Storage
                        })
                        setOpenEditDialog(true)

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
                    sx={{ display: params.row.packs.length > 0 ? 'inline-flex' : 'none' }}
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

            <Dialog open={openEditDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Editar Pallet {rowData.id}</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <Grid container spacing={1} direction={'column'} paddingTop={1}>
                        <PalletForm
                            dialog={true}
                            closeDialog={() => setOpenEditDialog(false)}
                            afterSubmit={() => {

                                setRowData(rowDataDefault())

                            }}
                            palletData={rowData}
                            setPalletData={setRowData}
                            edit={true}
                            gridApiRef={gridApiRef}
                        />
                    </Grid>
                </DialogContent>
            </Dialog>

            <Dialog open={openPacksDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}> Packs en Pallet {rowData.id}</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <Grid container spacing={1}>
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
                dialogWidth={'xs'}
            >
                <Paper variant='outlined' sx={{ padding: 1, borderColor: 'black', width:'90mm' }}>
                    <Typography variant={'subtitle1'} fontWeight="bold" align='center'>{'ZENIZ'}</Typography>
                    <Typography variant={'subtitle2'} fontWeight="bold" align='center'>{'Pallet ' + rowData.id}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Barcode value={rowData.id.toString()} />
                    </Box>
                </Paper>
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