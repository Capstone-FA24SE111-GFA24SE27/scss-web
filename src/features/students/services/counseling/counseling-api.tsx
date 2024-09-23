import { PaginationContent } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'counselors',
  'appointments'
] as const;


export const counselingApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCounselors: build.query<GetCounselorsApiResponse, GetCounselorsApiArg>({
        query: ({ page = 1, ratingFrom = '', ratingTo = '', search = '', sortBy = '', sortDirection = '' }) => ({
          url: `/api/counselors?SortDirection=ASC&sortBy=id`,
        }),
        providesTags: ['counselors']
      }),
      getCounselor: build.query<GetCounselorApiResponse, string>({
        query: (counselorId) => ({
          url: `/api/counselors/${counselorId}`,
        }),
        providesTags: ['counselors']
      }),
      getCounselorDailySlots: build.query<GetCounselorsDailySlotsResponse, GetCounselorsDailySlotsArg>({
        query: (arg) => ({
          url: `/api/counselors/daily-slots/${arg.counselorId}?from=${arg.from}&to=${arg.to}`,
        }),
        providesTags: ['counselors']
      }),
      bookCounselor: build.mutation<unknown, BookCounselorArg>({
        query: (arg) => ({
          method: 'POST',
          url: `/api/booking-counseling/${arg.counselorId}/appointment-request/create`,
          body: arg.appointmentRequest
        }),
        invalidatesTags: ['appointments']
      }),
    })
  })

export const {
  useGetCounselorsQuery,
  useGetCounselorQuery,
  useGetCounselorDailySlotsQuery,
  useBookCounselorMutation,
} = counselingApi


export type GetCounselorsApiResponse = ApiResponse<PaginationContent<Counselor>>
export type GetCounselorsApiArg = {
  search?: string,
  sortDirection?: 'ASC' | 'DESC',
  sortBy?: string,
  page?: number,
  ratingFrom?: number,
  ratingTo?: number
}

export type GetCounselorApiResponse = ApiResponse<Counselor>

export type Counselor = {
  id: string,
  email: string,
  avatarLink: string,
  rating: number,
  fullName: string,
  phoneNumber: string,
  dateOfBirth: number
}


export type GetCounselorsDailySlotsResponse = ApiResponse<DailySlot>
export type GetCounselorsDailySlotsArg = {
  counselorId: string,
  from: string,
  to: string,
}

export type DailySlot = {
  [date: string]: Slot[]
}


export type BookCounselorArg = {
  counselorId: string,
  appointmentRequest: AppointmentRequest,
}

export type AppointmentRequest = {
  slotCode: string;
  date: string;
  isOnline: boolean;
  reason: string;
}

export type Slot = {
  slotCode: string,
  startTime: string,
  endTime: string,
  status: 'EXPIRED' | 'AVAILABLE' | 'UNAVAILABLE',
  myAppointment: boolean
}




