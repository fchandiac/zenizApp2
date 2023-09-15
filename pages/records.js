import React, {useState, useEffect} from 'react'
import InfoGrid from '../components/Karmextron/DataGrid'

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
        userName: record.User.name
      }))

      setRecordsList(data)
    
    }
    fecthData()

  }, [])

  const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'table', headerName: 'Dato asociado', flex: 1 },
    { field: 'action', headerName: 'Acción', flex: 1 },
    { field: 'description', headerName: 'Descripción', flex: 1 },
    { field: 'userName', headerName: 'Usuario', flex: 1 },
  ]

  return (
    <>
    <InfoGrid  title= {'Registros'}columns={columns} rows={recordsList} height='80vh' setGridApiRef={setGridApiRef} />
    </>
  )
}
