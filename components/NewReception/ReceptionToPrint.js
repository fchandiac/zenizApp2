import { Box, Divider, Paper, Typography } from '@mui/material'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import LockIcon from '@mui/icons-material/Lock'
import DoneAllIcon from '@mui/icons-material/DoneAll'

const receptions = require('../../services/receptions')

export default function ReceptionToPrint(props) {
  const { receptionId, returnetTrays } = props
  const [receptionData, setReceptionData] = useState(receptionDataDefault())

  useEffect(() => {
    if (receptionId == 0) {
      return
    } else {
      const fetchData = async () => {
        const rec = await receptions.findOneById(receptionId)
        console.log(rec)
        setReceptionData(rec)
      }
      fetchData()
    }
  }, [receptionId])

  return (
    <>
      <Paper variant='outlined' style={{ padding: '10px', borderColor: 'black' }}>
        <Box>
          <Typography variant='h6' align='center'>ZENIZ</Typography>
        </Box>

        <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' }} />
        <Box display='flex' justifyContent={'center'} flexDirection={'row'}>
          <Typography fontSize={14} align='center'>Recepción: {receptionData.id}</Typography>
          <Typography align='center' paddingLeft={1} display={'inline-flex'}> {receptionData.open ? '' : <LockIcon fontSize={'small'} />}</Typography>
          <Typography align='center' paddingLeft={1} display={'inline-flex'}> {receptionData.settlement ? <DoneAllIcon fontSize={'small'} /> : ''}</Typography>
        </Box>
        <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' }} />
        <Box display='flex' justifyContent='space-between' flexDirection={'column'}>
          <Typography fontSize={10}>Fecha: {moment(receptionData.createdAt).format('DD-MM-YYYY HH:mm')}</Typography>
          <Typography fontSize={10}>Productor: {receptionData.Producer.name}</Typography>
          <Typography fontSize={10}>Rut: {receptionData.Producer.rut}</Typography>
          <Typography fontSize={10}>Guía: {receptionData.guide}</Typography>
          <Typography fontSize={10}>Variedad: {receptionData.Variety.name}</Typography>
          <Typography fontSize={10}>Tipo: {receptionData.Type.name}</Typography>
          <Typography
            sx={{ display: receptionData.money == 'CLP' ? 'block' : 'none' }}
            fontSize={10}
          >Precio: {receptionData.clp.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</Typography>
          <Typography
            sx={{ display: receptionData.money == 'USD' ? 'block' : 'none' }}
            fontSize={10}
          >
            Precio en dolar: {receptionData.usd.toLocaleString('es-CL', { style: 'currency', currency: 'USD' })}
          </Typography>
        </Box>

        <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' }} />

        <Box display='flex' justifyContent='space-between' flexDirection={'column'}>
          <Typography fontSize={10}>Bandejas: {
            new Intl.NumberFormat('es-CL', {
              style: 'decimal',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(receptionData.trays_quanty) + ' unds'
          }</Typography>
          <Typography fontSize={10}>Bruto: {
            new Intl.NumberFormat('es-CL', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(receptionData.gross) + ' kg'
          }</Typography>
          <Typography
            sx={{ display: receptionData.impurity_weight > 0 ? 'block' : 'none' }}
            fontSize={10}>
            Impurezas: {
              new Intl.NumberFormat('es-CL', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(receptionData.impurity_weight) + ' kg'
            }</Typography>
          <Typography fontSize={10}>Neto: {
            new Intl.NumberFormat('es-CL', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(receptionData.net) + ' kg'
          }</Typography>
          <Typography
            sx={{ display: receptionData.to_pay > 0 ? 'block' : 'none' }}
            fontSize={10}>A pagar: {
              receptionData.to_pay.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
            }</Typography>
        </Box>
        <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' }} />

        <Box display='flex' justifyContent='space-between' flexDirection={'column'}>
          <Typography fontSize={14}  >Packs: </Typography>
          {
            receptionData.Packs.map((pack, index) => (
              <Box key={index} display='flex' justifyContent={'space-around'} flexDirection={'row'}>
                <Typography fontSize={10} fontWeight={'bold'}>
                  {pack.id + ':'}
                </Typography>
                <Box display='flex' justifyContent={'space-around'} flexDirection={'column'}>
              <Typography fontSize={10}>
                {pack.Tray.name + ' '}
                {
                  new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(pack.quanty) + ' unds'
                }
                </Typography>

                <Typography fontSize={10}>
                {
                  new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(pack.trays_weight) + ' kg bruto'
                }
                </Typography>

                <Typography fontSize={10}>
                {
                  new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(pack.net) + ' kg neto'
                }
                </Typography>
                </Box>

              </Box>
            ))
          }
        </Box>

        <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' }} />

        <Box  
        sx={{ display: returnetTrays.length > 0 ? 'block' : 'none' }}
        justifyContent='space-between' flexDirection={'column'}>
          <Typography fontSize={14}  >Bandejas devueltas: </Typography>
          {
            returnetTrays.map((tray, index) => (
              <Typography key={index} fontSize={12}>{tray.tray.label}: {tray.quanty}</Typography>
            ))
          }
        </Box>

      </Paper>
    </>
  )
}


function receptionDataDefault() {
  return {
    id: 0,
    Packs: [],
    Producer: { id: 0, name: '', rut: '' },
    createdAt: new Date,
    Variety: { id: 0, name: '' },
    Type: { id: 0, name: '' },
    guide: 0,
    clp: 0,
    usd: 0,
    change: 0,
    money: '',
    trays_quanty: 0,
    trays_weight: 0,
    impurity_weight: 0,
    gross: 0,
    net: 0,
    to_pay: 0,
  }
}

