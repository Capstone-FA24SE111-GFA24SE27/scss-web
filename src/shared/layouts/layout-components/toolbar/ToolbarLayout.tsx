import AppBar from '@mui/material/AppBar';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { memo } from 'react';
import { UserMenu } from '@/shared/components';
import { selectNavbar } from '../navbar/navbar-slice';
import { useAppSelector } from '@shared/store';
import NavbarToggleButton from '../navbar/NavbarToggleButton';
import NavigationShortcuts from '../navigation/NavigationShorcuts';
// import { selectFuseCurrentLayoutConfig, selectToolbarTheme } from '@fuse/core/FuseSettings/fuseSettingsSlice';
// import { LayoutConfigDefaultsType } from 'app/theme-layouts/layout/LayoutConfig';
// import NotificationPanelToggleButton from 'src/app/main/apps/notifications/NotificationPanelToggleButton';
// import NavbarToggleButton from 'app/theme-layouts/shared-components/navbar/NavbarToggleButton';
// import { selectFuseNavbar } from 'app/theme-layouts/shared-components/navbar/navbarSlice';
// import { useAppSelector } from 'app/store/hooks';
// import AdjustFontSize from '../../shared-components/AdjustFontSize';
// import FullScreenToggle from '../../shared-components/FullScreenToggle';
// import LanguageSwitcher from '../../shared-components/LanguageSwitcher';
// import NavigationShortcuts from '../../shared-components/navigation/NavigationShortcuts';
// import NavigationSearch from '../../shared-components/navigation/NavigationSearch';
// import UserMenu from '../../shared-components/UserMenu';
// import QuickPanelToggleButton from '../../shared-components/quickPanel/QuickPanelToggleButton';

type ToolbarLayoutProps = {
	className?: string;
};

/**
 * The toolbar layout 1.
 */
function ToolbarLayout(props: ToolbarLayoutProps) {
	const { className } = props;
	// const config = useAppSelector(selectFuseCurrentLayoutConfig) as LayoutConfigDefaultsType;
	const navbar = useAppSelector(selectNavbar);
	// const toolbarTheme = useAppSelector(selectToolbarTheme);
	const config = {
		navbar: {
			position: 'left',
			style: 'style-1',
			display: true,
		}
	}

	return (
		// <ThemeProvider theme={toolbarTheme}>
		<AppBar
			id="fuse-toolbar"
			className={clsx('relative z-20 flex shadow', className)}
			color="default"
			// sx={{
			// 	backgroundColor: (theme) =>
			// 		theme.palette.mode === 'light'
			// 			? toolbarTheme.palette.background.paper
			// 			: toolbarTheme.palette.background.default
			// }}
			position="static"
			elevation={0}
		>
			<Toolbar className="min-h-48 p-0 md:min-h-64">
				<div className="flex flex-1 px-16">
					{config.navbar.display && config.navbar.position === 'left' && (
						<>
							<Hidden lgDown>
								{!navbar.open && (
									<NavbarToggleButton className="" />
								)}
							</Hidden>

							{/* <Hidden lgUp>
								<NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />
							</Hidden> */}
						</>
					)}
					<NavigationShortcuts />

					{/* <Hidden lgDown>
						<NavigationShortcuts />
					</Hidden> */}
				</div>

				<div className="flex h-full items-center overflow-x-auto px-8">
					{/* <LanguageSwitcher />
						<AdjustFontSize />
						<FullScreenToggle />
						<NavigationSearch />
						<QuickPanelToggleButton />
						<NotificationPanelToggleButton /> */}
					<UserMenu />
				</div>

				{/* {config.navbar.display && config.navbar.position === 'right' && (
						<>
							<Hidden lgDown>
								{!navbar.open && <NavbarToggleButton className="mx-0 h-40 w-40 p-0" />}
							</Hidden>

							<Hidden lgUp>
								<NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />
							</Hidden>
						</>
					)} */}
			</Toolbar>
		</AppBar>
		// </ThemeProvider>
	);
}

export default memo(ToolbarLayout);
