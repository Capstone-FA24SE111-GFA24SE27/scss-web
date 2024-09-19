import { DatesSetArg } from '@fullcalendar/core/index.js';
import FullCalendar from '@fullcalendar/react';
import React, { MutableRefObject } from 'react';
import { motion } from 'framer-motion';
import { IconButton, Tooltip, Typography } from '@mui/material';
import CalendarViewMenu from './CalendarViewMenu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';

type Props = {
	calendarRef: MutableRefObject<FullCalendar | null>;
	currentDate: DatesSetArg;
};

const CalendarHeader = (props: Props) => {
	const { calendarRef, currentDate } = props;

	const calendarApi = calendarRef.current?.getApi();

	// const dispatch = useAppDispatch();

	const handleViewChange = (viewType: string) => {
		if (calendarApi) calendarApi.changeView(viewType);
	};

	return (
		<div className='container z-10 flex flex-col justify-between w-full py-8 md:flex-row'>
			<div className='flex items-center justify-between'>
				

				<div className='flex items-center'>
					<Tooltip title='Previous'>
						<IconButton
							aria-label='Previous'
							onClick={() => {
								if (calendarApi) {
									calendarApi.prev();
								}
							}}
						>
							{/* // icon here */}
							<ChevronLeftIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title='Next'>
						<IconButton
							aria-label='Next'
							onClick={() => {
								if (calendarApi) {
									calendarApi.next();
								}
							}}
						>
							{/* // icon here */}
							<ChevronRightIcon />
						</IconButton>
					</Tooltip>

					<Tooltip title='Today'>
						<div>
							<motion.div
								initial={{ scale: 0 }}
								animate={{
									scale: 1,
									transition: { delay: 0.3 },
								}}
							>
								<IconButton
									aria-label='today'
									onClick={() => {
										if (calendarApi) {
											calendarApi.today();
										}
									}}
									size='large'
								>
									{/* // icon here */}
									<TodayIcon />
								</IconButton>
							</motion.div>
						</div>
					</Tooltip>

				</div>

				<div className='flex items-center'>
					<Typography className='hidden mx-16 text-2xl font-semibold tracking-tight sm:flex whitespace-nowrap'>
						{currentDate?.view.title}
					</Typography>
				</div>
			</div>

			<motion.div
				className='flex items-center justify-end md:justify-center'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.3 } }}
			>
				<CalendarViewMenu
					currentDate={currentDate}
					onChange={handleViewChange}
				/>
			</motion.div>
		</div>
	);
};

export default CalendarHeader;
