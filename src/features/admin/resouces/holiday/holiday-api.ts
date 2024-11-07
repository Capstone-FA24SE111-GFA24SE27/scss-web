import {
	HolidayScheduleType,
	PaginationContent,
} from '@/shared/types';
import { apiService, ApiResponse } from '@shared/store';

const addTagTypes = ['holiday', 'holidays'] as const;

export const HolidaysApi = apiService
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getHolidays: build.query<getHolidaysResponse, getHolidaysArgs>({
				query: () => ({
					url: `/api/holidays`,
				}),
				providesTags: ['holidays'],
			}),
			getHoliday: build.query<getHolidayResponse, getHolidayArgs>({
				query: (arg) => ({
					url: `/api/holidays/${arg}`,
				}),
				providesTags: (result, error, arg) => [
					{ type: 'holiday', id: arg },
				],
			}),
			postHoliday: build.mutation<postHolidayResponse, postHolidayArgs>({
				query: (args) => ({
					url: `/api/holidays`,
					method: 'POST',
					body: {
						args
					},
				}),
				invalidatesTags: ['holidays'],
			}),

			updateHoliday: build.mutation<
				updateHolidayResponse,
				updateHolidayArgs
			>({
				query: (args) => ({
					url: `/api/holidays/${args.id}`,
					method: 'PUT',
					body: {
						startDate: args.startDate,
						endDate: args.endDate,
						description: args.description,
						name: args.name,
					},
				}),
				invalidatesTags: (result, error, args) =>  ['holidays', {type: 'holiday', id: args.id}],
			}),

			deleteHoliday: build.mutation<
				deleteHolidayResponse,
				deleteHolidayArgs
			>({
				query: (args) => ({
					url: `/api/holidays/${args}`,
					method: 'DELETE',
				}),
				invalidatesTags: (result, error, args) => [
					'holidays',
					{ type: 'holiday', id: args },
				],
			}),
		}),
	});

export const {
	useDeleteHolidayMutation,
	useGetHolidayQuery,
	useGetHolidaysQuery,
	usePostHolidayMutation,
	useUpdateHolidayMutation,
} = HolidaysApi;

type getHolidaysArgs = {}

type getHolidaysResponse = ApiResponse<HolidayScheduleType[]>;

type getHolidayArgs = string;

type getHolidayResponse = ApiResponse<HolidayScheduleType>;

type postHolidayArgs = {
	startDate: string;
	endDate: string;
	description: string;
	name: string;
};

type postHolidayResponse = ApiResponse<HolidayScheduleType>;

type updateHolidayArgs = {
	id: string;
	startDate: string;
	endDate: string;
	description: string;
	name: string;
};
type updateHolidayResponse = ApiResponse<HolidayScheduleType>;

type deleteHolidayArgs = string;
type deleteHolidayResponse = {};
