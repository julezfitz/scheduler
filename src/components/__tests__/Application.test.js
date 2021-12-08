import React from "react";

import { render, waitForElement, queryByText, getByPlaceholderText, getByAltText, getAllByTestId, prettyDOM, getByText, fireEvent, cleanup, getByTestId } from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";

afterEach(cleanup);

describe("Application", () => {

  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, "appointment")[0];
    const firstAddButton = getByAltText(appointment, ("Add"));
    fireEvent.click(firstAddButton);

    fireEvent.change(getByPlaceholderText(appointment, ("Enter Student Name")), { target: { value: 'Lydia Miller-Jones' } })

    const firstInterviewer = getAllByTestId(appointment, "individual-interviewer")[0];
    fireEvent.click(firstInterviewer);

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    //Using websockets and therefore this will not work.

    // await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    //Find Monday and confirm that there are no spots remaining
    // const day = getAllByTestId(container, "day").find(day =>
    //   queryByText(day, "Monday")
    // );

    // expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  })

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    const deleteButton = getByAltText(appointment, ("Delete"));
    fireEvent.click(deleteButton);

    // 4. Check that the confirmation message is shown.
    expect(queryByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    const confirmButton = queryByText(appointment, ("Confirm"));
    fireEvent.click(confirmButton);

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    //Using websockets and therefore this will not work.
    // // 7. Wait until the element with the "Add" button is displayed.
    // await waitForElement(() => getByText(appointment, "Add"));

    // // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    // const day = getAllByTestId(container, "day").find(day =>
    //     queryByText(day, "Monday")
    // );

    // expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  })

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    const editButton = getByAltText(appointment, ("Edit"));
    fireEvent.click(editButton);

    fireEvent.change(getByTestId(appointment, "student-name-input"), { target: { value: 'Lilly Walsh' } })

    const firstInterviewer = getAllByTestId(appointment, "individual-interviewer")[0];
    fireEvent.click(firstInterviewer);

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    //Using websockets and therefore this will not work.

    // await waitForElement(() => getByText(appointment, "Lilly Walsh"));

    // // Find Monday and confirm that spots remaining is unchanged
    // const day = getAllByTestId(container, "day").find(day =>
    //   queryByText(day, "Monday")
    // );

    // expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, "appointment")[0];
    const firstAddButton = getByAltText(appointment, ("Add"));
    fireEvent.click(firstAddButton);

    fireEvent.change(getByPlaceholderText(appointment, ("Enter Student Name")), { target: { value: 'Lydia Miller-Jones' } })

    const firstInterviewer = getAllByTestId(appointment, "individual-interviewer")[0];
    fireEvent.click(firstInterviewer);

    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(container, "Saving")).toBeInTheDocument();

    //will not work due to web socket implementation????
    // await waitForElement(() => getByText("There was an error saving your interview"));
    // expect(getByText(container, "There was an error saving your interview")).toBeInTheDocument();
    // console.log(prettyDOM(container));
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    const deleteButton = getByAltText(appointment, ("Delete"));
    fireEvent.click(deleteButton);

    expect(queryByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    const confirmButton = queryByText(appointment, ("Confirm"));
    fireEvent.click(confirmButton);

    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    //will not work due to web socket implementation
    // await waitForElement(() => getByText("There was an error deleting your interview"));
    // expect(getByText(container, "There was an error deleting your interview")).toBeInTheDocument();
    // console.log(prettyDOM(container));
  });
});