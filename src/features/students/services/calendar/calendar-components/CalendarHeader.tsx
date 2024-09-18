import { DatesSetArg } from '@fullcalendar/core/index.js';
import FullCalendar from '@fullcalendar/react';
import React, { MutableRefObject } from 'react'
import { motion } from 'framer-motion';
import { IconButton, Tooltip, Typography } from '@mui/material';
import CalendarViewMenu from './CalendarViewMenu';

type Props = {
    calendarRef: MutableRefObject<FullCalendar | null>;
	currentDate: DatesSetArg;
	onToggleLeftSidebar: () => void;
}

const CalendarHeader = (props: Props) => {
	const { calendarRef, currentDate} = props;

    // const mainTheme = useSelector(selectMainTheme);
	// const calendarApi = () => calendarRef.current.getApi();
	// const dispatch = useAppDispatch();

    // const handleViewChange = (viewType: string) => {
	// 	calendarApi().changeView(viewType);
	// }

  return (
    <div className="container z-10 flex flex-col justify-between w-full py-8 md:flex-row">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					
					<Typography className="hidden mx-16 text-2xl font-semibold tracking-tight sm:flex whitespace-nowrap">
						{currentDate?.view.title}
					</Typography>
				</div>

				<div className="flex items-center">
					<Tooltip title="Previous">
						<IconButton
							aria-label="Previous"
							// onClick={() => calendarApi().prev()}
						>
							{/* // icon here */}
							
						</IconButton>
					</Tooltip>
					<Tooltip title="Next">
						<IconButton
							aria-label="Next"
							// onClick={() => calendarApi().next()}
						>
							{/* // icon here */}
						</IconButton>
					</Tooltip>

					<Tooltip title="Today">
						<div>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1, transition: { delay: 0.3 } }}
							>
								<IconButton
									aria-label="today"
									// onClick={() => calendarApi().today()}
									size="large"
								>
							{/* // icon here */}
									
								</IconButton>
							</motion.div>
						</div>
					</Tooltip>
				</div>
			</div>

			<motion.div
				className="flex items-center justify-end md:justify-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.3 } }}
			>
				<IconButton
					className="mx-8"
					aria-label="add"
					// onClick={(ev) =>
						// dispatch(
						// 	openNewEventDialog({
						// 		jsEvent: ev.nativeEvent,
						// 		start: new Date(),
						// 		end: new Date()
						// 	})
						// )
					// }
				>
							{/* // icon here */}
					
				</IconButton>

				<CalendarViewMenu
					currentDate={currentDate}
					// onChange={handleViewChange}
				/>
			</motion.div>
		</div>
  )
}

export default CalendarHeader