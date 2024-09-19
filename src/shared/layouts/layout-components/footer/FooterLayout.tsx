import AppBar from '@mui/material/AppBar';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { memo } from 'react';
import clsx from 'clsx';
// import { useAppSelector } from 'app/store/hooks';

type FooterLayoutProps = { className?: string };

/**
 * The footer layout 1.
 */
function FooterLayout(props: FooterLayoutProps) {
	const { className } = props;

	// const footerTheme = useAppSelector(selectFooterTheme);

	return (
		// <ThemeProvider theme={footerTheme}>
		<AppBar
			id="fuse-footer"
			className={clsx('relative z-20 shadow', className)}
			color="default"
			sx={{
				backgroundColor: (theme) =>
					theme.palette.mode === 'light'
						? theme.palette.background.paper
						: theme.palette.background.default
			}}
			elevation={0}
		>
			<Toolbar className="min-h-48 md:min-h-64 px-8 sm:px-12 py-0 flex items-center overflow-x-auto">
				<div>
					<span className="text-gray-500 text-sm font-medium">
						© 2024 Capstone. All rights reserved.
					</span>
				</div>
			</Toolbar>
		</AppBar>
		// </ThemeProvider>
	);
}

export default memo(FooterLayout);
