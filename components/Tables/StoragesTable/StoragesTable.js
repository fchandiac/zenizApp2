import React, { useState, useEffect } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { IconButton, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, DialogActions,
Dialog, DialogTitle, DialogContent, Button
} from '@mui/material'
import StorageForm from '../../Forms/StorageForm/StorageForm'

const storages = require('../../../services/storages')


export default function StoragesTable() {
    const [storagesList, setStoragesList] = useState([])
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openCreateDialog, setOpenCreateDialog] = useState(false)
    const [storageData, setStorageData] = useState({id:0, name: ''})
    const [update, setUpdate] = useState(false)
  


    useEffect(() => {
        const fecthData = async () => {
            const storages_ = await storages.findAll()
            console.log(storages_)
            setStoragesList(storages_)
        }
        fecthData()
    }, [update])

    const update_ = () => {
        setUpdate(!update)
    }




    return (
        <>
            <TableContainer m component={Paper} variant='outlined'
                sx={{
                    padding: 0, maxHeight: '30vh', overflowY: 'auto',
                    width: 'auto',
                    margin: 1,
                    marginRight: 0

                }} >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <IconButton
                                    onClick={() => {
                                        setOpenCreateDialog(true)
                                    } }
                                ><AddCircleIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                                Almacenes
                                </TableCell>
                            <TableCell align="right">{' '}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {storagesList.map((storage) => (
                            <TableRow key={storage.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 'none' } }}
                            >
                                <TableCell align={'left'} component="th" scope="row"
                                    sx={{ fontSize: 12 }}
                                >
                                    {storage.name}
                                </TableCell>
                                <TableCell className='row-tiny'>
                                    <IconButton
                                        onClick={() => {
                                            setStorageData({id: storage.id, name: storage.name})
                                            setOpenEditDialog(true)
                                         }}

                                    ><EditIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openCreateDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Nuevo almacén</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <StorageForm
                        edit={false}
                        storageData={storageData}
                        setStorageData={setStorageData}
                        afterSubmit={() => {
                            update_()
                        }}
                        closeDialog={() => { setOpenCreateDialog(false) }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={openEditDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ padding: 2 }}>Ediatr almacén</DialogTitle>
                <DialogContent sx={{ padding: 1 }}>
                    <StorageForm
                        edit={true}
                        storageData={storageData}
                        setStorageData={setStorageData}
                        afterSubmit={() => {update_()}}
                        closeDialog={() => { setOpenEditDialog(false) }}
                    />
                </DialogContent>
            </Dialog>
        </>
    )





}
