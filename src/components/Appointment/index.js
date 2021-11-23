import "./styles.scss";
import Header from "./Header.js";
import Show from "./Show.js";
import Empty from "./Empty.js";
import Status from "./Status.js";
import Confirm from "./Confirm.js";
import Error from "./Error.js";
import Form from "./Form.js";
import React, { Fragment } from 'react'
import { useVisualMode } from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {

  const save = function (name, interviewer) {
    console.log(interviewer)
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)
    .then(() => { transition(SHOW) })
    .catch((error) => { transition(ERROR_SAVE, true) })
  }

  const deleteItem = function () {
    transition(DELETING, true);
    props.onDelete(props.id).then(() => { transition(EMPTY) })
    .catch((error) => { transition(ERROR_DELETE, true) })
  }

  const confirmDelete = function () {
    transition(CONFIRM);
  }

  const editInterview = function () {
    transition(EDIT);
  }

  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY)

  return (
    <article className="appointment">
      <Header time={props.time} />
      { mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      { mode === SAVING && <Status message={"Saving"} />}
      { mode === CONFIRM && (
        <Confirm
          message={"Are you sure you would like to delete?"}
          onConfirm={deleteItem}
          onCancel={() => back()}
        />
      )
      }
      { mode === DELETING && <Status message={"Deleting"} />}
      { mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          interview={props.interview}
          onSave={save}
          onCancel={() => back()}
        />
      )
      }
      { mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          interviewers={props.interviewers}
          onDelete={confirmDelete}
          onEdit={editInterview}
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
      { mode === ERROR_SAVE && <Error onClose={() => back()} message={"There was an error saving your interview"} />}
      { mode === ERROR_DELETE && <Error onClose={() => back()} message={"There was an error deleting your interview"} />}
    </article>
  )
}
