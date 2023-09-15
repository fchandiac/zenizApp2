import React from 'react'
import { Grid, TextField, Button } from '@mui/material'


const storages = require('../../../services/storages')

export default function StorageForm(props) {
    const {edit, storageData, setStorageData, afterSubmit, closeDialog} = props

    const saveStorage = async () => {
        if (edit) {
            await update()
        } else {
            await create()
        }
    }


    const create = async () => {
        const res = await storages.create(storageData.name)
        closeDialog()
        setStorageData({id:0, name: ''})
        afterSubmit()
    }

    const update = async () => {
        const res = await storages.update(storageData.id, storageData.name)
        closeDialog()
        setStorageData({id:0, name: ''})
        afterSubmit()
    }

  return (
    <>  
         <form onSubmit={(e) => { e.preventDefault(); saveStorage() }} >
        <Grid container direction={'column'} p={1} spacing={1}>
          <Grid item>
            <TextField
              label='Nombre'
              value={storageData.name}
              onChange={(e) => { setStorageData({ ...storageData, name: e.target.value }) }}
              variant="outlined"
              size={'small'}
              fullWidth
              required
            />
          </Grid>
          <Grid item textAlign={'right'}>
            <Button variant="contained" type='submit'>
              {(edit ? 'Editar' : 'Guardar')}
            </Button>
            {' '}
            <Button
              variant={'outlined'}
              onClick={() => { closeDialog() }}
            >Cerrar</Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}
