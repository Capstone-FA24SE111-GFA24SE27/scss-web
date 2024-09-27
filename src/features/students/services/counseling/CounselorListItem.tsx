import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
// import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { NavLinkAdapter } from '@/shared/components';
import { Box, Chip, Rating } from '@mui/material';
import { Counselor } from './counseling-api';
import { Mail, Phone } from '@mui/icons-material';

type CounselorListItemPropsType = {
	counselor: Counselor;
};

/**
 * The contact list item.
 */
function CounselorListItem(props: CounselorListItemPropsType) {
	const { counselor } = props;

	return (
		<>
			<ListItemButton
				className="p-8 flex gap-24 items-center"
				sx={{ bgcolor: 'background.paper'}}
				component={NavLinkAdapter}
				to={`${counselor.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={counselor.fullName}
						src={counselor.avatarLink}
						className='size-80'
					/>
				</ListItemAvatar>
				<Box className='flex flex-col gap-12 mt-16 justify-between'>
					<ListItemText
						classes={{ root: 'm-0', primary: 'font-semibold leading-5 truncate text-lg' }}
						primary={counselor.fullName}
						secondary={counselor.email}
					/>
					{/* <div className='flex gap-8'>
						<Rating
							name="simple-controlled"
							size='small'
							value={counselor.rating}
							readOnly
							precision={0.5}
						/>
						<Typography color='text.secondary'>(160)</Typography>
					</div> */}

					<div className="flex flex-wrap items-center">
						<Chip
							label={'Technology'}
							className="mr-12 mb-12"
							size="small"
							color='default'
						/>
						<Chip
							label={'Academic'}
							className="mr-12 mb-12"
							size="small"
						/>
					</div>
				</Box>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default CounselorListItem;
