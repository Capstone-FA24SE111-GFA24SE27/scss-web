import { FilterAltOutlined, Search } from '@mui/icons-material'
import { Box, IconButton, Input, TextField, Tooltip } from '@mui/material'
import { motion } from 'framer-motion'
import React from 'react'

const CounselorFilter = () => {
  return (
    <div className="flex flex-1 items-center p-24">
      <TextField
        label="Search for a counselor"
        placeholder="Enter a keyword..."
        className="flex w-full"
        variant="outlined"
        slotProps={{
          inputLabel: {
            shrink: true,
          }
        }}
      />
      <div className='w-96 flex justify-center'>
        <Tooltip title={'Filter'}>
          <IconButton
          >
            <FilterAltOutlined className='size-32' />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

export default CounselorFilter