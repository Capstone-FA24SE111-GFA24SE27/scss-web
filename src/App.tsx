import { useRoutes } from 'react-router-dom';
import studentRoutes from '@features/students/student-routes';

const App = () => {
  const AppRoutes = useRoutes([
    ...studentRoutes,
  ]);
  return AppRoutes;
};

export default App;
