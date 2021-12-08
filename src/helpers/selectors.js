export const getAppointmentsForDay = function (state, day) {
  const dayObj = state.days.find((days) => days.name === day);
  const appointmentsArray = [];

  if (dayObj) {
    const dayIds = dayObj.appointments;

    for (const numAppoint of dayIds) {
      appointmentsArray.push(state.appointments[numAppoint]);
    }
  }
  return appointmentsArray;
};

export const getInterviewer = function (state, interview) {
  if (interview) {
    const interviewerId = interview.interviewer;
    const interviewerObj = state.interviewers[interviewerId];

    let newIntObj = {
      student: interview.student,
      interviewer: interviewerObj,
    };

    return newIntObj;
  }
  return null;
};

export const getInterviewersForDay = function (state, day) {
  const filteredInterviewers = state.days.filter((days) => days.name === day);
  const interviewersArray = [];

  if (filteredInterviewers[0]) {
    const interviewerIds = filteredInterviewers[0].interviewers;

    for (const numInterviewer of interviewerIds) {
      interviewersArray.push(state.interviewers[numInterviewer]);
    }
  }
  return interviewersArray;
};
