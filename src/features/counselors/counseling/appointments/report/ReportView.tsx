import React from 'react';
import { Typography, Divider, Box, Avatar } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetAppointmentReportQuery } from './report-api';
import { AppointmentReport, ContentLoading } from '@/shared/components';
import { AccessTime, CalendarMonth } from '@mui/icons-material';
import dayjs from 'dayjs';
import { RenderHTML } from '@/shared/components';

// Helper function to render HTML

const ReportView = () => {
  const routeParams = useParams()
  const { id: appointmentId } = routeParams as { id: string };
  const { data, isLoading } = useGetAppointmentReportQuery(appointmentId)
  const report = data?.content

  if (isLoading) {
    return <ContentLoading />
  }
  return <AppointmentReport report={report} />
};

export default ReportView;
