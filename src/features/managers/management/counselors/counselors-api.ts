import { Counselor, PaginationContent, Profile } from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store'


export const addTagTypes = [
  'counselors',
  'counselingSlots'
] as const;


export const counselorsMangementApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getCounselorsAcademicManagement: build.query<GetCounselorsApiResponse, GetCounselorsApiArg>({
        query: ({ page = 1, ratingFrom = '', ratingTo = '', search = '', sortBy = '', sortDirection = '' }) => ({
          url: `/api/manage/counselors/academic`,
        }),
        providesTags: ['counselors']
      }),
      getCounselorsNonAcademicManagement: build.query<GetCounselorsApiResponse, GetCounselorsApiArg>({
        query: ({ page = 1, ratingFrom = '', ratingTo = '', search = '', sortBy = '', sortDirection = '' }) => ({
          url: `/api/manage/counselors/non-academic`,
        }),
        providesTags: ['counselors']
      }),
      getCounselor: build.query<GetCounselorApiResponse, number>({
        query: (counselorId) => ({
          url: `/api/manage/counselors/${counselorId}`,
        }),
        providesTags: ['counselors']
      }),
      updateCounselorStatus: build.mutation<void, UpdateCounselorStatusArg>({
        query: ({ counselorId, status }) => ({
          url: `/api/manage/counselors/${counselorId}/status?status=${status}`,
          method: 'PUT',
        }),
        invalidatesTags: ['counselors']
      }),
      getCounselingSlots: build.query<GetCounselingSlotsResponse, void>({
        query: () => ({
          url: `/api/manage/counselors/counselling-slots`,
        }),
        providesTags: ['counselingSlots']
      }),
      updateCounselorCounselingSlots: build.mutation<void, UpdateCounselorCounselingSlotArg>({
        query: ({ counselorId, slotId }) => ({
          url: `/api/manage/counselors/${counselorId}/assign-slot?slotId=${slotId}`,
          method: 'PUT',
        }),
        invalidatesTags: ['counselors']
      }),
      deleteCounselorCounselingSlots: build.mutation<void, UpdateCounselorCounselingSlotArg>({
        query: ({ counselorId, slotId }) => ({
          url: `/api/manage/counselors/${counselorId}/unassign-slot?slotId=${slotId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['counselors']
      }),
      updateCounselorAvailableDateRange: build.mutation<void, UpdateCounselorAvailableDateRange>({
        query: ({ counselorId, startDate, endDate, }) => ({
          url: `/api/manage/counselors/${counselorId}/available-date-range?startDate=${startDate}&endDate=${endDate}`,
          method: 'PUT',
        }),
        invalidatesTags: ['counselors']
      }),
    })
  })

export const {
  useGetCounselorsAcademicManagementQuery,
  useGetCounselorsNonAcademicManagementQuery,
  useGetCounselorQuery,
  useUpdateCounselorStatusMutation,
  useGetCounselingSlotsQuery,
  useUpdateCounselorCounselingSlotsMutation,
  useDeleteCounselorCounselingSlotsMutation,
  useUpdateCounselorAvailableDateRangeMutation
} = counselorsMangementApi


export type GetCounselorsApiResponse = ApiResponse<PaginationContent<ManagementCounselor>>
export type GetCounselorsApiArg = {
  search?: string,
  sortDirection?: 'ASC' | 'DESC',
  sortBy?: string,
  page?: number,
  ratingFrom?: number,
  ratingTo?: number
}

export type GetCounselorApiResponse = ApiResponse<ManagementCounselor>


export type ManagementCounselor = {
  profile?: Counselor
  availableDateRange: AvailableDateRange;
  counselingSlot: CounselingSlot[];
}

type AvailableDateRange = {
  startDate: string;
  endDate: string;
};

export type CounselingSlot = {
  id: number;
  slotCode: string;
  startTime: string;
  endTime: string;
};

type UpdateCounselorStatusArg = {
  status: 'AVAILABLE' | 'UNAVAILABLE',
  counselorId: number,
}

type UpdateCounselorCounselingSlotArg = {
  slotId: number,
  counselorId: number,
}

type UpdateCounselorAvailableDateRange = {
  counselorId: number,
  startDate: string,
  endDate: string,
}


type GetCounselingSlotsResponse = ApiResponse<CounselingSlot[]>




