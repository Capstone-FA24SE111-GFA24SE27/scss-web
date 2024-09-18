import { useRoutes } from 'react-router-dom';
import { studentRoutes } from '@features/students/student-routes';
import { authRoutes } from '@/features/auth';
import { roles } from '@shared/constants';
import { createTheme, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@shared/providers';
import { selectUserInfo, useAppSelector } from '@shared/store';
import { Suspense } from 'react';
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

  const AppRoutes = useRoutes([...roleBasedRoutes])

  return (
    <ThemeProvider root>
      <StyledEngineProvider injectFirst>
        <Suspense fallback={<div>Routes are being rendereed!</div>}>
          {AppRoutes}
        </Suspense>
      </StyledEngineProvider>
    </ThemeProvider>
  )
};

export default App;
