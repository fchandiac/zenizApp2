import React, {useEffect, useState} from 'react'
import ProfileForm from '../../Forms/ProfileForm/ProfileForm'
import { Grid, Paper, Box } from '@mui/material'
import ProfileCard from '../../Cards/ProfileCard/ProfileCard'

const profiles = require('../../../services/profiles')

export default function Profiles() {
  const [update, setUpdate] = useState(false)
  const [profilesList, setProfilesList] = useState([{}])

  const update_ = () => {
    setUpdate(!update)
  }

  useEffect(() => {
    const fetchData = async () => {
      const profiles_ = await profiles.findAll()
      setProfilesList(profiles_)
      console.log(profiles_)
    }
    fetchData()

  }, [update])

  return (
    <>
      <Grid container spacing={1} >
        <Grid item xs={3}>
          <ProfileForm  afterSubmit={() => {update_()}}/>
        </Grid>
        <Grid item xs={9}>
          <Paper variant='outlined'>
            <Box sx={{padding:1}}>
              <Grid container spacing={1}>
                {profilesList.map((profile, index) => {
                  return (
                    <Grid item xs={3} key={index}>
                      <ProfileCard profileData={profile} />
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
