import { Heading, NavLinkAdapter } from '@/shared/components'
import { Button } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'


const QnaLayout = () => {
  return (
    <div>
      <div className='flex items-center justify-between bg-background-paper p-32 border-b'>
        <Heading
          title='Questions and Answers'
          description='List of questions and answers you have started'
        />
        <Button variant='contained' color='secondary' component={NavLinkAdapter} to='create'>Ask a question</Button>
      </div>
      <Outlet />
    </div>
  )
}

export default QnaLayout