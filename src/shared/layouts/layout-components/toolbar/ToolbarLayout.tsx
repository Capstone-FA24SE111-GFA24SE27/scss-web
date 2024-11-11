import AppBar from '@mui/material/AppBar';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { memo } from 'react';
import { selectNavbar } from '../navbar/navbar-slice';
import { useAppSelector } from '@shared/store';
import NavbarToggleButton from '../navbar/NavbarToggleButton';
import NavigationShortcuts from '../navigation/NavigationShorcuts';
import UtilityShortcuts from './UtilityShortcuts';
import UserMenu from './UserMenu';

type ToolbarLayoutProps = {
	className?: string;
};

/**
 * The toolbar layout 1.
 */
function ToolbarLayout(props: ToolbarLayoutProps) {
	const { className } = props;
	const navbar = useAppSelector(selectNavbar);
	const config = {
		navbar: {
			position: 'left',
			display: true,
		}
	}

	return (
		<AppBar
			className={clsx('relative z-20 flex shadow', className)}
			color="default"
			sx={{
				backgroundColor: (theme) =>
					theme.palette.mode === 'light'
						? theme.palette.background.paper
						: theme.palette.background.default
			}}
			position="static"
			elevation={0}
		>
			<Toolbar className="min-h-48 p-0 md:min-h-64">
				<div className="flex flex-1 px-16">
					{config.navbar.display && config.navbar.position === 'left' && (
						<>
							{/* <Hidden lgDown>
								{!navbar.open && (
									<NavbarToggleButton className="" />
								)}
							</Hidden> */}
							{!navbar.open && (
								<NavbarToggleButton className="" />
							)}

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
					<UtilityShortcuts />
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
