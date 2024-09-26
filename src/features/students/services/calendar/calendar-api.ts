import { Dictionary } from "@fullcalendar/core/internal";




export type Event = {
	id: string;
	title: string;
	allDay: boolean;
	start: string;
	end: string;
	extendedProps?: Dictionary;
};