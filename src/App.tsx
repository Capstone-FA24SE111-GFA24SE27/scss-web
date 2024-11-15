import { authRoutes } from '@/features/auth';
import { studentsRoutes } from '@features/students';
import { managersRoutes } from '@features/managers';
import { StyledEngineProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AppLoading } from '@shared/components';
import { specialRoutes } from '@shared/configs';
import { roles } from '@shared/constants';
import { SnackbarProvider, ThemeProvider } from '@shared/context';
import { selectAccount, useAppSelector } from '@shared/store';
import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { counselorsRoutes } from '@features/counselors';
import { Dialog } from '@shared/components';
import { adminRoutes } from './features/admin';
import { supportStaffRoutes } from './features/staffs';
import { SocketProvider } from '@shared/context';

const App = () => {
	const account = useAppSelector(selectAccount);
	let roleBasedRoutes = [];
	switch (account?.role) {
		case roles.STUDENT:
			roleBasedRoutes = studentsRoutes;
			break;
		case roles.ACADEMIC_COUNSELOR:
			roleBasedRoutes = counselorsRoutes;
			break;
		case roles.NON_ACADEMIC_COUNSELOR:
			roleBasedRoutes = counselorsRoutes;
			break;
		case roles.MANAGER:
			roleBasedRoutes = managersRoutes;
			break;
		case roles.ADMIN:
			roleBasedRoutes = adminRoutes;
			break;
		case roles.SUPPORT_STAFF:
			roleBasedRoutes = supportStaffRoutes;
			break;
		default:
			roleBasedRoutes = authRoutes;
	}

	const AppRoutes = useRoutes([...roleBasedRoutes]);

	return (
		<SocketProvider>
			<ThemeProvider root>
				<StyledEngineProvider injectFirst>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<SnackbarProvider>
							<Suspense fallback={<AppLoading />}>
								<Dialog />
								{AppRoutes}
							</Suspense>
						</SnackbarProvider>
					</LocalizationProvider>
				</StyledEngineProvider>
			</ThemeProvider>
		</SocketProvider >
	);
};

export default App;
