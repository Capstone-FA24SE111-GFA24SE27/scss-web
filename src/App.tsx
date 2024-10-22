import { authRoutes } from '@/features/auth';
import { studentsRoutes } from '@features/students';
import { managersRoutes } from '@features/managers';
import { StyledEngineProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AppLoading } from '@shared/components';
import { specialRoutes } from '@shared/configs';
import { roles } from '@shared/constants';
import { ThemeProvider } from '@shared/context';
import { selectAccount, useAppSelector } from '@shared/store';
import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { counselorsRoutes } from '@features/counselors';
import { Dialog } from '@shared/components';
import { SnackbarProvider } from 'notistack';
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
		default:
			roleBasedRoutes = authRoutes;
	}

	const AppRoutes = useRoutes([...roleBasedRoutes]);

	return (
		<ThemeProvider root>
			<StyledEngineProvider injectFirst>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<SnackbarProvider
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
						<Suspense fallback={<AppLoading />}>
							<SocketProvider>
								<Dialog />
								{AppRoutes}
							</SocketProvider>
						</Suspense>
					</SnackbarProvider>
				</LocalizationProvider>
			</StyledEngineProvider>
		</ThemeProvider>
	);
};

export default App;
