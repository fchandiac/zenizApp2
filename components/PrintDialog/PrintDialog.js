import React, {useEffect, useRef, useState} from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, FormControlLabel,
    Switch, TextField, InputAdornment, Autocomplete,
} from '@mui/material'

export default function PrintDialog(props) {
    const { open, setOpen, title, content,  width} = props


    const printRef = useRef(null)

  

    const print = () => {
        const content = printRef.current;

    if (content) {
      // Abre un cuadro de diálogo de impresión del navegador.
      window.print();
    }
       
    }
  return (
    <>
            <Dialog open={open} fullWidth maxWidth={false} style={{ maxWidth: width }}>
                <DialogTitle sx={{ padding: 2, displayPrint: false }}>
                    {title}
                </DialogTitle>
                <DialogContent sx={{ padding: 1 }} ref={printRef}>
                    {content}
                </DialogContent>
                <DialogActions sx={{ padding: 2, displayPrint: false }}>
                    <Button variant='contained' onClick={() => print()}>Imprimir</Button>
                    <Button variant='outlined' onClick={() => setOpen(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
  )
}
