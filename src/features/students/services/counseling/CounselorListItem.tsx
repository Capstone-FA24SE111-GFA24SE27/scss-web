import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
// import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { NavLinkAdapter } from '@/shared/components';
import { Box, Rating } from '@mui/material';

type ContactListItemPropsType = {
	counselor: any;
};

/**
 * The contact list item.
 */
function ContactListItem(props: ContactListItemPropsType) {
	const { counselor } = props;

	return (
		<>
			<ListItemButton
				className="p-16 flex gap-16"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`${counselor.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={counselor.fullName}
						src={counselor.avatarLink}
						className='size-64'
					/>
				</ListItemAvatar>
				<Box className='flex flex-col gap-2'>
					<ListItemText
						classes={{ root: 'm-0', primary: 'font-semibold leading-5 truncate' }}
						primary={counselor.fullName}
						secondary={
							<Typography
								className="inline"
								component="span"
								variant="caption"
								color="text.secondary"
							>
								{counselor.email}
							</Typography>
						}
					/>
					<Rating
						name="simple-controlled"
						size='small'
						value={4.6}
						readOnly
						precision={0.5}
					/>
				</Box>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default ContactListItem;
