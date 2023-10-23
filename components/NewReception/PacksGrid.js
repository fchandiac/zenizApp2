import React, { useEffect, useState } from 'react'
import { DataGrid, GridToolbarQuickFilter, useGridApiContext } from '@mui/x-data-grid'
import { useAppContext } from '../../appProvider'
import { GridActionsCellItem } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'


export default function PacksGrid() {
  const { reception, receptionShowImpurities, openSnack, removePack } = useAppContext()
  const [list, setList] = useState([])


  useEffect(() => {
    let data = reception.packs.map((pack, index) => ({
      ...pack,
      id: index + 1,
    }))
    setList(data)
  }, [reception.packs])

  const columns = [
    { field: 'id', headerName: '#', flex: 1, valueFormatter: (params) => params.value },
    { field: 'palletId', headerName: 'Pallet', flex: .8 },
    { field: 'trayName', headerName: 'Bandeja', flex: 2 },
    {
      field: 'quanty', headerName: 'Bandejas', flex: .8,
      valueFormatter: (params) =>
        new Intl.NumberFormat('es-CL', {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(params.value) + ' unds'
    },
    {
      field: 'trayWeight', headerName: 'Unidad', flex: .8,
      valueFormatter: (params) =>
        new Intl.NumberFormat('es-CL', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value) + ' kg'
    },
    {
      field: 'gross', headerName: 'Bruto', flex: .8,
      valueFormatter: (params) =>
        new Intl.NumberFormat('es-CL', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value) + ' kg'
    },
    {
      field: 'traysWeight', headerName: 'Bandejas', flex: .8,
      valueFormatter: (params) =>
        new Intl.NumberFormat('es-CL', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value) + ' kg'
    },
    {
      field: 'impurityWeight', headerName: 'Impurezas', flex: .8, hide: receptionShowImpurities ? false : true,
      valueFormatter: (params) =>
        new Intl.NumberFormat('es-CL', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value) + ' kg'
    },
    {
      field: 'net', headerName: 'Kg neto', flex: .8, headerClassName: 'data-grid-last-column-header',
      valueFormatter: (params) =>
        new Intl.NumberFormat('es-CL', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(params.value) + ' kg'
    },
    {
      field: 'actions',
      headerName: '',
      headerClassName: 'data-grid-last-column-header',
      type: 'actions', flex: .5, getActions: (params) => [
          <GridActionsCellItem
              label='destroy'
              icon={<DeleteIcon />}
              onClick={() => { 
                console.log()
                removePack(params.row)
                openSnack('Pack eliminado', 'success')
               }}
          />
        
          
      ]

    }
  ]


  return (
    <DataGrid
      columns={columns}
      localeText={esESGrid}
      rows={list}
      autoHeight
      density='compact'
      hideFooter
    />
  )
}



const esESGrid = {
  // Root
  noRowsLabel: 'Sin Packs',
  noResultsOverlayLabel: 'Ningún resultado encontrado.',
  errorOverlayDefaultLabel: 'Ha ocurrido un error.',
  // Density selector toolbar button text
  toolbarDensity: 'Densidad',
  toolbarDensityLabel: 'Densidad',
  toolbarDensityCompact: 'Compacta',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Comoda',
  // Columns selector toolbar button text
  toolbarColumns: 'Columnas',
  toolbarColumnsLabel: 'Seleccionar columnas',
  // Filters toolbar button text
  toolbarFilters: 'Filtros',
  toolbarFiltersLabel: 'Mostrar filtros',
  toolbarFiltersTooltipHide: 'Ocultar filtros',
  toolbarFiltersTooltipShow: 'Mostrar filtros',
  toolbarFiltersTooltipActive: count => count > 1 ? `${count} filtros activos` : `${count} filtro activo`,
  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Buscar...',
  toolbarQuickFilterLabel: 'Buscar',
  // toolbarQuickFilterDeleteIconLabel: 'Clear',
  // Export selector toolbar button text
  toolbarExport: 'Exportar',
  toolbarExportLabel: 'Exportar',
  toolbarExportCSV: 'Descargar como CSV',
  // toolbarExportPrint: 'Print',
  // toolbarExportExcel: 'Download as Excel',
  // Columns panel text
  columnsPanelTextFieldLabel: 'Columna de búsqueda',
  columnsPanelTextFieldPlaceholder: 'Título de columna',
  columnsPanelDragIconLabel: 'Reorder columna',
  columnsPanelShowAllButton: 'Mostrar todo',
  columnsPanelHideAllButton: 'Ocultar todo',
  // Filter panel text
  filterPanelAddFilter: 'Agregar filtro',
  filterPanelDeleteIconLabel: 'Borrar',
  // filterPanelLinkOperator: 'Logic operator',
  filterPanelOperators: 'Operadores',
  // TODO v6: rename to filterPanelOperator
  filterPanelOperatorAnd: 'Y',
  filterPanelOperatorOr: 'O',
  filterPanelColumns: 'Columnas',
  filterPanelInputLabel: 'Valor',
  filterPanelInputPlaceholder: 'Valor de filtro',
  // Filter operators text
  filterOperatorContains: 'contiene',
  filterOperatorEquals: 'es igual',
  filterOperatorStartsWith: 'comienza con',
  filterOperatorEndsWith: 'termina con',
  filterOperatorIs: 'es',
  filterOperatorNot: 'no es',
  filterOperatorAfter: 'es posterior',
  filterOperatorOnOrAfter: 'es en o posterior',
  filterOperatorBefore: 'es anterior',
  filterOperatorOnOrBefore: 'es en o anterior',
  filterOperatorIsEmpty: 'está vacío',
  filterOperatorIsNotEmpty: 'no esta vacío',
  filterOperatorIsAnyOf: 'es cualquiera de',
  // Filter values text
  filterValueAny: 'cualquiera',
  filterValueTrue: 'verdadero',
  filterValueFalse: 'falso',
  // Column menu text
  columnMenuLabel: 'Menú',
  columnMenuShowColumns: 'Mostrar columnas',
  columnMenuFilter: 'Filtro',
  columnMenuHideColumn: 'Ocultar',
  columnMenuUnsort: 'Desordenar',
  columnMenuSortAsc: 'Ordenar asc',
  columnMenuSortDesc: 'Ordenar desc',
  // Column header text
  columnHeaderFiltersTooltipActive: count => count > 1 ? `${count} filtros activos` : `${count} filtro activo`,
  columnHeaderFiltersLabel: 'Mostrar filtros',
  columnHeaderSortIconLabel: 'Ordenar',
  // Rows selected footer text
  footerRowSelected: count => count > 1 ? `${count.toLocaleString()} filas seleccionadas` : `${count.toLocaleString()} fila seleccionada`,
  // Total row amount footer text
  footerTotalRows: 'Filas Totales:',
  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) => `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,
  // Checkbox selection text
  // checkboxSelectionHeaderName: 'Checkbox selection',
  // checkboxSelectionSelectAllRows: 'Select all rows',
  // checkboxSelectionUnselectAllRows: 'Unselect all rows',
  // checkboxSelectionSelectRow: 'Select row',
  // checkboxSelectionUnselectRow: 'Unselect row',
  // Boolean cell text
  booleanCellTrueLabel: 'Si',
  booleanCellFalseLabel: 'No',
  // Actions cell more text
  actionsCellMore: 'más' // Column pinning text
  // pinToLeft: 'Pin to left',
  // pinToRight: 'Pin to right',
  // unpin: 'Unpin',
  // Tree Data
  // treeDataGroupingHeaderName: 'Group',
  // treeDataExpand: 'see children',
  // treeDataCollapse: 'hide children',
  // Grouping columns
  // groupingColumnHeaderName: 'Group',
  // groupColumn: name => `Group by ${name}`,
  // unGroupColumn: name => `Stop grouping by ${name}`,
  // Master/detail
  // detailPanelToggle: 'Detail panel toggle',
  // expandDetailPanel: 'Expand',
  // collapseDetailPanel: 'Collapse',
  // Row reordering text
  // rowReorderingHeaderName: 'Row reordering',

}