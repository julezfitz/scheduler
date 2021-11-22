import "components/Application.scss";
import DayList from "components/DayList.js";
import React, { useState } from "react";
import Appointment from "./Appointment/index.js";
import useApplicationData from "../hooks/useApplicationData.js";
import { getInterviewersForDay, getAppointmentsForDay, getInterviewer } from "../helpers/selectors";

export default function Application(props) {

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const interviewers = getInterviewersForDay(state, state.day);

  const appointments = getAppointmentsForDay(state, state.day).map(
    appointment => {
      const interviewer = getInterviewer(state, appointment.interview);
      return (
          <Appointment
            key={appointment.id}
            id={appointment.id}
            time={appointment.time}
            interview={interviewer}
            interviewers={interviewers}
            bookInterview={bookInterview}
            onDelete={cancelInterview}
          />
        )
      })

  appointments.push(<Appointment key="last" time="5pm" />);

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
        {appointments}
      </section>
    </main>
  );
}
