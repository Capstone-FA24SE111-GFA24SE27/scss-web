import { useRoutes } from 'react-router-dom';
import { studentRoutes } from '@features/students/student-routes';
import { authRoutes } from '@/features/auth';
import { roles } from '@shared/constants';
import { AppLayout } from '@shared/layouts'
import { StyledEngineProvider } from '@mui/material';
import ThemeProvider from './shared/providers/theme/ThemeProvider';
const App = () => {
  // const role = roles.STUDENT
  const role = ''
  let roleBasedRoutes;
  switch (role) {
    case roles.STUDENT:
      roleBasedRoutes = studentRoutes;
      break;
    default:
      roleBasedRoutes = authRoutes;
  }


  const AppRoutes = useRoutes([...roleBasedRoutes])

  return (
    <StyledEngineProvider injectFirst>
      <AppLayout>
        <ThemeProvider root>
          {AppRoutes}
        </ThemeProvider>
      </AppLayout>
    </StyledEngineProvider>
  )
};

export default App;
