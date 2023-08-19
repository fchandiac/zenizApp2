import { TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'


export default function MoneyTextField(props) {
    const { label, value, onclick, autofocus, required } = props
    const [moneyStr, setMoneyStr] = useState('')

    useEffect(() => {
        let money 
        if (value === '$NaN' || value === '$' || value === '' || value === null || value === undefined ) {
            money = 0
        } else {
            if (typeof value === 'string') {
                money = value.replace(/\D/g, "")
                money = parseInt(money)
            } else {
                money = value
            }
        }

        setMoneyStr(money.toLocaleString('es-CL', {
            style: 'currency',
            currency: 'CLP',
        }))
    }, [value])



    return (
        <TextField
            label={label}
            value={moneyStr}
            onChange={onclick}
            type='text'
            inputMode='numeric'
            variant="outlined"
            size={'small'}
            inputProps={{
                min: 1,
            }}
            autoFocus={autofocus}
            required={required}
            fullWidth
        />
    )
}
