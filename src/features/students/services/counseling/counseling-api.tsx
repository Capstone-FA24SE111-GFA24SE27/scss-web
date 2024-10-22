import { Counselor, PaginationContent, Profile } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'counselors',
  'appointments',
  'expertises',
  'specializations'
] as const;


export const counselingApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCounselorsAcademic: build.query<GetCounselorApiAcademicResponse, GetCounselorsApiArg>({
        query: ({ page = 1, ratingFrom = '', ratingTo = '', search = '', sortBy = '', sortDirection = '' }) => ({
          url: `/api/counselors/academic?search=${search}`,
        }),
        providesTags: ['counselors']
      }),
      getCounselorsNonAcademic: build.query<GetCounselorApiAcademicResponse, GetCounselorsApiArg>({
        query: ({ page = 1, ratingFrom = '', ratingTo = '', search = '', sortBy = '', sortDirection = '' }) => ({
          url: `/api/counselors/non-academic?search=${search}`,
        }),
        providesTags: ['counselors']
      }),
      getCounselorAcademic: build.query<GetCounselorApiAcademicResponse, string>({
        query: (counselorId) => ({
          url: `/api/counselors/academic/${counselorId}`,
        }),
        providesTags: ['counselors']
      }),
      getCounselor: build.query<GetCounselorApiResponse, string>({
        query: (counselorId) => ({
          url: `/api/counselors/${counselorId}`,
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
      getRandomMatchedCousenlorAcademic: build.mutation<GetRandomMatchedCounselorApiResponse, GetCounselorRandomMatchApiArg>({
        query: ({ slotId, date, gender = '', expertiseId = '' }) => ({
          method: 'GET',
          url: `/api/counselors/academic/random/match?slotId=${slotId}&date=${date}&gender=${gender}&expertiseId=${expertiseId}&`,
        }),
      }),
      getRandomMatchedCousenlorNonAcademic: build.mutation<GetRandomMatchedCounselorApiResponse, GetCounselorRandomMatchApiArg>({
        query: ({ slotId, date, gender = '', expertiseId = '' }) => ({
          method: 'GET',
          url: `/api/counselors/non-academic/random/match?slotId=${slotId}&date=${date}&gender=${gender}&expertiseId=${expertiseId}&`,
        }),
      }),
    })
  })

export const {
  useGetCounselorsAcademicQuery,
  useGetCounselorsNonAcademicQuery,
  useGetCounselorQuery,
  useGetCounselorAcademicQuery,
  useGetCounselorNonAcademicQuery,
  useGetCounselorDailySlotsQuery,
  useBookCounselorMutation,
  useGetCounselorExpertisesQuery,
  useGetCounselorSpecializationsQuery,
  useGetCounselorSlotsQuery,
  useGetRandomMatchedCousenlorAcademicMutation,
  useGetRandomMatchedCousenlorNonAcademicMutation,
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







