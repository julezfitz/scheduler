import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames";

export default function DayListItem(props) {
  const formatSpots = function (spots) {
    if (spots === 1) {
      return `${spots} spot remaining`;
    }
    if (spots === 0) {
      return "no spots remaining";
    }
    return `${spots} spots remaining`;
  };

  const spotsText = formatSpots(props.spots);

  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0,
  });

  return (
    <li
      className={dayClass}
      data-testid="day"
      onClick={() => props.setDay(props.name)}
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{spotsText}</h3>
    </li>
  );
}
