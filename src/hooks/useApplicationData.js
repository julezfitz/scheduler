import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData(props) {

  const [state, setState] = useState({
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
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, []);

  const setDay = day => setState(prev => ({ ...prev, day }));

  //helper function to update the number of spots in state
  const updateSpots = function (increment) {
    let dayId;

    if (state.day === "Monday") { dayId = 0; }
    if (state.day === "Tuesday") { dayId = 1; }
    if (state.day === "Wednesday") { dayId = 2; }
    if (state.day === "Thursday") { dayId = 3; }
    if (state.day === "Friday") { dayId = 4; }
    
    increment === "add" ? state.days[dayId].spots += 1 : state.days[dayId].spots -= 1;
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
      .then(updateSpots("delete"))
      .then(response => {
        setState(prev => ({ ...prev, appointments: appointmentsList }))
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
      .then(updateSpots("add"))
      .then(response => {
        setState(prev => ({ ...prev, appointments: appointmentsList }))
      })
  }

  let returnedStateVals = {
    state: state,
    setDay: setDay,
    bookInterview: bookInterview,
    cancelInterview: cancelInterview,
  }

  return returnedStateVals
}