import dayjs from "dayjs";
import { Appointment, Question } from "../types";

type GroupedAppointments = Record<string, Partial<Appointment>[]>;

type GroupedAppointmentsByCounselingType = {
  ACADEMIC: Partial<Appointment>[];
  NON_ACADEMIC: Partial<Appointment>[];
}

type GroupedQuestion = Record<string, Partial<Question>[]>;

type GroupedQuestionByCounselingType = {
  ACADEMIC: Partial<Question>[];
  NON_ACADEMIC: Partial<Question>[];
}

export function getLastGroupedItem(grouped: Record<string, unknown>) {
  const keys = Object.keys(grouped);

  if (keys.length === 0) {
    return undefined;
  }

  const lastKey = keys[keys.length - 1];
  return grouped[lastKey];
}

export function groupAppointmentsByMonth(data: Partial<Appointment>[] = []): GroupedAppointments {
  return data?.reduce((grouped: GroupedAppointments, appointment) => {
    // Parse the startDateTime to get the month and year
    const date = new Date(appointment.startDateTime ?? '');
    const monthYearKey = `${date.toLocaleString('en-US', { month: 'long' })} ${date.getFullYear()}`;

    // Initialize the month-year group if not already present
    if (!grouped[monthYearKey]) {
      grouped[monthYearKey] = [];
    }

    // Add the appointment to the respective month-year group
    grouped[monthYearKey].push(appointment);

    return grouped;
  }, {});
}

export function groupAppointmentsByWeek(data: Partial<Appointment>[] = []): GroupedAppointments {
  const grouped: GroupedAppointments = {};
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  // Initialize keys for all last 7 days
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(oneWeekAgo);
    currentDate.setDate(oneWeekAgo.getDate() + i);
    const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'long' }); // Get the day of the week
    const formattedDate = currentDate.toLocaleString('en-US', { month: '2-digit', day: '2-digit' }); // Format as MM/DD
    const key = `${formattedDate}`;

    // Initialize the day-of-week group
    grouped[key] = [];
  }

  data?.forEach(appointment => {
    const date = new Date(appointment.startDateTime ?? '');

    // Check if the appointment falls within the last 7 days
    if (date >= oneWeekAgo && date <= today) {
      const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }); // Get the day of the week
      const formattedDate = date.toLocaleString('en-US', { month: '2-digit', day: '2-digit' }); // Format as MM/DD
      const key = `${formattedDate}`;

      // Ensure the key is initialized (safety check)
      if (!grouped[key]) {
        grouped[key] = [];
      }

      // Add the appointment to the respective day-of-week group
      grouped[key].push(appointment);
    }
  });

  return grouped;
}

export function groupAppointmentsByDay(data: Partial<Appointment>[] = []): GroupedAppointments {
  const today = dayjs();
  const appointments = data.filter(item => today.isSame(item.startDateTime, 'day'))
  const result = {}
  result[today.format("YYYY-MM-DD")] = appointments
  return result
}

export function groupAppointmentsByCounselingType(appointments: Partial<Appointment>[] = []): GroupedAppointmentsByCounselingType {
  const grouped: GroupedAppointmentsByCounselingType = {
    ACADEMIC: [],
    NON_ACADEMIC: []
  };

  appointments?.forEach(appointment => {
    if (appointment.counselorInfo?.academicDegree) {
      grouped.ACADEMIC.push(appointment);
    } else {
      grouped.NON_ACADEMIC.push(appointment);
    }
  });

  return grouped;
}



export function groupQuestionsByMonth(data: Partial<Question>[] = []): GroupedAppointments {
  return data?.reduce((grouped: GroupedAppointments, appointment) => {
    // Parse the startDateTime to get the month and year
    const date = new Date(appointment.createdDate ?? '');
    const monthYearKey = `${date.toLocaleString('en-US', { month: 'long' })} ${date.getFullYear()}`;

    // Initialize the month-year group if not already present
    if (!grouped[monthYearKey]) {
      grouped[monthYearKey] = [];
    }

    // Add the appointment to the respective month-year group
    grouped[monthYearKey].push(appointment);

    return grouped;
  }, {});
}

export function groupQuestionsByWeek(data: Partial<Question>[] = []): GroupedAppointments {
  const grouped: GroupedAppointments = {};
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  // Initialize keys for all last 7 days
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(oneWeekAgo);
    currentDate.setDate(oneWeekAgo.getDate() + i);
    const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'long' }); // Get the day of the week
    const formattedDate = currentDate.toLocaleString('en-US', { month: '2-digit', day: '2-digit' }); // Format as MM/DD
    const key = `${formattedDate}`;

    // Initialize the day-of-week group
    grouped[key] = [];
  }

  data?.forEach(appointment => {
    const date = new Date(appointment.createdDate ?? '');

    // Check if the appointment falls within the last 7 days
    if (date >= oneWeekAgo && date <= today) {
      const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }); // Get the day of the week
      const formattedDate = date.toLocaleString('en-US', { month: '2-digit', day: '2-digit' }); // Format as MM/DD
      const key = `${formattedDate}`;

      // Ensure the key is initialized (safety check)
      if (!grouped[key]) {
        grouped[key] = [];
      }

      // Add the appointment to the respective day-of-week group
      grouped[key].push(appointment);
    }
  });

  return grouped;
}

export function groupQuestionsByDay(data: Partial<Question>[] = []): GroupedAppointments {
  const today = dayjs();
  const appointments = data.filter(item => today.isSame(item.createdDate, 'day'))
  const result = {}
  result[today.format("YYYY-MM-DD")] = appointments
  return result
}

export function groupQuestionsByCounselingType(appointments: Partial<Question>[] = []): GroupedAppointmentsByCounselingType {
  const grouped: GroupedAppointmentsByCounselingType = {
    ACADEMIC: [],
    NON_ACADEMIC: []
  };

  appointments?.forEach(appointment => {
    if (appointment.questionType === "ACADEMIC") {
      grouped.ACADEMIC.push(appointment);
    } else {
      grouped.NON_ACADEMIC.push(appointment);
    }
  });

  return grouped;
}


