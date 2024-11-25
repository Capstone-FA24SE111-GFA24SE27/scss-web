import {
  Appointment,
  AppointmentFeedback,
  AppointmentReportType,
  AppointmentRequest,
  SupportStaff,
  PaginationContent,
  Profile,
  Student,
  Counselor,
  CounselingDemand,
} from '@/shared/types';
import { ApiResponse, apiService as api } from '@shared/store';

export const addTagTypes = [
  'supportStaffs',
] as const;

export const supportStaffsMangementApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getSupportStaffsManagement: build.query<SupportStaffsManagementApiResponse, SupportStaffsManagementApiArg>({
        query: ({ page = 1, size = 10, search = '', sortBy = 'id', sortDirection = 'ASC' }) => ({
          url: `/api/support-staff/filter`,
          params: {
            page,
            search,
            size,
            sortBy,
            sortDirection,
          },
        }),
        providesTags: ['supportStaffs'],
      }),
      getSupportStaffManagement: build.query<GetSupportStaffManagementApiResponse, GetSupportStaffManagementApiArg>({
        query: (id) => ({
          url: `/api/support-staff/${id}`,
        }),
        providesTags: (result, error, id) => [{ type: 'supportStaffs', id }],
      }),
      getSupportStaffFollowing: build.query<GetSupportStaffFollowingApiResponse, GetSupportStaffFollowingApiArg>({
        query: ({ staffId, page = 1, size = 10 }) => ({
          url: `/api/support-staff/following/${staffId}`,
          params: {
            page,
            size,
          }
        }),
        providesTags: (result, error, { staffId }) => [{ type: 'supportStaffs', id: staffId }],
      }),
      geSupportStafftCounselingDemandFilter: build.query<GetSuppportStaffCounselingDemandFilterApiResponse, GetSupportStaffCounselingDemandFilterApiArg>({
        query: ({ staffId, status = '', sortBy = '', sortDirection = 'DESC', page = 1, keyword = '' }) => ({
          url: `/api/support-staff/counseling-demand/filter/${staffId}`,
          params: {
            status,
            sortBy,
            sortDirection,
            page,
            keyword,
          },
        }),
        providesTags: ['supportStaffs'],
      }),
    }),
  });

export const {
  useGetSupportStaffsManagementQuery,
  useGetSupportStaffManagementQuery,
  useGetSupportStaffFollowingQuery,
  useGeSupportStafftCounselingDemandFilterQuery,
} = supportStaffsMangementApi;

export type SupportStaffsManagementApiResponse = ApiResponse<PaginationContent<SupportStaff>>

export type SupportStaffsManagementApiArg = {
  page?: number;
  search?: string;
  sortBy?: string,
  sortDirection?: string,
  size?: number,
};

export type GetSupportStaffManagementApiResponse = ApiResponse<SupportStaff>;
export type GetSupportStaffManagementApiArg = string;


export type GetSupportStaffFollowingApiResponse = ApiResponse<PaginationContent<FollowingStudent>>;
export type GetSupportStaffFollowingApiArg = {
  staffId: string;
  page?: number;
  size?: number;
};

export type FollowingStudent = {
  student: Student;
  followNote: string;
  followDate: string;
}

export type GetSuppportStaffCounselingDemandFilterApiResponse = ApiResponse<PaginationContent<CounselingDemand>>;
export type GetSupportStaffCounselingDemandFilterApiArg = {
  staffId: number;
  status?: string;
  sortBy?: string;
  sortDirection?: string;
  page?: number;
  keyword?: string;
};