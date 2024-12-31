import { ExpandableText, ItemMenu, openDialog } from '@/shared/components';
import { motionVariants } from '@/shared/configs';
import { AppointmentDetail } from '@/shared/pages';
import { Feedback, Profile } from '@/shared/types';
import { Description, Visibility } from '@mui/icons-material';
import { Avatar, ListItem, Paper, Rating, Typography } from '@mui/material';
import { useAppDispatch } from '@shared/store';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

export type FeedbackItem = {
  feedback: Feedback,
  profile: Profile,
  handleOpenDetail: () => void
}
const FeedbackItem = ({ feedback, profile, handleOpenDetail }) => {
  const dispatch = useAppDispatch();
  return (
    <motion.div
      variants={motionVariants.item}
      key={feedback.id}
    >
      <Paper className='flex justify-between items-start shadow'>
        <div className='flex gap-16 items-start p-16'>
          <Avatar
            className='size-32'
            alt={profile.fullName}
            src={profile.avatarLink}
          />
          <div>
            <Typography className='font-semibold'>{profile.fullName}</Typography>
            <Typography className='text-text-disabled font-normal text-sm'>{dayjs(feedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
            <Rating value={feedback.rating} readOnly />
            <ExpandableText text={feedback.comment} limit={300} />
          </div>
        </div>
        <ListItem
          className='bg-black p-0 mt-32'
          secondaryAction={
            <ItemMenu
              menuItems={[
                {
                  label: 'View Source',
                  onClick: handleOpenDetail,
                  icon: <Visibility fontSize='small' />
                },
              ]}
            />
          }
        >
        </ListItem>
      </Paper>

    </motion.div>
  )
}

export default FeedbackItem