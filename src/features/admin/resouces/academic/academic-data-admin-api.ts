import { Semester } from '@/shared/services';
import { Department, Major, Specialization } from '@/shared/types';
import { apiService, ApiResponse, ApiMessage } from '@shared/store';

const addTagTypes = [
	'departments',
	'majors',
	'specializations',
	'semesters',
] as const;

export const academicDataAdminApi = apiService
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getSemesterAdmin: build.query<Semester[], void>({
				query: (id) => ({
					url: `/api/academic/semester`,
				}),
				providesTags: ['semesters'],
			}),
			getDepartmentById: build.query<
				GetDepartmentByIdResponse,
				GetAcademicDataByIdArgs
			>({
				query: (id) => ({
					url: `/api/academic/departments/${id}`,
				}),
				providesTags: ['departments'],
			}),
			getMajorById: build.query<
				GetMajorByIdResponse,
				GetAcademicDataByIdArgs
			>({
				query: (id) => ({
					url: `/api/academic/majors/${id}`,
				}),
				providesTags: ['majors'],
			}),
			getSpecializationById: build.query<
				GetSpecializationByIdResponse,
				GetAcademicDataByIdArgs
			>({
				query: (id) => ({
					url: `/api/academic/sepecialization/${id}`,
				}),
				providesTags: ['specializations'],
			}),
			getDepartmentsAdmin: build.query<Department[], void>({
				query: () => ({
					url: `/api/academic/departments`,
				}),
				providesTags: ['departments'],
			}),
			getMajorsAdmin: build.query<Major[], void>({
				query: () => ({
					url: `/api/academic/majors`,
				}),
				providesTags: ['majors'],
			}),
			getSpecializationsAdmin: build.query<Specialization[], void>({
				query: () => ({
					url: `/api/academic/specializations`,
				}),
				providesTags: ['specializations'],
			}),
			putUpdateDepartmentByIdAdmin: build.mutation<
				PutUpdateDepartmentByIdAdminResponse,
				PutUpdateDepartmentByIdAdminArgs
			>({
				query: ({ id, name, code }) => ({
					url: `/api/academic/departments/${id}`,
					method: 'PUT',
					body: { name, code },
				}),
				invalidatesTags: ['departments'],
			}),
			putUpdateMajorByIdAdmin: build.mutation<
				PutUpdateMajorByIdAdminResponse,
				PutUpdateMajorByIdAdminArgs
			>({
				query: ({ id, name, code, departmentId }) => ({
					url: `/api/academic/majors/${id}`,
					method: 'PUT',
					body: { name, code, departmentId },
				}),
				invalidatesTags: ['majors'],
			}),
			putUpdateSpecializationByIdAdmin: build.mutation<
				PutUpdateSpecializationByIdAdminResponse,
				PutUpdateSpecializationByIdAdminArgs
			>({
				query: ({ id, name, code, departmentId, majorId }) => ({
					url: `/api/academic/specializations/${id}`,
					method: 'PUT',
					body: { name, code, departmentId, majorId },
				}),
				invalidatesTags: ['specializations'],
			}),
			deleteDepartmentByIdAdmin: build.mutation<
				PutUpdateDepartmentByIdAdminResponse,
				string | number
			>({
				query: (id) => ({
					url: `/api/academic/departments/${id}`,
					method: 'DELETE',
				}),
				invalidatesTags: ['departments'],
			}),
			deleteMajorByIdAdmin: build.mutation<
				PutUpdateMajorByIdAdminResponse,
				string | number
			>({
				query: (id) => ({
					url: `/api/academic/majors/${id}`,
					method: 'DELETE',
				}),
				invalidatesTags: ['majors'],
			}),
			deleteSpecializationByIdAdmin: build.mutation<
				PutUpdateSpecializationByIdAdminResponse,
				string | number
			>({
				query: (id) => ({
					url: `/api/academic/specializations/${id}`,
					method: 'DELETE',
				}),
				invalidatesTags: ['specializations'],
			}),
			postCreateDepartmentByIdAdmin: build.mutation<
				postCreateDepartmentByIdAdminResponse,
				postCreateDepartmentByIdAdminArgs
			>({
				query: ({ name, code }) => ({
					url: `/api/academic/departments`,
					method: 'POST',
					body: { name, code },
				}),
				invalidatesTags: ['departments'],
			}),
			postCreateMajorByIdAdmin: build.mutation<
				postCreateMajorByIdAdminResponse,
				postCreateMajorByIdAdminArgs
			>({
				query: ({ name, code, departmentId }) => ({
					url: `/api/academic/majors`,
					method: 'POST',
					body: { name, code, departmentId },
				}),
				invalidatesTags: ['majors'],
			}),
			postCreateSpecializationByIdAdmin: build.mutation<
				postCreateSpecializationByIdAdminResponse,
				postCreateSpecializationByIdAdminArgs
			>({
				query: ({ name, code, departmentId, majorId }) => ({
					url: `/api/academic/specializations`,
					method: 'POST',
					body: { name, code, departmentId, majorId },
				}),
				invalidatesTags: ['specializations'],
			}),
		}),
	});

export const {
	useGetSemesterAdminQuery,
	useGetDepartmentsAdminQuery,
	useGetMajorsAdminQuery,
	useGetSpecializationsAdminQuery,
	useDeleteDepartmentByIdAdminMutation,
	useDeleteMajorByIdAdminMutation,
	useDeleteSpecializationByIdAdminMutation,
	useGetDepartmentByIdQuery,
	useGetMajorByIdQuery,
	useGetSpecializationByIdQuery,
	usePostCreateDepartmentByIdAdminMutation,
	usePostCreateMajorByIdAdminMutation,
	usePostCreateSpecializationByIdAdminMutation,
	usePutUpdateDepartmentByIdAdminMutation,
	usePutUpdateMajorByIdAdminMutation,
	usePutUpdateSpecializationByIdAdminMutation,
} = academicDataAdminApi;

type GetDepartmentByIdResponse = Department;
type GetMajorByIdResponse = Major;
type GetSpecializationByIdResponse = Specialization;
type GetAcademicDataByIdArgs = string | number;

type PutUpdateDepartmentByIdAdminResponse = ApiMessage;
type PutUpdateMajorByIdAdminResponse = ApiMessage;
type PutUpdateSpecializationByIdAdminResponse = ApiMessage;
type PutUpdateDepartmentByIdAdminArgs = {
	id: string | number;
	name: string;
	code: string;
};
type PutUpdateMajorByIdAdminArgs = {
	id: string | number;
	name: string;
	code: string;
	departmentId: string | number;
};
type PutUpdateSpecializationByIdAdminArgs = {
	id: string | number;
	name: string;
	code: string;
	departmentId: string | number;
	majorId: string | number;
};

type postCreateDepartmentByIdAdminResponse = Department;
type postCreateMajorByIdAdminResponse = Major;
type postCreateSpecializationByIdAdminResponse = Specialization;
type postCreateDepartmentByIdAdminArgs = {
	name: string;
	code: string;
};
type postCreateMajorByIdAdminArgs = {
	name: string;
	code: string;
	departmentId: string | number;
};
type postCreateSpecializationByIdAdminArgs = {
	name: string;
	code: string;
	departmentId: string | number;
	majorId: string | number;
};
