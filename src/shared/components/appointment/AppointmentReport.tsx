import { renderHTML } from '@/shared/components';
import { AppointmentReportType } from '@/shared/types';
import { AccessTime, CalendarMonth } from '@mui/icons-material';
import { Avatar, Box, Divider, Paper, Typography, styled } from '@mui/material';
import dayjs from 'dayjs';
// import styles from './AppointmentReport.module.css';

// Helper function to render HTML
const Root = styled(Box)(({ theme }) => ({
  ul: {
    display: 'block',
    listStyleType: 'disc',
    marginBlockStart: '1em',
    marginBlockEnd: '1em',
    marginInlineStart: '0',
    marginInlineEnd: '0',
    paddingInlineStart: '40px',
  },
  ol: {
    display: 'block',
    listStyleType: 'decimal',
    marginBlockStart: '1em',
    marginBlockEnd: '1em',
    marginInlineStart: '0',
    marginInlineEnd: '0',
    paddingInlineStart: '40px',
  },
  li: {
    display: 'list-item',
  },
}));

const AppointmentReport = ({ report }: { report: AppointmentReportType }) => {
  if (!report) {
    return <Typography className=''>No report found </Typography>
  }


  return (
    <Root >
      <Paper className="flex flex-col gap-16 p-32 bg-white rounded shadow-lg w-lg" >
        {/* Page Title */}
        <Typography className="font-extrabold leading-none tracking-tight text-20 md:text-24">
          Counseling Report
        </Typography>

        <div className="flex gap-24 pb-8 mt-4">
          <div className='flex items-center gap-8 '>
            <CalendarMonth />
            <Typography className='' >{dayjs(report.appointment.startDateTime).format('YYYY-MM-DD')}</Typography>
          </div>
          <div className='flex items-center gap-8'>
            <AccessTime />
            <Typography className=''>{dayjs(report.appointment.startDateTime).format('HH:mm')} - {dayjs(report.appointment.endDateTime).format('HH:mm')}</Typography>
          </div>
        </div>

        <div className='flex'>
          <div className='flex flex-col flex-1 gap-8'>
            <Typography className="text-lg font-semibold text-primary-light">
              Counselee
            </Typography>
            <div
              className='flex justify-start gap-16 rounded'
            >
              <Avatar
                alt={report.student.profile.fullName}
                src={report.student.profile.avatarLink}
              />
              <div >
                <Typography className='font-semibold text-primary-main'>{report.student.profile.fullName}</Typography>
                <Typography color='text.secondary'>{report.student.email || 'counselor@fpt.edu.vn'}</Typography>
              </div>
            </div>
          </div>
          <div className='flex flex-col flex-1 gap-8'>
            <Typography className="text-lg font-semibold text-primary-light">
              Counselor
            </Typography>
            <div
              className='flex justify-start gap-16 rounded'
            >
              <Avatar
                alt={report.counselor.profile.fullName}
                src={report.counselor.profile.avatarLink}
              />
              <div >
                <Typography className='font-semibold text-primary-main'>{report.counselor.profile.fullName}</Typography>
                <Typography color='text.secondary'>{report.counselor.email || 'counselor@fpt.edu.vn'}</Typography>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Consultation Goal */}
        <section className="mb-16">
          <Typography variant="h6" className="px-8 pb-2 mb-4 font-semibold bg-primary-main text-primary-contrastText">
            Consultation Goal
          </Typography>
          <div className="mx-8 mt-4 space-y-8">
            {report.consultationGoal?.specificGoal && (
              <div>
                <Typography className="text-lg font-semibold text-primary-light">
                  Specific Goal:
                </Typography>
                {renderHTML(report.consultationGoal.specificGoal)}
              </div>
            )}
            {report.consultationGoal?.reason && (
              <div>
                <Typography className="text-lg font-semibold text-primary-light">
                  Reason:
                </Typography>
                {renderHTML(report.consultationGoal.reason)}
              </div>
            )}
          </div>
        </section>

        {/* Consultation Content */}
        <section className="mb-16">
          <Typography variant="h6" className="px-8 pb-2 mb-4 font-semibold bg-primary-main text-primary-contrastText">
            Consultation Content
          </Typography>
          <div className="mx-8 mt-4 space-y-8">
            {report.consultationContent?.summaryOfDiscussion && (
              <div>
                <Typography className="text-lg font-semibold text-primary-light">
                  Summary of Discussion:
                </Typography>
                {renderHTML(report.consultationContent.summaryOfDiscussion)}
              </div>
            )}
            {report.consultationContent?.mainIssues && (
              <div>
                <Typography className="text-lg font-semibold text-primary-light">
                  Main Issues:
                </Typography>
                {renderHTML(report.consultationContent.mainIssues)}
              </div>
            )}
            {report.consultationContent?.studentEmotions && (
              <div>
                <Typography className="text-lg font-semibold text-primary-light">
                  Student Emotions:
                </Typography>
                {renderHTML(report.consultationContent.studentEmotions)}
              </div>
            )}
            {report.consultationContent?.studentReactions && (
              <div>
                <Typography className="text-lg font-semibold text-primary-light">
                  Student Reactions:
                </Typography>
                {renderHTML(report.consultationContent.studentReactions)}
              </div>
            )}
          </div>
        </section>

        {/* Consultation Conclusion */}
        <section className="mb-16">
          <Typography variant="h6" className="px-8 pb-2 mb-4 font-semibold bg-primary-main text-primary-contrastText">
            Consultation Conclusion
          </Typography>
          <div className="mx-8 mt-4 space-y-8">
            {report.consultationConclusion?.counselorConclusion && (
              <div>
                <Typography className="text-lg font-semibold text-primary-light">
                  Counselor Conclusion:
                </Typography>
                {renderHTML(report.consultationConclusion.counselorConclusion)}
              </div>
            )}
            <div className='flex gap-8'>
              <Typography className="text-lg font-semibold text-primary-light">
                Follow-up Needed:
              </Typography>
              <Typography className='text-lg'>{report.consultationConclusion?.followUpNeeded ? 'Yes' : 'No'}</Typography>
            </div>
            {report.consultationConclusion?.followUpNotes && (
              <div>
                <Typography className="text-lg font-semibold text-primary-light">
                  Follow-up Notes:
                </Typography>
                {renderHTML(report.consultationConclusion.followUpNotes)}
              </div>
            )}
          </div>
        </section>

        {/* Intervention */}
        <section>
          <Typography variant="h6" className="px-8 pb-2 mb-4 font-semibold bg-primary-main text-primary-contrastText">
            Intervention
          </Typography>
          <div className="mx-8 mt-4 space-y-4">
            {report.intervention?.type && (
              <div>
                <Typography className="text-lg font-semibold text-primary-light">
                  Type:
                </Typography>
                {renderHTML(report.intervention.type)}
              </div>
            )}
            {report.intervention?.description && (
              <div>
                <Typography className="text-lg font-semibold text-primary-light">
                  Description:
                </Typography>
                {renderHTML(report.intervention.description)}
              </div>
            )}
          </div>
        </section>
      </Paper>
    </Root>
  );
};

export default AppointmentReport;
