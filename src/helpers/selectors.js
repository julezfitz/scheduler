
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

export const getInterviewer = function (state, interview) {
  if(interview) {
  const interviewerId = interview.interviewer;
  const interviewerObj = state.interviewers[interviewerId];

  let newIntObj = {
    "student": interview.student,
    "interviewer": interviewerObj
  }

  console.log(newIntObj);
  return newIntObj
  }
  return null;

}