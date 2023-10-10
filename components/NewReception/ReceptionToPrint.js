import { Box, Divider, Paper, Typography } from '@mui/material'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import LockIcon from '@mui/icons-material/Lock'
import DoneAllIcon from '@mui/icons-material/DoneAll'

const receptions = require('../../services/receptions')
const traysMovements = require('../../services/traysMovements')


export default function ReceptionToPrint(props) {
  const { receptionId} = props
  const [receptionData, setReceptionData] = useState(receptionDataDefault())
  const [returnedTraysData, setReturnedTraysData] = useState([])
  const [totalReturneds, setTotalReturneds] = useState(0) 

  useEffect(() => {
    if (receptionId == 0) {
      return
    } else {
      const fetchData = async () => {
        const rec = await receptions.findOneById(receptionId)
        const trays = await traysMovements.findAllByReception(receptionId)
        let filterTrays =  trays.filter(tray => tray.type == 2)

        let sumReturneds = filterTrays.reduce((a, b) => a + b.quanty, 0)

        setReturnedTraysData(filterTrays)
        setTotalReturneds(sumReturneds)
        setReceptionData(rec)

      }
      fetchData()
    }
  }, [receptionId])

  const showToPay = (receptionData) => {
    if ( receptionData.clp > 1)
      return true
    else
      return false
  }

  return (
    <>
      <Paper variant='outlined' style={{ padding: '5px', borderColor: 'black', width:'55mm' }}>
        <Box>
          <Typography variant='h6' align='center'>ZENIZ</Typography>
        </Box>

        <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' }} />
        <Box display='flex' justifyContent={'center'} flexDirection={'row'}>
          <Typography fontWeight="bold" fontSize={14} align='center'>Recepción: {receptionData.id}</Typography>
          <Typography fontWeight="bold" align='center' paddingLeft={1} display={'inline-flex'}> {receptionData.open ? '' : <LockIcon fontSize={'small'} />}</Typography>
          <Typography  fontWeight="bold"align='center' paddingLeft={1} display={'inline-flex'}> {receptionData.settlement ? <DoneAllIcon fontSize={'small'} /> : ''}</Typography>
        </Box>
        <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' }} />
        <Box display='flex' justifyContent='space-between' flexDirection={'column'}>
          <Typography fontSize={10} fontWeight="bold">Fecha: {moment(receptionData.createdAt).format('DD-MM-YYYY HH:mm')}</Typography>
          <Typography fontSize={10} fontWeight="bold">Productor: {receptionData.Producer.name}</Typography>
          <Typography fontSize={10} fontWeight="bold">Rut: {receptionData.Producer.rut}</Typography>
          <Typography fontSize={10} fontWeight="bold">Guía: {receptionData.guide}</Typography>
          <Typography fontSize={10} fontWeight="bold">Variedad: {receptionData.Variety.name}</Typography>
          <Typography fontSize={10} fontWeight="bold">Tipo: {receptionData.Type.name}</Typography>
          <Typography
            sx={{  display: receptionData.money == 'CLP' ? 'block' : 'none'  }}
            fontSize={10}
            fontWeight="bold"
          >Precio por kg: {receptionData.clp.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</Typography>
          <Typography
            sx={{ display: receptionData.money == 'USD' ? 'block' : 'none' }}
            fontSize={10}
            fontWeight="bold"
          >
            Precio en dolar: {receptionData.usd.toLocaleString('es-CL', { style: 'currency', currency: 'USD' })}
          </Typography>
          <Typography
          fontWeight="bold"
            sx={{ display: showToPay == true ? 'block' : 'none' }}
            fontSize={10}
          >
            A pagar: {receptionData.to_pay.toLocaleString('es-CL', { style: 'currency', currency: 'USD' })}
          </Typography>
        </Box>

        <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' }} />

        <Box display='flex' justifyContent='space-between' flexDirection={'column'}>
          <Typography fontSize={10} fontWeight="bold">Bandejas: {
            new Intl.NumberFormat('es-CL', {
              style: 'decimal',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(receptionData.trays_quanty) + ' unds'
          }</Typography>
          <Typography fontSize={10} fontWeight="bold">Bruto: {
            new Intl.NumberFormat('es-CL', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(receptionData.gross) + ' kg'
          }</Typography>
          <Typography
          fontWeight="bold"
            sx={{ display: receptionData.impurity_weight > 0 ? 'block' : 'none' }}
            fontSize={10}>
            Impurezas: {
              new Intl.NumberFormat('es-CL', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(receptionData.impurity_weight) + ' kg'
            }</Typography>
          <Typography fontSize={10} fontWeight="bold">Neto: {
            new Intl.NumberFormat('es-CL', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(receptionData.net) + ' kg'
          }</Typography>
          <Typography
          fontWeight="bold"
            sx={{ display: receptionData.to_pay > 0 ? 'block' : 'none' }}
            fontSize={10}>A pagar: {
              receptionData.to_pay.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
            }</Typography>
        </Box>
        <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' }} />

        <Box display='flex' justifyContent='space-between' flexDirection={'column'}>
          <Typography fontSize={14}  fontWeight="bold">Packs: </Typography>
          {
            receptionData.Packs.map((pack, index) => (
              <Box key={index} display='flex' justifyContent={'space-around'} flexDirection={'row'}>
                <Typography fontSize={10} fontWeight={'bold'}>
                  {pack.id + ':'}
                </Typography>
                <Box display='flex' justifyContent={'space-around'} flexDirection={'column'}>
              <Typography fontSize={10} fontWeight="bold">
                {pack.Tray.name + ' '}
                {
                  new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(pack.quanty) + ' unds'
                }
                </Typography>

                <Typography fontSize={10} fontWeight="bold">
                {
                  new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(pack.gross) + ' kg bruto'
                }
                </Typography>

                <Typography fontSize={10} fontWeight="bold">
                {
                  new Intl.NumberFormat('es-CL', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(pack.net) + ' kg neto'
                }
                </Typography>
                </Box>

              </Box>
            ))
          }
        </Box>

        <Divider sx={{ marginTop: 1, marginBottom: 1, backgroundColor: 'black' , display: returnedTraysData.length > 0 ? 'block' : 'none' }} />

        <Box  
        sx={{ display: returnedTraysData.length > 0 ? 'block' : 'none' }}
        justifyContent='space-between' flexDirection={'column'}>
          <Typography fontSize={14}  fontWeight="bold">Bandejas devueltas: {totalReturneds}</Typography>
          {
            returnedTraysData.map((tray, index) => (
              <Typography key={index} fontSize={10} fontWeight="bold">{tray.Tray.name}: {tray.quanty}</Typography>
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

