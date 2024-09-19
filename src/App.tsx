import { useRoutes } from 'react-router-dom';
import { studentRoutes } from '@features/students';
import { authRoutes } from '@/features/auth';
import { roles } from '@shared/constants';
import { createTheme, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@shared/providers';
import { selectUserInfo, useAppSelector } from '@shared/store';
import { Suspense } from 'react';
import { AppLoading } from '@shared/components';
import { appRoutes } from './app-routes';
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

  const AppRoutes = useRoutes([...roleBasedRoutes, ...appRoutes])

  return (
    <ThemeProvider root>
      <StyledEngineProvider injectFirst>
        <Suspense fallback={<AppLoading />}>
          {AppRoutes}
        </Suspense>
      </StyledEngineProvider>
    </ThemeProvider>
  )
};

export default App;
