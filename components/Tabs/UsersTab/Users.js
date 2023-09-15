import { Box, Grid, Paper } from '@mui/material'
import React, { useState, useEffect } from 'react'
import UserForm from '../../Forms/UserForm/UserForm'
import UserCard from '../../Cards/UserCard/UserCard'

const users = require('../../../services/users')


export default function Users() {
  const [usersList, setUsersList] = useState([{}])
  const [update, setUpdate] = useState(false)

  const update_ = () => {
    setUpdate(!update)
  }


  useEffect(() => {
    const fetchData = async () => {
      const users_ = await users.findAll()
      setUsersList(users_)
      console.log(users_)
    }
    fetchData()
  }, [update])

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Paper variant='outlined'>
            <Box padding={1}>
              Nuevo usuario
            </Box>
            <UserForm afterSubmit={() => {
              setUpdate(!update)
              }}/>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper variant='outlined'>
            <Box sx={{ padding: 1 }}>
              <Grid container spacing={1}>
                {usersList.map((user, index) => {
                  return (
                    <Grid item xs={3} key={index}>
                      <UserCard userData={user} />
                    </Grid>
                  )
                })}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
