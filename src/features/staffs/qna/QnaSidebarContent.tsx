import { NavLinkAdapter } from '@/shared/components'
import { Close } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'


const QnaSidebarContent = () => {
  return (
    <div className="h-full ">
      <IconButton
        className="absolute top-0 right-0 z-10 m-16"
        component={NavLinkAdapter}
        to="."
        size="large"
      >
        <Close />
      </IconButton>

      <Outlet />
    </div>
  )
}

export default QnaSidebarContent