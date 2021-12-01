import React from "react";
import InterviewerListItem from "components/InterviewerListItem.js";
import "components/InterviewerList.scss";
import PropTypes from 'prop-types';

function InterviewerList(props) {

  const interviewers = (props.interviewers).map(x => {
    return (
      <InterviewerListItem
        key={x.id}
        name={x.name}
        avatar={x.avatar}
        selected={x.id === props.value}
        setInterviewer={() => props.onChange(x.id)}
      />
    )
});

return (
  <section className="interviewers">
    <h4 className="interviewers__header text--light">Interviewer</h4>
    <ul className="interviewers__list">
      {interviewers}
    </ul>
  </section>
);

}

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

export default InterviewerList;