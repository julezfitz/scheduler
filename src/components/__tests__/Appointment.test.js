import React from "react";
import { render } from "@testing-library/react";
import Appointment from "components/Appointment/index.js";

describe("Appointment", () => {
  it("renders without crashing", () => {
    render(<Appointment />);
  });

  xit("does something it is supposed to do", () => {
    // ...
  });

  xit("does something else it is supposed to do", () => {
    // ...
  });
});