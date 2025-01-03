import dayjs from "dayjs";
import { Appointment } from "../types";

export const groupAppointmentsByDate = (appointments: Appointment[] = []) => {
  const today = dayjs();
  const tomorrow = dayjs().add(1, 'day');

  // Sort appointments by startDateTime
  const sortedAppointments = [...(appointments)].sort((a, b) =>
    dayjs(a.startDateTime).diff(dayjs(b.startDateTime))
  );

  // Group sorted appointments by date
  return sortedAppointments.reduce((groups, appointment) => {
    const startDate = dayjs(appointment.startDateTime);
    let dateLabel;

    if (startDate.isSame(today, 'day')) {
      dateLabel = 'Today';
    } else if (startDate.isSame(tomorrow, 'day')) {
      dateLabel = 'Tomorrow';
    } else {
      dateLabel = startDate.format('YYYY/MM/DD');
    }

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(appointment);
    return groups;
  }, {});
};

export const splitUserAndReason = (text: string) => {
  // Split the string by the colon and space
  const parts = text.split(': ');

  // Trim any extra whitespace just in case
  const user = parts[0]?.trim() || '';
  const reason = parts[1]?.trim() || '';

  // Return an object with the split parts
  return { user, reason };
}
