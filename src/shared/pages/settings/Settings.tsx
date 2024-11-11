import { Heading, openDialog } from '@/shared/components'
import { Button, IconButton, Paper, Typography } from '@mui/material'
import React from 'react'
import ChangePasswordForm from './ChangePasswordForm'
import { Edit, Email } from '@mui/icons-material'
import { useAppDispatch } from '@shared/store'
import ForgotPasswordForm from './ForgotPasswordForm'

const Settings = () => {
  const dispatch = useAppDispatch()
  return (
    <div className='w-full p-32'>
      <div className='relative flex flex-col items-center flex-auto p-24 pt-0 sm:p-48 sm:pt-0'>
        <div className="w-full max-w-3xl space-y-16">
          <Heading
            title='Settings'
            description=''
          />
          <Paper className="shadow p-16 mt-8">
            <Typography className='font-semibold text-xl mb-16'>
              Security
            </Typography>
            <div>
              <div className='flex justify-between items-start'>
                <div className=''>
                  <Typography className='text-lg'>Password</Typography>
                  <Typography color='textSecondary' className='text-sm'>Set a secured password to protect your account</Typography>
                </div>
                <div className='flex gap-8'>
                  <Button startIcon={<Email />} variant='outlined' size='small'
                    onClick={() => {
                      dispatch(openDialog({
                        children: <ForgotPasswordForm />
                      }));
                    }}
                  >
                    Reset
                  </Button>
                  <Button startIcon={<Edit />} variant='contained' size='small' color='primary'
                    onClick={() => {
                      dispatch(openDialog({
                        children: <ChangePasswordForm />
                      }));
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
              {/* <ChangePasswordForm /> */}
            </div>
          </Paper>
        </div>
      </div>
    </div>
  )
}

export default Settings