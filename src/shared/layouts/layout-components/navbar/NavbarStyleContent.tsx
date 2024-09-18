import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { memo } from 'react';
import NavbarToggleButton from './NavbarToggleButton';
import UserNavbarHeader from './UserNavbarHeader';
import {NavigationList} from '../navigation';
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

type NavbarStyleContentProps = {
	className?: string;
};


function NavbarStyleContent(props: NavbarStyleContentProps) {
	const { className = '' } = props;

	return (
		<Root className={clsx('flex h-full flex-auto flex-col overflow-hidden', className)}>
			<div className="flex flex-row items-center h-48 px-20 shrink-0 md:h-64">
				<div className="flex flex-1 mx-4">
					{/* <Logo /> */}
					Logo here
				</div>

				<NavbarToggleButton />

			</div>

			<StyledContent
				className="flex flex-col flex-1 min-h-0"
			// option={{ suppressScrollX: true, wheelPropagation: false }}
			>
				<UserNavbarHeader />

				<NavigationList />

				<div className="flex items-center justify-center py-48 flex-0 opacity-10">
					<img
						className="w-full max-w-64"
						src="assets/images/logo/FPT-education.png"
						alt="footer logo"
					/>
				</div>
			</StyledContent>
		</Root>
	);
}

export default memo(NavbarStyleContent);
