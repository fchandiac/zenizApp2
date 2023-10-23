import React, { useState, useEffect } from 'react'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { Grid, TextField } from '@mui/material'
import moment from 'moment'
import SettlementsGrid from '../../Grids/SettlementsGrid/SettlementsGrid'

const settlements_ = require('../../../services/settlements')




export default function Settlements() {
    const [filterDates, setFilterDates] = useState({ start: moment(new Date).format('YYYY-MM-DD'), end: moment(new Date).format('YYYY-MM-DD 23:59') })
    const [settlementsList, setSettlementsList] = useState([])
    const [title, setTitle] = useState('Liquidaciones')

    useEffect(() => {
        const fetchData = async () => {
            const settlementsByDates = await settlements_.findAllBetweenDates(filterDates.start, filterDates.end)
            
            let formattedSettlements =  settlementsByDates.map(settlement => ({
                id: settlement.id,
                producerName: settlement.Producer.name,
                producerRut: settlement.Producer.rut,
                producerId: settlement.Producer.id,
                amount: settlement.amount,
                description: settlement.description,
                receptions: settlement.Receptions,
                createdAt: settlement.createdAt,
            }))

            console.log('settlementsByDates',formattedSettlements )
            setSettlementsList(formattedSettlements)
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
                    <Grid container spacing={1} direction={'column'}>
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
                   <SettlementsGrid title={title} settlementsList={settlementsList} />
                </Grid>
            </Grid>
        </>
    )
}
