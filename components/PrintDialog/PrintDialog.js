import React, {useEffect, useRef, useState} from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, FormControlLabel,
    Switch, TextField, InputAdornment, Autocomplete, Box,
} from '@mui/material'

import { useReactToPrint } from 'react-to-print' 


export default function PrintDialog(props) {
    const { open, setOpen, title, children, dialogWidth} = props
    const printRef = useRef(null)

    const print = useReactToPrint({
        content: () => printRef.current,
      })


  return (
    <>
            <Dialog open={open}   sx={{alignContent:'center'}} fullWidth maxWidth={dialogWidth} >
                <DialogTitle sx={{ padding: 2, displayPrint: false }}>
                    {title}
                </DialogTitle>
                <DialogContent sx={{ padding: 1}} ref={printRef}>
                 
                    {children}
                  
                </DialogContent>
                <DialogActions sx={{ padding: 2, displayPrint: false }}>
                    <Button variant='contained' onClick={() => print()}>Imprimir</Button>
                    <Button variant='outlined' onClick={() => setOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
  )
}
