// import { selectNavbarTheme } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import { ThemeProvider } from '@mui/material/styles';
// import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import NavbarStyle1 from './navbar/style-1/NavbarStyle1';

/**
 * The navbar wrapper layout 1.
 */
function NavbarWrapperLayout1() {
	// const config = useAppSelector(selectFuseCurrentLayoutConfig) as Layout1ConfigDefaultsType;
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
				<>
					<NavbarStyle1 />
					{/* {config.navbar.style === 'style-1' && <NavbarStyle1 />}
					{config.navbar.style === 'style-2' && <NavbarStyle2 />}
					{config.navbar.style === 'style-3' && <NavbarStyle3 />} */}
					{/* {config.navbar.style === 'style-3-dense' && <NavbarStyle3 dense />} */}
				</>
			{/* </ThemeProvider> */}
			{/* {config.navbar.display && !config.toolbar.display && !navbar.open && <NavbarToggleFabLayout1 />} */}
		</>
	);
}

export default NavbarWrapperLayout1;
