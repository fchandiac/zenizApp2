import React, { useEffect, useState } from 'react'
import { Box, Grid, Paper } from '@mui/material'
import TrayForm from '../../Forms/TrayForm/TrayForm'
import TraysGrid from '../../Grids/TraysGrid/TraysGrid'

const trays = require('../../../services/trays')

export default function Trays() {
    const [updateGrid, setUpdateGrid] = useState(false)
    const [trayData, setTrayData] = useState(trayDataDefault())



    const updateGrid_ = () => {
        setUpdateGrid(!updateGrid)
    }

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <Paper variant={'outlined'}>
                        <Box paddingLeft={2} paddingTop={2}>
                            Nueva Bandeja
                        </Box>
                        <TrayForm
                            dialog={false}
                            edit={false}
                            afterSubmit={() => {
                                updateGrid_()
                                setTrayData(trayDataDefault())
                            }}
                            trayData={trayData}
                            setTrayData={setTrayData}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={9}>
                    <TraysGrid update={updateGrid} />

                </Grid>
            </Grid>
        </>
    )
}

function trayDataDefault() {
    return {
        id: null,
        name: '',
        weight: '',
    }
}
