import { Appointment } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

const addTagTypes = [
  'appointment'
] as const;

export const appointmentApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getAppointmentById: build.query<GetAppointmentByIdApiResponse, string>({
        query: (appointmentId) => ({
          url: `/api/appointments/${appointmentId}`,
          method: 'GET',
        }),
        providesTags: ['appointment']
      }),
    })
  });

export const {
  useGetAppointmentByIdQuery
} = appointmentApi;

type GetAppointmentByIdApiResponse = ApiResponse<Appointment>;