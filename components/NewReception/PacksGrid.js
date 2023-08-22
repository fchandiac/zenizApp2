import React, { useEffect, useState } from 'react'
import { DataGrid, GridToolbarQuickFilter, useGridApiContext } from '@mui/x-data-grid'
import { useAppContext } from '../../appProvider'


export default function PacksGrid() {
  const { reception } = useAppContext()
  const [list, setList] = useState([])


  useEffect(() => {
    let data = reception.packs.map((pack, index) => ({
      ...pack,
      id: index + 1,
    }))
    setList(data)
  }, [reception.packs])

  const columns = [
    { field: 'id', headerName: '#', flex: 1 },
    { field: 'palletId', headerName: 'Pallet', flex: 1 },
    { field: 'quanty', headerName: 'Cant. bandejas', flex: 1 },
    { field: 'trayWeight', headerName: 'Kg unidad', flex: 1 },
    { field: 'gross', headerName: 'Kg bruto', flex: 1 },
    { field: 'traysWeight', headerName: 'Kg bandejas', flex: 1 },
    { field: 'impurityWeight', headerName: 'Kg impurezas', flex: 1 },
    { field: 'net', headerName: 'Kg neto', flex: 1, headerClassName: 'data-grid-last-column-header' },
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