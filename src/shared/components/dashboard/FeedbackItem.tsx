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
  handleOpenDetail?: () => void
}
const FeedbackItem = ({
  feedback,
  profile,
  handleOpenDetail
}: FeedbackItem) => {
  const dispatch = useAppDispatch();

  const viewAppointmentDetailDialog = () => {
    dispatch(openDialog({
      children: <AppointmentDetail id={feedback.id.toString()} />
    }))
  }

  return (
    <motion.div
      variants={motionVariants.item}
      key={feedback.id}
    >
      <Paper className='flex items-start shadow'>
        <div className='flex gap-16 p-16 flex-1'>
          <Avatar
            className='size-32'
            alt={profile.fullName}
            src={profile.avatarLink}
          />
          <div className='w-full '>
            <Typography className='font-semibold'>{profile.fullName}</Typography>
            <Typography className='text-text-disabled font-normal text-sm'>{dayjs(feedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
            <Rating value={feedback.rating} readOnly />
            <ExpandableText text={feedback.comment} limit={100} className='w-full' />

          </div>
        </div>

        <ItemMenu
          menuItems={[
            {
              label: 'View Source',
              onClick: handleOpenDetail || viewAppointmentDetailDialog,
              icon: <Visibility fontSize='small' />
            },
          ]}
        />
      </Paper>

    </motion.div>
  )
}

export default FeedbackItem