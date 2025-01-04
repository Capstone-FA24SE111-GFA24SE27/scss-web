import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { Box, Button, Chip, Rating } from '@mui/material';
import {
	EmailOutlined,
	LocalPhoneOutlined,
	Mail,
	Phone,
} from '@mui/icons-material';
import { Counselor } from '@shared/types';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@shared/store';
import { selectCounselor } from './counselor-list-slice';

type CounselorListItemPropsType = {
	counselor: Counselor;
	onClick: (counselor: Counselor) => void;
};

/**
 * The contact list item.
 */
function CounselorListItem(props: CounselorListItemPropsType) {
	const { counselor, onClick } = props;
	const selectedCounselor = useAppSelector(selectCounselor);
	return (
		<ListItemButton
			selected={counselor?.id == Number(selectedCounselor?.id)}
			className='flex items-start justify-between gap-24 p-8 px-24 py-16 rounded-lg shadow bg-background-paper shadow-secondary-main/20'
			sx={{ bgcolor: 'background.paper' }}
			component={Box}
			onClick={() => onClick(counselor)}
		>
			<div className='flex items-start gap-24'>
				<ListItemAvatar>
					<Avatar
						alt={counselor.profile.fullName}
						src={counselor.profile.avatarLink}
						className='size-80 !border border-secondary-main'
					/>
				</ListItemAvatar>
				<Box className='flex flex-col justify-between gap-8'>
					<ListItemText
						classes={{
							root: 'm-0',
							primary: 'font-semibold leading-5 truncate text-lg',
						}}
						primary={counselor.profile.fullName}
						secondary={
							counselor.expertise?.name || counselor.major?.name
						}
					/>
					<div className='flex items-center gap-16'>
						<div className='flex items-center w-120'>
							<LocalPhoneOutlined fontSize='small' />
							<div className='ml-8 leading-6 text-text-secondary'>
								{counselor.profile.phoneNumber}
							</div>
						</div>
						<div className='flex items-center'>
							<EmailOutlined fontSize='small' />
							<div className='ml-8 leading-6 text-text-secondary'>
								{counselor.email}
							</div>
						</div>
					</div>
					<div className='flex flex-wrap gap-8 mt-8'>
						{counselor.specializedSkills
							?.split(`\n`)
							.map((item, index) => (
								<Chip key={index} label={item} size='small' />
							))}
					</div>
				</Box>
			</div>
		</ListItemButton>
	);
}

export default CounselorListItem;
