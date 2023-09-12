import React, {useState} from 'react'
import InfoDataGrid from '../../Karmextron/InfoDataGrid'
import moment from 'moment'

export default function ProducerTraysGrid(props) {
    const { movs, title } = props
    const [gridApiRef, setGridApiRef] = useState(null)

    const setType = (type) => {
        switch (type) {
            case 0:
                return 'Entrada'
            case 1:
                return 'Egreso'
            case 2:
                return 'Devolución al productor'
            case 3:
                return 'Recepción'
            default:
                return ''
        }
    }

    const columns = [
        { field: 'id', headerName: 'Id', flex:.5 },
        { field: 'trayName', headerName: 'Bandeja', flex:1 },
        { field: 'type', headerName: 'Tipo', flex:1, valueFormatter: (params) => setType(params.value) },
        { field: 'description', headerName: 'Descripción', flex:1,  cellClassName: 'row-tiny' },
        { field: 'quanty', headerName: 'Cantidad', flex:1 },
        { field: 'balance', headerName: 'Saldo', flex:1 },
        { field: 'createdAt', headerName: 'Fecha', flex:1, headerClassName: 'data-grid-last-column-header',
        valueFormatter: (params) => moment(params.value).format('DD-MM-YYYY HH:mm')
     },
    ]

  return (
    <InfoDataGrid 
    rows = {movs}
    columns = {columns}
    title = {title}
    height = {'70vh'}
    setGridApiRef ={setGridApiRef}
    />

  )
}
