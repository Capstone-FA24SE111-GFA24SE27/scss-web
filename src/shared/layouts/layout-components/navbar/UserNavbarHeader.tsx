import { darken, styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const Root = styled('div')(({ theme }) => ({
	'& .username, & .email': {
		transition: theme.transitions.create('opacity', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	},
	'& .avatar': {
		background: darken(theme.palette.background.default, 0.05),
		transition: theme.transitions.create('all', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		}),
		bottom: 0,
		'& > img': {
			borderRadius: '50%'
		}
	}
}));

/**
 * The user navbar header.
 */
function UserNavbarHeader() {
	// const user = useAppSelector(selectUser);
    const user = {
        data: {
            photoURL: '',
            displayName: 'Doan Tien Phat',
            email: 'dtphatkh@gmail.com'
        }
    }
	return (
		<Root className="user relative flex flex-col items-center justify-center p-16 pb-14 shadow-0">
			<div className="mb-24 flex items-center justify-center">
				<Avatar
					sx={{
						backgroundColor: 'background.paper',
						color: 'text.secondary'
					}}
					className="avatar uppercase h-72 w-72 text-32 font-bold"
					src={user.data.photoURL}
					alt={user.data.displayName}
				>
					{user?.data?.displayName?.charAt(0)}
				</Avatar>
			</div>
			<Typography className="username whitespace-nowrap text-lg font-medium">
				{user?.data?.displayName}
			</Typography>
			<Typography
				className="email whitespace-nowrap font-medium"
				color="text.secondary"
			>
				{user.data.email}
			</Typography>
		</Root>
	);
}

export default UserNavbarHeader;
