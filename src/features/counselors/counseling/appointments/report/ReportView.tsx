import React from 'react';
import { Typography, Divider, Box, Avatar } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetAppointmentReportQuery } from './report-api';
import { ContentLoading } from '@/shared/components';
import { AccessTime, CalendarMonth } from '@mui/icons-material';
import dayjs from 'dayjs';
import { renderHTML } from '@/shared/utils';

// Helper function to render HTML

const ReportPage = () => {
  const routeParams = useParams()
  const { id: appointmentId } = routeParams as { id: string };
  const { data, isLoading } = useGetAppointmentReportQuery(appointmentId)
  const report = data?.content

  console.log(report)

  if (isLoading) {
    return <ContentLoading />
  }

  return (
    <div className="p-32 bg-white shadow-lg border border-gray-300 w-lg flex flex-col gap-16">
      {/* Page Title */}
      <Typography className="text-20 md:text-24 font-extrabold tracking-tight leading-none">
        Counseling Report
      </Typography>

      <div className="flex gap-24 mt-4 pb-8">
        <div className='flex gap-8 items-center '>
          <CalendarMonth />
          <Typography className='' >{dayjs(report.appointment.requireDate).format('YYYY-MM-DD')}</Typography>
        </div>
        <div className='flex gap-8 items-center'>
          <AccessTime />
          <Typography className=''>{dayjs(report.appointment.startDateTime).format('HH:mm')} - {dayjs(report.appointment.endDateTime).format('HH:mm')}</Typography>
        </div>
      </div>

      <div className='flex'>
        <div className='flex flex-col gap-8 flex-1'>
          <Typography className="font-semibold text-lg text-primary-light">
            Counselee
          </Typography>
          <div
            className='rounded flex justify-start gap-16'
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
        <div className='flex flex-col gap-8 flex-1'>
          <Typography className="font-semibold text-lg text-primary-light">
            Counselor
          </Typography>
          <div
            className='rounded flex justify-start gap-16'
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
        <Typography variant="h6" className="font-semibold mb-4 bg-primary-main pb-2 text-primary-contrastText px-8">
          Consultation Goal
        </Typography>
        <div className="mt-4 space-y-8 mx-8">
          {report.consultationGoal?.specificGoal && (
            <div>
              <Typography className="font-semibold text-lg text-primary-light">
                Specific Goal:
              </Typography>
              {renderHTML(report.consultationGoal.specificGoal)}
            </div>
          )}
          {report.consultationGoal?.reason && (
            <div>
              <Typography className="font-semibold text-lg text-primary-light">
                Reason:
              </Typography>
              {renderHTML(report.consultationGoal.reason)}
            </div>
          )}
        </div>
      </section>

      {/* Consultation Content */}
      <section className="mb-16">
        <Typography variant="h6" className="font-semibold mb-4 bg-primary-main pb-2 text-primary-contrastText px-8">
          Consultation Content
        </Typography>
        <div className="mt-4 space-y-8 mx-8">
          {report.consultationContent?.summaryOfDiscussion && (
            <div>
              <Typography className="font-semibold text-lg text-primary-light">
                Summary of Discussion:
              </Typography>
              {renderHTML(report.consultationContent.summaryOfDiscussion)}
            </div>
          )}
          {report.consultationContent?.mainIssues && (
            <div>
              <Typography className="font-semibold text-lg text-primary-light">
                Main Issues:
              </Typography>
              {renderHTML(report.consultationContent.mainIssues)}
            </div>
          )}
          {report.consultationContent?.studentEmotions && (
            <div>
              <Typography className="font-semibold text-lg text-primary-light">
                Student Emotions:
              </Typography>
              {renderHTML(report.consultationContent.studentEmotions)}
            </div>
          )}
          {report.consultationContent?.studentReactions && (
            <div>
              <Typography className="font-semibold text-lg text-primary-light">
                Student Reactions:
              </Typography>
              {renderHTML(report.consultationContent.studentReactions)}
            </div>
          )}
        </div>
      </section>

      {/* Consultation Conclusion */}
      <section className="mb-16">
        <Typography variant="h6" className="font-semibold mb-4 bg-primary-main pb-2 text-primary-contrastText px-8">
          Consultation Conclusion
        </Typography>
        <div className="mt-4 space-y-8 mx-8">
          {report.consultationConclusion?.counselorConclusion && (
            <div>
              <Typography className="font-semibold text-lg text-primary-light">
                Counselor Conclusion:
              </Typography>
              {renderHTML(report.consultationConclusion.counselorConclusion)}
            </div>
          )}
          <div className='flex gap-8'>
            <Typography className="font-semibold text-lg text-primary-light">
              Follow-up Needed:
            </Typography>
            <Typography className='text-lg'>{report.consultationConclusion?.followUpNeeded ? 'Yes' : 'No'}</Typography>
          </div>
          {report.consultationConclusion?.followUpNotes && (
            <div>
              <Typography className="font-semibold text-lg text-primary-light">
                Follow-up Notes:
              </Typography>
              {renderHTML(report.consultationConclusion.followUpNotes)}
            </div>
          )}
        </div>
      </section>

      {/* Intervention */}
      <section>
        <Typography variant="h6" className="font-semibold mb-4 bg-primary-main pb-2 text-primary-contrastText px-8">
          Intervention
        </Typography>
        <div className="mt-4 space-y-4 mx-8">
          {report.intervention?.type && (
            <div>
              <Typography className="font-semibold text-lg text-primary-light">
                Type:
              </Typography>
              {renderHTML(report.intervention.type)}
            </div>
          )}
          {report.intervention?.description && (
            <div>
              <Typography className="font-semibold text-lg text-primary-light">
                Description:
              </Typography>
              {renderHTML(report.intervention.description)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ReportPage;
