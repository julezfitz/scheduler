import "./styles.scss";
import Header from "./Header.js";
import Show from "./Show.js";
import Empty from "./Empty.js";
import Status from "./Status.js";
import Form from "./Form.js";
import React, { Fragment } from 'react'
import { useVisualMode } from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";

export default function Appointment(props) {

  const save = function (name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview).then(() => { transition(SHOW) })
  }

  const deleteItem = function () {
    transition(DELETING);
    props.onDelete(props.id).then(() => { transition(EMPTY) })
  }

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY)

  console.log(props.interview);

  return (
    <article className="appointment">
      <Header time={props.time} />
      { mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === DELETING && <Status message={"Deleting"} />}
      { mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          interviewers={props.interviewers}
          onDelete={deleteItem}
        />
      )
      }
      { mode === CREATE && (<Form
        student={props.student}
        interviewers={props.interviewers}
        interview={props.interview}
        onSave={save}
        onCancel={() => back()}
      />
      )
      }
    </article>
  )
}
