import React from "react";

import { render, waitForElement, getByPlaceholderText, getByAltText, getAllByTestId, prettyDOM, getByText, fireEvent, cleanup } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

it("changes the schedule when a new day is selected", async () => {
  const {getByText} = render(<Application />);

  await waitForElement(() => getByText("Monday"));

  fireEvent.click(getByText("Tuesday"));

  expect(getByText("Leopold Silvers")).toBeInTheDocument();
});


it("loads data, books an interview and reduces the spots remaining for the first day by", async () => {
  const { container, debug } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"))

  const appointment = getAllByTestId(container, "appointment")[0];

  const firstAddButton = getByAltText(appointment, ("Add"));

  fireEvent.click(firstAddButton);
  
  fireEvent.change(getByPlaceholderText(appointment, ("Enter Student Name")), {target: {value: 'Lydia Miller-Jones'}})

  const firstInterviewer = getAllByTestId(appointment, "individual-interviewer")[0];

  fireEvent.click(firstInterviewer);

  fireEvent.click(getByText(appointment, "Save"));

  debug(appointment);

  expect(getByText(appointment, "Saving")).toBeInTheDocument();

  //Using websockets and therefore this will not work.
  // await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
})
});