
export const getAppointmentsForDay = function (state, day) {
  const filteredAppointments = state.days.filter(days => days.name === day);
  const appointmentsArray = [];

  if (filteredAppointments[0]) {
    const dayIds = filteredAppointments[0].appointments

    for (const numAppoint of dayIds) {
      appointmentsArray.push(state.appointments[numAppoint]);
    }
  }
  return appointmentsArray;
}