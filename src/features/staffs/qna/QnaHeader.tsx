import { Heading, NavLinkAdapter } from '@/shared/components'
import { Button } from '@mui/material'
import React from 'react'

type Props = {}

const QnaHeader = (props: Props) => {
  return (
    <div className='flex items-center justify-between p-32 border-b bg-background-paper'>
          <Heading
            title='Questions and Answers'
            description=''
          />
        </div>
  )
}

export default QnaHeader