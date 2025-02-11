import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { memo } from 'react';
import NavbarToggleButton from './NavbarToggleButton';
import UserNavbarHeader from './UserNavbarHeader';
import { NavigationList } from '../navigation';
import { Box, Typography } from '@mui/material';
import { NavLinkAdapter } from '@/shared/components';
const Root = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.default,
	color: theme.palette.text.primary,
	'& ::-webkit-scrollbar-thumb': {
		boxShadow: `inset 0 0 0 20px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
			}`

	},
	'& ::-webkit-scrollbar-thumb:active': {
		boxShadow: `inset 0 0 0 20px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
			}`
	}
}));

const StyledContent = styled('div')(() => ({
	overscrollBehavior: 'contain',
	overflowX: 'hidden',
	overflowY: 'auto',
	WebkitOverflowScrolling: 'touch',
	backgroundRepeat: 'no-repeat',
	backgroundSize: '100% 40px, 100% 10px',
	backgroundAttachment: 'local, scroll',
	scrollbarWidth: 'thin',
}));

type NavbarContentProps = {
	className?: string;
};


function NavbarContent(props: NavbarContentProps) {
	const { className = '' } = props;

	return (
		<Root className={clsx('flex h-full flex-auto flex-col overflow-hidden bg-background-paper', className)}>
			<div className="flex flex-row items-center h-48 px-8 shrink-0 md:h-64 mt-4">
				<Box
					component={NavLinkAdapter}
					to={``}
					className="flex flex-col flex-1"
				>
					{/* <img alt='logo' src='/assets/images/logo/FPT-education.jpeg' /> */}
					<div className='flex flex-1 gap-16 items-center'>
						<img alt='logo' src='/assets/icons/scss-icon.png' className='object-cover size-52' />
						<Typography className='text-5xl font-serif text-secondary-main font-bold tracking-wide'>SCSS</Typography>
					</div>
					{/* <Typography className='text-xs truncate font-bold'>Student Counseling & Support System</Typography> */}
				</Box>

				<NavbarToggleButton />

			</div>

			<StyledContent
				className="flex flex-col flex-1 min-h-0 bg-background-paper"
			// option={{ suppressScrollX: true, wheelPropagation: false }}
			>
				{/* <UserNavbarHeader /> */}

				<NavigationList />

				{/* <div className="flex items-center justify-center py-48 flex-0 opacity-10">
					<img
						className="w-full max-w-64"
						src="assets/images/logo/FPT-education.jpeg"
						alt="footer logo"
					/>
				</div> */}
			</StyledContent>
		</Root>
	);
}

export default memo(NavbarContent);
