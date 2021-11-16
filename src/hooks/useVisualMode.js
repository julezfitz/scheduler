import React, { useState, useEffect } from "react";

let mode;
let setMode;

export const useVisualMode = function (initial) {
  [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, replace = false) {
    if (replace) {
      //do nothing    
    } else {
      //add state to history
      const addHistory = newMode => (setHistory([newMode, ...history]))
      addHistory(newMode);
    }
    setMode(newMode)
  }

  const back = function () {
    if (history.length > 1) {
      setMode(history[1])
      history.shift();
    }
  }

  return { mode, transition, back };
}

