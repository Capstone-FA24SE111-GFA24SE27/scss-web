// import { selectNavbarTheme } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import { ThemeProvider } from '@mui/material/styles';
// import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import NavbarStyle from './NavbarStyle';

/**
 * The navbar wrapper layout 1.
 */
function NavbarWrapperLayout() {
	// const config = useAppSelector(selectFuseCurrentLayoutConfig) as LayoutConfigDefaultsType;
	// const navbar = useAppSelector(selectFuseNavbar);
	// const location = useLocation();
	// const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { pathname } = location;
	// const dispatch = useAppDispatch();

	// useEffect(() => {
	// 	if (isMobile) {
	// 		dispatch(navbarCloseMobile());
	// 	}
	// }, [pathname, isMobile]);

	// const navbarTheme = useAppSelector(selectNavbarTheme);

	return (
		<>
			{/* <ThemeProvider theme={navbarTheme}> */}
			<NavbarStyle />
			{/* </ThemeProvider> */}
			{/* {config.navbar.display && !config.toolbar.display && !navbar.open && <NavbarToggleFabLayout />} */}
		</>
	);
}

export default NavbarWrapperLayout;
