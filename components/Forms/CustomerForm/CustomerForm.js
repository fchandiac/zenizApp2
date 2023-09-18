import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../../appProvider'
import { Grid, TextField, Button } from '@mui/material'

const customers = require('../../../services/customers')
const utils = require('../../../utils')

export default function CustomerForm(props) {
    const { dialog, edit, closeDialog, afterSubmit, customerData, setCustomerData, gridApiRef } = props
    const { openSnack } = useAppContext()

    const saveCustomer = async () => {
        if (edit) {
          console.log(trayData)
          await update()
        } else {
          await create()
        }
      }

    const create = async () => {
        try {
            const newCustomer = await customers.create(customerData.rut, customerData.name, customerData.phone, customerData.mail, customerData.address)
            console.log(newCustomer)
            openSnack('Cliente ' + newCustomer.name + ' creado correctamente')
            afterSubmit()
        } catch (err) {
            if (err.errors[0].message == 'rut must be unique') {
                openSnack('Rut ya existe', 'error')
              } else if (err.errors[0].message == 'name must be unique') {
                openSnack('Nombre ya existe', 'error')
              }
        }
    }
    const update = async () => {}

    return (
        <>
        <form onSubmit={(e) => { e.preventDefault(); saveCustomer() }} >
          <Grid container direction={'column'} spacing={1}  p={1}>
            <Grid item>
              <TextField
                label='Nombre'
                value={customerData.name}
                onChange={(e) => { setCustomerData({ ...customerData, name: e.target.value }) }}
                variant="outlined"
                size={'small'}
                fullWidth
                required
                autoFocus={dialog ? true : false}
              />
            </Grid>
            <Grid item>
              <TextField
                label='Rut'
                value={customerData.rut}
                onChange={(e) => { setCustomerData({ ...customerData, rut: utils.formatRut(e.target.value) }) }}
                variant="outlined"
                size={'small'}
                fullWidth
                required
              />
            </Grid>
            <Grid item>
                <TextField
                    label='Teléfono'
                    value={customerData.phone}
                    onChange={(e) => { setCustomerData({ ...customerData, phone: e.target.value }) }}
                    variant="outlined"
                    size={'small'}
                    fullWidth
          
                />
            </Grid>
            <Grid item>
                <TextField
                    label='Mail'
                    value={customerData.mail}
                    onChange={(e) => { setCustomerData({ ...customerData, mail: e.target.value }) }}
                    variant="outlined"
                    size={'small'}
                    fullWidth
             
                />
            </Grid>
            <Grid item>
                <TextField
                    label='Dirección'
                    value={customerData.address}
                    onChange={(e) => { setCustomerData({ ...customerData, address: e.target.value }) }}
                    variant="outlined"
                    size={'small'}
                    fullWidth
           
                />
            </Grid>
            <Grid item textAlign={'right'}>
              <Button variant="contained" type='submit'>
                {(edit ? 'Editar' : 'Guardar')}
              </Button>
              <Button
                sx={{ marginLeft: 1, display: dialog ? 'inline-block' : 'none' }}
                variant={'outlined'}
                onClick={() => { closeDialog() }}
              >Cerrar</Button>
            </Grid>
          </Grid>
        </form>
      </>
    )
}
