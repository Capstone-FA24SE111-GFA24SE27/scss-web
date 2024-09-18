import { useRoutes } from 'react-router-dom';
import { studentRoutes } from '@features/students/student-routes';
import { authRoutes } from '@/features/auth';
import { roles } from '@shared/constants';
import { createTheme, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@shared/providers';
const App = () => {
  // const role = ''
  const role = roles.STUDENT
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
          {AppRoutes}
      </StyledEngineProvider>
    </ThemeProvider>
  )
};

export default App;
