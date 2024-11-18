import React, { ReactNode } from 'react'
import { SnackbarProvider as NotiStackSnackbarProvider } from 'notistack';

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  return (
    <NotiStackSnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      classes={{
        containerRoot:
          'bottom-0 right-0 mb-52 md:mb-68 mr-4 lg:mr-40 z-99',
      }}
    >
      {children}
    </NotiStackSnackbarProvider>

  )
}
