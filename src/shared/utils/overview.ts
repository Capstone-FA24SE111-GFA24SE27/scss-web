import dayjs from "dayjs";
import { Appointment, CounselingDemand, Question } from "../types";
import { lastDayOfMonth } from "../constants";

type GroupedAppointments = Record<string, Partial<Appointment>[]>;
type GroupedQuestions = Record<string, Partial<Question>[]>;
type GroupedDemands = Record<string, Partial<CounselingDemand>[]>;

type GroupedAppointmentsByCounselingType = {
  ACADEMIC: Partial<Appointment>[];
  NON_ACADEMIC: Partial<Appointment>[];
}
type GroupedQuestionsByCounselingType = {
  ACADEMIC: Partial<Appointment>[];
  NON_ACADEMIC: Partial<Appointment>[];
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




export function groupAppointmentsByDays(data: Partial<Appointment>[] = [], period: `month` | `week` | `day` = `month`): GroupedAppointments {
  const grouped: GroupedAppointments = {};

  let startDate = dayjs();
  let endDate = dayjs();

  // Adjust startDate and endDate based on the period
  if (period === 'month') {
    startDate = dayjs().startOf('month');
    endDate = dayjs().endOf('month');
  } else if (period === 'week') {
    startDate = dayjs().subtract(6, 'day');
    endDate = dayjs();
  } else if (period === 'day') {
    startDate = dayjs().startOf('day');
    endDate = dayjs().endOf('day');
  }

  // Initialize keys for the date range
  let currentDate = startDate;
  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    const formattedDate = currentDate.format('MM/DD'); // Format as MM/DD
    grouped[formattedDate] = []; // Initialize the date group as an empty array

    currentDate = currentDate.add(1, 'day'); // Move to the next day
  }

  data?.forEach(appointment => {
    const date = dayjs(appointment.startDateTime ?? '');

    // Check if the appointment falls within the specified date range
    if ((date.isSame(startDate, 'day') || date.isAfter(startDate, 'day')) &&
      (date.isSame(endDate, 'day') || date.isBefore(endDate, 'day'))) {
      const formattedDate = date.format('MM/DD'); // Format as MM/DD

      // Ensure the key is initialized (safety check)
      if (!grouped[formattedDate]) {
        grouped[formattedDate] = [];
      }

      // Add the appointment to the respective date group
      grouped[formattedDate].push(appointment);
    }
  });

  return grouped;
}



export function groupQuestionsByMonth(data: Partial<Question>[] = []): GroupedQuestions {
  return data?.reduce((grouped: GroupedQuestions, appointment) => {
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

export function groupQuestionsByWeek(data: Partial<Question>[] = []): GroupedQuestions {
  const grouped: GroupedQuestions = {};
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

export function groupQuestionsByDay(data: Partial<Question>[] = []): GroupedQuestions {
  const today = dayjs();
  const appointments = data.filter(item => today.isSame(item.createdDate, 'day'))
  const result = {}
  result[today.format("YYYY-MM-DD")] = appointments
  return result
}

export function groupQuestionsByCounselingType(appointments: Partial<Question>[] = []): GroupedQuestionsByCounselingType {
  const grouped: GroupedQuestionsByCounselingType = {
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

export const groupFeedbacksByRating = (data = []) => {
  const ratingsCount = [0, 0, 0, 0, 0];
  data.forEach((item) => {
    const rating = item.appointmentFeedback ? item.appointmentFeedback?.rating : item.feedback?.rating || 0;
    if (rating >= 1 && rating <= 5) {
      ratingsCount[rating - 1] += 1;
    }
  });
  return ratingsCount
};

export const calculateAverageRating = (data = []) => {
  const totalFeedbacks = data?.reduce((a, b) => a + b, 0);
  const averageRating = data
    .reduce((sum, count, index) => sum + count * (index + 1), 0) / totalFeedbacks

  return averageRating?.toFixed(2)
};


export function groupQuestionsByDays(data: Partial<Question>[] = [], period: `month` | `week` | `day` = `month`): GroupedQuestions {
  const grouped: GroupedQuestions = {};

  let startDate = dayjs();
  let endDate = dayjs();

  // Adjust startDate and endDate based on the period
  if (period === 'month') {
    startDate = dayjs().startOf('month');
    endDate = dayjs().endOf('month');
  } else if (period === 'week') {
    startDate = dayjs().subtract(6, 'day');
    endDate = dayjs();
  } else if (period === 'day') {
    startDate = dayjs().startOf('day');
    endDate = dayjs().endOf('day');
  }

  // Initialize keys for the date range
  let currentDate = startDate;
  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    const formattedDate = currentDate.format('MM/DD'); // Format as MM/DD
    grouped[formattedDate] = []; // Initialize the date group as an empty array

    currentDate = currentDate.add(1, 'day'); // Move to the next day
  }

  data?.forEach(question => {
    const date = dayjs(question.createdDate ?? '');
    // Check if the question falls within the specified date range
    if ((date.isSame(startDate, 'day') || date.isAfter(startDate, 'day')) && (date.isSame(endDate, 'day') || date.isBefore(endDate, 'day'))) {
      const formattedDate = date.format('MM/DD'); // Format as MM/DD

      // Ensure the key is initialized (safety check)
      if (!grouped[formattedDate]) {
        grouped[formattedDate] = [];
      }

      // Add the question to the respective date group
      grouped[formattedDate].push(question);
    }
  });
  return grouped;
}

export function groupDemandsByDays(data: Partial<CounselingDemand>[] = [], period: `month` | `week` | `day` = `month`): GroupedDemands {
  const grouped: GroupedDemands = {};

  let startDate = dayjs();
  let endDate = dayjs();

  // Adjust startDate and endDate based on the period
  if (period === 'month') {
    startDate = dayjs().startOf('month');
    endDate = dayjs().endOf('month');
  } else if (period === 'week') {
    startDate = dayjs().subtract(6, 'day');
    endDate = dayjs();
  } else if (period === 'day') {
    startDate = dayjs().startOf('day');
    endDate = dayjs().endOf('day');
  }

  // Initialize keys for the date range
  let currentDate = startDate;
  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    const formattedDate = currentDate.format('MM/DD'); // Format as MM/DD
    grouped[formattedDate] = []; // Initialize the date group as an empty array

    currentDate = currentDate.add(1, 'day'); // Move to the next day
  }

  data?.forEach(appointment => {
    const date = dayjs(appointment.startDateTime ?? '');

    // Check if the appointment falls within the specified date range
    if ((date.isSame(startDate, 'day') || date.isAfter(startDate, 'day')) &&
      (date.isSame(endDate, 'day') || date.isBefore(endDate, 'day'))) {
      const formattedDate = date.format('MM/DD'); // Format as MM/DD

      // Ensure the key is initialized (safety check)
      if (!grouped[formattedDate]) {
        grouped[formattedDate] = [];
      }

      // Add the appointment to the respective date group
      grouped[formattedDate].push(appointment);
    }
  });

  return grouped;
}