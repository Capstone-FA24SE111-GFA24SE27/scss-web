import { useRoutes } from 'react-router-dom';
import { studentRoutes } from '@features/students';
import { authRoutes } from '@/features/auth';
import { roles } from '@shared/constants';
import { createTheme, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@shared/providers';
import { selectUserInfo, useAppSelector } from '@shared/store';
import { Suspense } from 'react';
import { AppLoading } from '@shared/components';
import { specialRoutes } from '@shared/configs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { store } from '@shared/store';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux'

const App = () => {
  const role = useAppSelector(selectUserInfo)?.role
  let roleBasedRoutes;
  switch (role) {
    case roles.STUDENT:
      roleBasedRoutes = studentRoutes;
      break;
    default:
      roleBasedRoutes = authRoutes;
  }

  const defaultTheme = createTheme();
  console.log("Default MUI theme: ", defaultTheme)

  const AppRoutes = useRoutes([
    ...roleBasedRoutes,
    ...specialRoutes
  ])

  return (
    <ThemeProvider root>
      <StyledEngineProvider injectFirst>
        <Suspense fallback={<AppLoading />}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {AppRoutes}
          </LocalizationProvider>
        </Suspense>
      </StyledEngineProvider>
    </ThemeProvider>
  )
};

export default App;
