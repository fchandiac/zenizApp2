import React from 'react'
import '../styles/global.css'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import { esES } from '@mui/material/locale'
import { LocalizationProvider, esES as esESPick } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { AppProvider, useAppContext } from '../appProvider'
import moment from 'moment'
import Layout from '../components/Layout/Layout'




const theme = createTheme(
  {
    palette: {
      primary: { main: '#4B5A7B', contrastText: '#fff' },
      // secondary: { main: '#ef5350', contrastText: '#fff' },
      // error: { main: '#ef5350', contrastText: '#fff' },
      // warning: { main: '#ffca28', contrastText: '#fff' },
      // info: { main: '#2196f3', contrastText: '#fff' },
      // success: { main: '#4caf50', contrastText: '#fff' },
      // background: { default: '#fff' },
      // text: { primary: '#212121', secondary: '#757575' },
      // divider: '#bdbdbd',
      // action: { active: '#212121', hover: '#bdbdbd', selected: '#eeeeee', disabled: '#bdbdbd', disabledBackground: '#e0e0e0' },
 
    },
  }, esES)

// { palette: { primary: { main: '#1976d2' }, }, }

// { palette: { 
//   primary: { main: '#ef5350' },
//   secondary: {main: '#616161'}
// }

const loc = moment.locale('en',
  {
    months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
    weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
    weekdaysShort: 'dom._lun._mar._mie._jue._vie._sab.'.split('_')
  })

export default function MyApp({ Component, pageProps }) {
  
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <AppProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppProvider>
      </LocalizationProvider>
    </ThemeProvider>

  )
}

