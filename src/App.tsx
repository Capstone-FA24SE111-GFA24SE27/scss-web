import { useRoutes } from 'react-router-dom';
import { studentRoutes } from '@features/students/student-routes';
import { authRoutes } from '@/features/auth';
import { roles } from '@shared/constants';
import { Layout1 } from '@shared/layouts'
import { StyledEngineProvider } from '@mui/material';
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
    <div className='bg-black'>
      <StyledEngineProvider injectFirst>
        {AppRoutes}
      </StyledEngineProvider>
    </div>
  )
};

export default App;
