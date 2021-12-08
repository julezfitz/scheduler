import React, { useReducer, useEffect } from "react";
import axios from "axios";
import reducer from "reducers/application";

export default function useApplicationData(props) {
  axios.defaults.baseURL = "http://localhost:8001";

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:8001");

    webSocket.onmessage = function (event) {
      const action = JSON.parse(event.data);
      if (action.type) {
        dispatch(action);
      }
    };

    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`),
    ]).then((all) => {
      dispatch({
        type: "SET_APPLICATION_DATA",
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      });
    });
  }, []);

  const bookInterview = function (id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview });
  };

  const cancelInterview = function (id) {
    return axios.delete(`/api/appointments/${id}`);
  };

  return {
    state,
    setDay: (day) => dispatch({ type: "SET_DAY", day }),
    bookInterview: bookInterview,
    cancelInterview: cancelInterview,
  };
}
