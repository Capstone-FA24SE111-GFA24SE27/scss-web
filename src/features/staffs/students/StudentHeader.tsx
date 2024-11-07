import { Heading } from '@/shared/components'
import React from 'react'

type Props = {}

const StudentHeader = (props: Props) => {
    return (
        <div className='flex items-center justify-between p-32 border-b bg-background-paper'>
              <Heading
                title='Student List'
                description='Students in FPTU HCM'
              />
            </div>
      )
}

export default StudentHeader