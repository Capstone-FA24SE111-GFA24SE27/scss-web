import { useRoutes } from 'react-router-dom';
import { studentRoutes } from '@/features/students';
import { authRoutes } from '@/features/auth';
import { roles } from '@shared/constants';
import { createTheme, StyledEngineProvider } from '@mui/material';
import { ThemeProvider } from '@shared/providers';
import { selectAccount, useAppSelector } from '@shared/store';
import { Suspense, useEffect, useState } from 'react';
import { AppLoading } from '@shared/components';
import { specialRoutes } from '@shared/configs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { store } from '@shared/store';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { io, Socket } from 'socket.io-client';
import { SocketProvider } from './shared/context/socket-context';

const App = () => {
	const account = useAppSelector(selectAccount);
	const role = account?.role;
	console.log(account);
	console.log(role);
	let roleBasedRoutes;
	switch (role) {
		case roles.STUDENT:
			roleBasedRoutes = studentRoutes;
			break;
		default:
			roleBasedRoutes = authRoutes;
	}
	const [socket, setSocket] = useState<Socket>(null);

	// const defaultTheme = createTheme();
	// console.log("Default MUI theme: ", defaultTheme)

	const AppRoutes = useRoutes([...roleBasedRoutes, ...specialRoutes]);

	return (
		<ThemeProvider root>
			<StyledEngineProvider injectFirst>
				<Suspense fallback={<AppLoading />}>
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
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<SocketProvider>{AppRoutes}</SocketProvider>
						</LocalizationProvider>
					</SnackbarProvider>
				</Suspense>
			</StyledEngineProvider>
		</ThemeProvider>
	);
};

export default App;
