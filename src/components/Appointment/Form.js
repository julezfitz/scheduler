import React, { useState } from "react";
import "./styles.scss";
import Button from "../Button.js"
import InterviewerList from "../InterviewerList.js"



export default function Form(props) {

  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

  const reset = function() {
    setStudent("")
    setInterviewer(null)
    return;
  }

  const cancel = function() {
    reset();
    props.onCancel();
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form onSubmit={event => event.preventDefault()} autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            type="text"
            name="name"
            value={student}
            placeholder="Enter Student Name"
            onChange={(event) => setStudent(event.target.value)}
          />
        </form>
        <InterviewerList className="appointment__card-left" interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
      </section>

      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button className="appointment__card-right" confirm onClick={() => {props.onSave(student, interviewer)}}>Save</Button>
          <Button className="appointment__card-right" danger onClick={cancel}>Cancel</Button>
        </section>
      </section>
    </main>
  )
}