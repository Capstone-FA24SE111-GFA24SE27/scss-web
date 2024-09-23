import { useRoutes } from 'react-router-dom';
import { studentsRoutes } from '@features/students';
import { authRoutes } from '@/features/auth';
import { roles } from '@shared/constants';
import { createTheme, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@shared/providers';
import { selectAccount, useAppSelector } from '@shared/store';
import { Suspense } from 'react';
import { AppLoading } from '@shared/components';
import { specialRoutes } from '@shared/configs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { store } from '@shared/store';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux'
import { useEffect } from 'react'
import { counselorsRoutes } from './features/counselors';
import Dialog from '@shared/components/dialog';
const App = () => {
  const account = useAppSelector(selectAccount)
  let roleBasedRoutes = [];
  switch (account?.role) {
    case roles.STUDENT:
      roleBasedRoutes = studentsRoutes;
      break;
    case roles.COUNSELOR:
      roleBasedRoutes = counselorsRoutes;
      break;
    default:
      roleBasedRoutes = authRoutes;
  }

  // const defaultTheme = createTheme();
  // console.log("Default MUI theme: ", defaultTheme)

  const AppRoutes = useRoutes([
    ...roleBasedRoutes,
    ...specialRoutes
  ])

  return (
    <ThemeProvider root>
      <StyledEngineProvider injectFirst>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Suspense fallback={<AppLoading />}>
            <Dialog />
            {AppRoutes}
          </Suspense>
        </LocalizationProvider>
      </StyledEngineProvider>
    </ThemeProvider>
  )
};

export default App;
