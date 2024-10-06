import { FilterAltOutlined, Search, Tune } from '@mui/icons-material'
import { Box, IconButton, Input, TextField, Tooltip } from '@mui/material'
import { useAppSelector } from '@shared/store'
import { motion } from 'framer-motion'
import React from 'react'
import { selectFilter } from './filter-slice'
import CounselorListFilterButton from './CounselorListFilterButton'

const CounselorListHeader = () => {
  const filter = useAppSelector(selectFilter)
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
      <div className='pl-16'>
        {!filter.open && <CounselorListFilterButton />}
      </div>
    </div>
  )
}

export default CounselorListHeader