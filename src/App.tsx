import { authRoutes } from '@/features/auth';
import { studentsRoutes } from '@features/students';
import { StyledEngineProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AppLoading } from '@shared/components';
import { specialRoutes } from '@shared/configs';
import { roles } from '@shared/constants';
import { ThemeProvider } from '@shared/providers';
import { selectAccount, useAppSelector } from '@shared/store';
import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { counselorsRoutes } from '@features/counselors';
import Dialog from '@shared/components/dialog';
import { SnackbarProvider } from 'notistack';

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
								'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
						}}
					>

						<Suspense fallback={<AppLoading />}>
							<Dialog />
							{AppRoutes}
						</Suspense>
					</SnackbarProvider>
				</LocalizationProvider>
			</StyledEngineProvider>
		</ThemeProvider>
	)
};

export default App;
