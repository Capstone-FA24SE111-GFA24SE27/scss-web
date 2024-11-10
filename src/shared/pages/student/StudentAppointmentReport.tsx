import React from 'react';
import { Typography, Divider, Box, Avatar } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';
import { AppointmentReport, Breadcrumbs, ContentLoading } from '@/shared/components';
import { AccessTime, CalendarMonth } from '@mui/icons-material';
import dayjs from 'dayjs';
import { renderHTML } from '@/shared/components';
import { navigateUp } from '@/shared/utils';
import { useGetAppointmentReportQuery } from '@/shared/services';

// Helper function to render HTML

const StudentAppointmentReport = ({ id }: { id?: string }) => {
  const routeParams = useParams()
  const { appointmentId: appointmentRouteId } = routeParams
  const appointmentId = id || appointmentRouteId
  const { data, isLoading } = useGetAppointmentReportQuery(appointmentId, {
    skip: !appointmentRouteId
  })
  const report = data?.content
  const location = useLocation()
  const studentUrl = navigateUp(location, 2)

  if (isLoading) {
    return <ContentLoading />
  }

  if (appointmentRouteId) {
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
  }

  return <AppointmentReport report={report} />

};

export default StudentAppointmentReport;
