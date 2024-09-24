import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@shared/store/hooks';
import { logout, selectAccount, setAccount } from '@shared/store/user-slice';
import { NavLinkAdapter } from '@shared/components';


/**
 * The user menu.
 */
function UserMenu() {
	const account = useAppSelector(selectAccount)
	const user = account?.profile
	const dispatch = useAppDispatch()
	const [userMenu, setUserMenu] = useState(null);
	const userMenuClick = (event: any) => {
		setUserMenu(event.currentTarget);
	};
	const userMenuClose = () => {
		setUserMenu(null);
	};

	const navigate = useNavigate()

	if (!user) {
		return null;
	}

	return (
		<>
			<Button
				className="min-h-40 min-w-40 p-0 md:px-16 md:py-6"
				onClick={userMenuClick}
				color="inherit"
			>
				<div className="mx-4 hidden flex-col items-end md:flex">
					<Typography
						component="span"
						className="flex font-semibold"
					>
						{user.fullName}
					</Typography>
					<Typography
						className="text-11 font-medium capitalize"
						color="text.secondary"
					>
						{account.role.toString()}
						{(!account.role || (Array.isArray(account.role) && account.role.length === 0)) && 'Guest'}
					</Typography>
				</div>

				{user.avatarLink ? (
					<Avatar
						sx={{
							background: (theme) => theme.palette.background.default,
							color: (theme) => theme.palette.text.secondary
						}}
						className="md:mx-4"
						alt="user photo"
						src={user.avatarLink}
					/>
				) : (
					<Avatar
						sx={{
							// background: (theme) => darken(theme.palette.background.default, 0.05),
							color: (theme) => theme.palette.text.secondary
						}}
						className="md:mx-4"
					>
						{user?.fullName[0]}
					</Avatar>
				)}
			</Button>

			<Popover
				open={Boolean(userMenu)}
				anchorEl={userMenu}
				onClose={userMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				classes={{
					paper: 'py-8'
				}}
			>

				<MenuItem
					onClick={userMenuClose}
					role="button"
				>
					<ListItemIcon className="min-w-40">
						{/* <FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon> */}
					</ListItemIcon>
					<ListItemText primary="Profile" />
				</MenuItem>

				<MenuItem
					component={NavLinkAdapter}
					to="/activity"
					onClick={userMenuClose}
					role="button"
				>
					<ListItemIcon className="min-w-40">
						{/* <FuseSvgIcon>heroicons-outline:mail-open</FuseSvgIcon> */}
					</ListItemIcon>
					<ListItemText primary="My Activity" />
				</MenuItem>

				<MenuItem
					onClick={() => {
						userMenuClose();
						navigate('/')
						dispatch(logout())
					}}
				>
					<ListItemIcon className="min-w-40">
					</ListItemIcon>
					<ListItemText primary="Sign out" />
				</MenuItem>

			</Popover >
		</>
	);
}

export default UserMenu;
