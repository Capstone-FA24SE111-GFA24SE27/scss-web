import { FeedbackItem, openDialog } from '@/shared/components';
import { motionVariants } from '@/shared/configs';
import { AppointmentDetail } from '@/shared/pages';
import { Paper, Typography } from '@mui/material';
import { useAppDispatch } from '@shared/store';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useGetCounselorAppointmentsManagementQuery } from '../counselors-api';
import { firstDayOfMonth, lastDayOfMonth } from '@/shared/constants';


const CounselorRecentAppointmentFeedbacks = ({ counselorId }: { counselorId?: string }) => {
  const { id: routeId } = useParams()
  const id = counselorId || routeId
  const { data: appointmentsData, isLoading } = useGetCounselorAppointmentsManagementQuery({
    fromDate: firstDayOfMonth,
    toDate: lastDayOfMonth,
    counselorId: Number(id),
    size: 9999,
  });
  const counselorAppointmentsWithFeedback = appointmentsData?.content.data?.filter(item => item.appointmentFeedback)
  const dispatch = useAppDispatch()

  console.log(appointmentsData?.content.data, `||`, counselorAppointmentsWithFeedback)
  
  return (
    <Paper className='p-16 shadow space-y-16 h-sm'>
      <Typography className="font-semibold text-2xl">Appointment Feedbacks</Typography>
      {
        !counselorAppointmentsWithFeedback?.length
          ? <div className='text-center p-32'>
            <Typography variant='h5' className='text-text-disabled'>No feedbacks found</Typography>
          </div>
          : (
            <motion.div
              variants={motionVariants.container}
              initial="hidden"
              animate="show"
              className=''
            >
              <div className='grid grid-cols-3 gap-16 divide-x-'>
                {counselorAppointmentsWithFeedback?.map((item) => (
                  <motion.div
                    variants={motionVariants.item}
                    key={item.id}
                  >
                    <FeedbackItem
                      feedback={item.appointmentFeedback}
                      profile={item.studentInfo.profile}
                      handleOpenDetail={() =>
                        dispatch(openDialog({
                          children: <AppointmentDetail id={item.id.toString()} />
                        }))}
                    />

                  </motion.div>
                ))
                }
              </div >
            </motion.div >
          )
      }
    </Paper >
  )
}

export default CounselorRecentAppointmentFeedbacks