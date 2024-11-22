import { CounselingSlot, Counselor, PaginationContent, Profile } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'counselors',
  'appointments',
  'expertises',
  'specializations'
] as const;


export const counselorApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCounselorDetail: build.query<GetCounselorApiResponse, string>({
        query: (counselorId) => ({
          url: `/api/counselors/${counselorId}`,
        }),
        providesTags: ['counselors']
      }),
      getCounselorAcademic: build.query<GetCounselorApiAcademicResponse, string>({
        query: (counselorId) => ({
          url: `/api/counselors/academic/${counselorId}`,
        }),
        providesTags: ['counselors']
      }),

      getCounselorNonAcademic: build.query<GetCounselorApiResponse, string>({
        query: (counselorId) => ({
          url: `/api/counselors/non-academic/${counselorId}`,
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
      getCounselorExpertises: build.query<GetCounselorExpertisesApiResponse, void>({
        query: () => ({
          url: `/api/counselors/expertise`,
        }),
        providesTags: ['expertises']
      }),
      getCounselorSpecializations: build.query<GetCounselorSpecializationsApiResponse, void>({
        query: () => ({
          url: `/api/counselors/specialization`,
        }),
        providesTags: ['specializations']
      }),
      getCounselorSlots: build.query<GetCounselorSlotsApiResponse, string>({
        query: (date) => ({
          url: `/api/counselors/counseling-slot?date=${date}`,
        }),
      }),
      getWeeklySlots: build.query<GetCounselingSlotsResponse, number>({
        query: (counselorId) => ({
          url: `/api/manage/counselors/${counselorId}/counseling-slots`,
        }),
        providesTags: ['counselors'],
      }),
    })
  })

export const {
  useGetCounselorDetailQuery,
  useGetCounselorAcademicQuery,
  useGetCounselorNonAcademicQuery,
  useGetCounselorDailySlotsQuery,
  useBookCounselorMutation,
  useGetCounselorExpertisesQuery,
  useGetCounselorSpecializationsQuery,
  useGetCounselorSlotsQuery,
  useGetWeeklySlotsQuery
} = counselorApi


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
export type GetCounselorApiAcademicResponse = ApiResponse<PaginationContent<Counselor>>
export type GetRandomMatchedCounselorApiResponse = ApiResponse<Counselor>


export type GetCounselorsDailySlotsResponse = ApiResponse<DailySlot>
export type GetCounselorsDailySlotsArg = {
  counselorId: string,
  from: string,
  to: string,
}

export type DailySlot = {
  [date: string]: Slot[]
}

export type Slot = {
  slotId: number,
  slotCode: string,
  startTime: string,
  endTime: string,
  status: AppointmentStatus,
  myAppointment: boolean
}


export type Expertise = {
  id: number,
  name: string
}

export type Specialization = {
  id: number,
  name: string
}


export type AppointmentStatus = 'EXPIRED' | 'AVAILABLE' | 'UNAVAILABLE'

export type BookCounselorArg = {
  counselorId: number,
  appointmentRequest: AppointmentRequest,
}

export type AppointmentRequest = {
  slotCode: string;
  date: string;
  isOnline: boolean;
  reason: string;
}


export type GetCounselorExpertisesApiResponse = ApiResponse<Expertise[]>
export type GetCounselorSpecializationsApiResponse = ApiResponse<Specialization[]>


export type GetCounselorSlotsApiResponse = ApiResponse<Slot[]>

export type GetCounselorRandomMatchApiArg = {
  slotId: number,
  date: string,
  gender?: string,
  expertiseId?: number,
  specializationId?: number,
}

export type GetCounselingSlotsResponse = ApiResponse<CounselingSlot[]>
