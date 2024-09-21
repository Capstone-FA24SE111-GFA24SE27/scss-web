import { MenuItem, Select } from '@mui/material'
import React from 'react'

export const CounselorsFilter = () => {
  return (
    <div className='px-24 sm:px-32 p-16 w-full border-b-1 bg-background-paper'>
      <div className='flex gap-16 items-center'>
        <div>From</div>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small" >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>1</MenuItem>
          <MenuItem value={20}>2</MenuItem>
          <MenuItem value={30}>3</MenuItem>
          <MenuItem value={30}>4</MenuItem>
          <MenuItem value={30}>5</MenuItem>
        </Select>
        <div>to</div>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small" >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>1</MenuItem>
          <MenuItem value={20}>2</MenuItem>
          <MenuItem value={30}>3</MenuItem>
          <MenuItem value={30}>4</MenuItem>
          <MenuItem value={30}>5</MenuItem>
        </Select>
      </div>
    </div>

  )
}
