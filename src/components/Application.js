import "components/Application.scss";
import DayList from "components/DayList.js";
import React, { useState, useEffect } from "react";
import Appointment from "./Appointment/index.js";
import axios from "axios";
import { getAppointmentsForDay, getInterviewer } from "../helpers/selectors";

export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  let dailyAppointments = [];

  const setDay = day => setState({ ...state, day });

  // const setDays = (days) => setState(prev => ({ ...prev, days }));

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8001/api/days`),
      axios.get(`http://localhost:8001/api/appointments`),
      axios.get(`http://localhost:8001/api/interviewers`),
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    })
  }, []);

  //format appointments
  dailyAppointments = getAppointmentsForDay(state, state.day);

  const appointmentsDisplay = dailyAppointments.map(appointment => {
    const interviewer = getInterviewer(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interviewer}
      />
    )
  })

  appointmentsDisplay.push(<Appointment key="last" time="5pm" />);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentsDisplay}
      </section>
    </main>
  );
}
