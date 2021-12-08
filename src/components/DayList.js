import React from "react";
import DayListItem from "components/DayListItem.js";

function DayList(props) {

  const days = (props.days).map(x => {

    return (
    <DayListItem
      key={x.id}
      name={x.name}
      spots={x.spots}
      selected={x.name === props.value}
      setDay={() => props.onChange(x.name)}
    />
    )

  });

  return (
    <ul>
      {days}
    </ul>
  );
}

export default DayList;