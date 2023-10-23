import React, { useState, useEffect } from 'react'
import InfoGrid from '../components/Karmextron/DataGrid'
import moment from 'moment'

const records_ = require('../services/records')

export default function records() {
  const [recordsList, setRecordsList] = useState([])
  const [gridApiRef, setGridApiRef] = useState(null)

  useEffect(() => {
    console.log('records')
    const fecthData = async () => {
      const recordsData = await records_.findAll()
      let data = recordsData.map((record) => ({
        id: record.id,
        table: record.table,
        action: record.action,
        description: record.description,
        userName: record.User.name,
        createdAt: record.createdAt,
      }))

      setRecordsList(data)

    }
    fecthData()

  }, [])

  const columns = [
    { field: 'id', headerName: 'Id', flex: .3, type: 'number', valueFormatter: (params) => params.value },
    { field: 'table', headerName: 'Dato asociado', flex: .5 },
    { field: 'action', headerName: 'Acción', flex: .5 },
    { field: 'description', headerName: 'Descripción', flex: 1 },
    { field: 'userName', headerName: 'Usuario', flex: .8 },
    {
      field: 'createdAt', headerName: 'Fecha', flex: .5,
      headerClassName: 'data-grid-last-column-header',
      valueFormatter: (params) => (moment(params.value).format('DD-MM-YYYY HH:mm'))
    },
  ]

  return (
    <>
      <InfoGrid title={'Registros'} columns={columns} rows={recordsList} height='80vh' setGridApiRef={setGridApiRef} />
    </>
  )
}
