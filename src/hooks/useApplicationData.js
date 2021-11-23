import React, { useReducer, useEffect } from "react";
import axios from "axios";

export default function useApplicationData(props) {

  const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      }
    case SET_INTERVIEW: {
      if (action.interviewAction === "book") {
        const newState = { days: [], day: state.day, interviewers: {...state.interviewers}, appointments: action.appointmentsList };
        for (const day in state.days) {
          newState.days[day] = {...state.days[day]};
        }
        newState.days[action.dayId].spots = state.days[action.dayId].spots - 1;
        console.log(newState);
        return newState
      }
      else if (action.interviewAction === "cancel") {
        const newState = { days: [], day: state.day, interviewers: {...state.interviewers}, appointments: action.appointmentsList };
        for (const day in state.days) {
          newState.days[day] = {...state.days[day]};
        }
        newState.days[action.dayId].spots = state.days[action.dayId].spots + 1;
        return newState
      }
      return state
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}
  //how do I still default state like this?
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8001/api/days`),
      axios.get(`http://localhost:8001/api/appointments`),
      axios.get(`http://localhost:8001/api/interviewers`),
    ]).then((all) => {
      dispatch({ type: "SET_APPLICATION_DATA", days: all[0].data, appointments: all[1].data, interviewers: all[2].data })
    })
  }, []);

  //helper function to return the day ID to update the number of spots
  const updateSpots = function () {
    let dayId;
    if (state.day === "Monday") { dayId = 0; }
    if (state.day === "Tuesday") { dayId = 1; }
    if (state.day === "Wednesday") { dayId = 2; }
    if (state.day === "Thursday") { dayId = 3; }
    if (state.day === "Friday") { dayId = 4; }
    return dayId;
  }

  const bookInterview = function (id, interview) {
    //update existing appointment slot
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointmentsList = state.appointments;
    appointmentsList[id] = appointment;

    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => updateSpots())
      .then(response => {
        dispatch({ type: "SET_INTERVIEW", interviewAction: "book", dayId: response, appointmentsList: appointmentsList })
      })
  }

  const cancelInterview = function (id) {
    // find the right appointment slot and set it's interview data to null.
    const setInterviewNull = {
      ...state.appointments[id],
      interview: null
    };

    const appointmentsList = state.appointments;
    appointmentsList[id] = setInterviewNull;

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => updateSpots())
      .then(response => {
        dispatch({ type: "SET_INTERVIEW", interviewAction: "cancel", dayId: response, appointmentsList: appointmentsList })
      })
  }

  let returnedStateVals = {
    state: state,
    setDay: (day) => dispatch({ type: "SET_DAY", day }),
    bookInterview: bookInterview,
    cancelInterview: cancelInterview,
  }

  return returnedStateVals
}