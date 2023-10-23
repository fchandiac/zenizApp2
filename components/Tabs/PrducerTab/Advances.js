import React, { useState, useEffect } from 'react'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { Grid, TextField } from '@mui/material'
import moment from 'moment'
import SettlementsGrid from '../../Grids/SettlementsGrid/SettlementsGrid'
import AdvancesGrid from '../../Grids/AdvancesGrid/AdvancesGrid'

const settlements_ = require('../../../services/settlements')
const advances_ = require('../../../services/advances')




export default function Settlements() {
    const [filterDates, setFilterDates] = useState({ start: moment(new Date).format('YYYY-MM-DD'), end: moment(new Date).format('YYYY-MM-DD 23:59') })
    const [title, setTitle] = useState('Anticipos')
    const [advancesList, setAdvancesList] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const advancesByDates = await advances_.findAllBetweenDates(filterDates.start, filterDates.end)
            let formattedAdvances = advancesByDates.map(advance => ({
                id: advance.id,
                producerName: advance.Producer.name,
                producerRut: advance.Producer.rut,
                producerId: advance.Producer.id,
                amount: advance.amount,
                description: advance.description,
                createdAt: advance.createdAt,
            }))
            console.log(advancesByDates)
            setAdvancesList(formattedAdvances)
        }

        fetchData()
        if (moment(filterDates.start).format('DD-MM-YYYY') == moment(filterDates.end).format('DD-MM-YYYY')) {
            setTitle('Liquidaciones ' + moment(filterDates.start).format('DD-MM-YYYY'))
        } else {
            setTitle('Liquidaciones del ' + moment(filterDates.start).format('DD-MM-YYYY') + ' al ' + moment(filterDates.end).format('DD-MM-YYYY'))
        }

    }, [filterDates])


    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={2}>
                    <Grid container direction='column' spacing={1}>
                        <Grid item>
                            <DesktopDatePicker
                                label="Fecha incial"
                                inputFormat='DD-MM-YYYY'
                                value={filterDates.start}
                                onChange={(e) => {
                                    console.log(e)
                                    setFilterDates({ ...filterDates, start: e })
                                }}
                                renderInput={(params) => <TextField {...params} size={'small'} fullWidth />}
                            />
                        </Grid>
                        <Grid item>
                            <DesktopDatePicker
                                label="Fecha final"
                                inputFormat='DD-MM-YYYY'
                                value={filterDates.end}
                                onChange={(e) => { setFilterDates({ ...filterDates, end: e }) }}
                                renderInput={(params) => <TextField {...params} size={'small'} fullWidth />}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={10}>
                    <AdvancesGrid
                        advancesList={advancesList}

                    />
                </Grid>
            </Grid>
        </>
    )
}
