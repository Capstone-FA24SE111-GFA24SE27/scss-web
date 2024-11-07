import React from 'react';
import { Typography, Divider, Box, Avatar } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import { AppointmentReport, Breadcrumbs, ContentLoading } from '@/shared/components';
import { AccessTime, CalendarMonth } from '@mui/icons-material';
import dayjs from 'dayjs';
import { renderHTML } from '@/shared/components';
import { navigateUp } from '@/shared/utils';
import { useGetAppointmentReportQuery } from '@/features/counselors/counseling/appointments/report/report-api';

// Helper function to render HTML

const StudentAppointmentReport = () => {
  const routeParams = useParams()
  const { appointmentId: appointmentId } = routeParams as { appointmentId: string };
  const { data, isLoading } = useGetAppointmentReportQuery(appointmentId)
  const report = data?.content
  const location = useLocation()
  const studentUrl = navigateUp(location, 2)

  if (isLoading) {
    return <ContentLoading />
  }
  return (
    <div className='p-32'>
      <Breadcrumbs
        className='pb-16'
        parents={[
          {
            label: report?.student?.profile?.fullName,
            url: `${studentUrl}`
          }
        ]}
        currentPage={"Appointmnet Report"}
      />
      <AppointmentReport report={report} />
    </div>
  )
};

export default StudentAppointmentReport;
