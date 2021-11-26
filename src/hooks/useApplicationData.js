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
        //get interview day
          const interviewDay = Math.floor((action.id - 1) / 5);
          const newState = { days: [], day: state.day, interviewers: { ...state.interviewers }, appointments: {} };
        
          //make deep copy of state.days
          for (const day in state.days) {
            newState.days[day] = { ...state.days[day] };
          }

          //make deep copy of appointments
          for (const [key, appt] of Object.entries(state.appointments)) {
            if (action.interview === null && action.id === parseInt(key)) {  
              // cancel appointment
              newState.appointments[key] = { ...appt, interview: null, interviewer: null };
            } else {
              newState.appointments[key] = { ...appt, interviewer: { ...appt.interviewer } };
            }
          }
          if (action.interview) {
            // add interview
            newState.appointments[action.id] = {
              id: action.id,
              time: (11 + (action.id - 1) % 5) % 12 + 1 + "pm",
              interview: action.interview,
            };
          
          }
          
          // if cancelling increase spots available by 1
          if (action.interview === null) {
            newState.days[interviewDay].spots = state.days[interviewDay].spots + 1;
          }
          // if the old state had no appointment in this slot, reduce the number of spots by 1
          else if (state.appointments[action.id].interview === null) {
            newState.days[interviewDay].spots = state.days[interviewDay].spots - 1;
          }
          
          return newState;
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:8001');

    webSocket.onmessage = function (event) {
      const action = JSON.parse(event.data);
      if (action.type) {
        dispatch(action);
      }
    };

    Promise.all([
      axios.get(`http://localhost:8001/api/days`),
      axios.get(`http://localhost:8001/api/appointments`),
      axios.get(`http://localhost:8001/api/interviewers`),
    ]).then((all) => {
      dispatch({ type: "SET_APPLICATION_DATA", days: all[0].data, appointments: all[1].data, interviewers: all[2].data })
    })
  }, []);

  const bookInterview = function (id, interview) {
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
  }

  const cancelInterview = function (id) {
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
  }

  return {
    state,
    setDay: (day) => dispatch({ type: "SET_DAY", day }),
    bookInterview: bookInterview,
    cancelInterview: cancelInterview,
  };
}