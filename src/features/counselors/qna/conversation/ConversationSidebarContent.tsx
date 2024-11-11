import { NavLinkAdapter } from '@/shared/components'
import { Close } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'

type Props = {}

const ConversationSidebarContent = (props: Props) => {
  return (
    <div className="flex-1 w-full h-full min-w-320">
      <IconButton
        className="absolute right-0 z-10 top-16"
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

export default ConversationSidebarContent